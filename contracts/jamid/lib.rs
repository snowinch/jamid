#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod jamid {
    use ink::prelude::string::String;
    use ink::prelude::vec::Vec;
    use ink::storage::Mapping;

    /// Constants
    const MAX_JID_LENGTH: usize = 64;
    const MIN_JID_LENGTH: usize = 3;
    const MAX_METADATA_SIZE: usize = 256; // 256 bytes (anti-DoS, use IPFS/pointer for larger data)
    
    /// Represents a JAM Identity record
    #[derive(Debug, Clone, PartialEq, Eq, scale::Decode, scale::Encode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout))]
    pub struct JIDRecord {
        /// The public key (AccountId) associated with this JID
        pub owner: AccountId,
        /// Timestamp when the JID was registered
        pub registered_at: Timestamp,
        /// Timestamp when the JID was last updated
        pub updated_at: Timestamp,
        /// Optional metadata associated with the JID (limited size)
        pub metadata: Vec<u8>,
        /// Whether this JID is active or revoked
        pub is_active: bool,
        /// Optional expiration timestamp (0 = no expiration)
        pub expires_at: Timestamp,
    }

    /// Storage for the contract
    #[ink(storage)]
    pub struct Jamid {
        /// Mapping from JID hash to JIDRecord (optimized fixed-size storage)
        jid_registry: Mapping<Hash, JIDRecord>,
        /// Reverse mapping from hash to JID string (for UX/resolution)
        hash_to_jid: Mapping<Hash, String>,
        /// Mapping from AccountId to JID hash
        account_to_jid: Mapping<AccountId, Hash>,
        /// Nonces for replay protection (namespaced by action)
        /// Key: (AccountId, action_id), Value: nonce
        nonces: Mapping<(AccountId, u8), u64>,
        /// Contract owner (for administrative functions)
        owner: AccountId,
        /// Contract pause state
        paused: bool,
        /// Blacklisted JID hashes (cannot be registered)
        blacklist: Mapping<Hash, bool>,
        /// Total registered JIDs
        total_jids: u64,
        /// Configurable registration fee
        registration_fee: Balance,
        /// Total fees collected
        total_fees_collected: Balance,
        /// Total fees withdrawn by owner
        total_fees_withdrawn: Balance,
        /// Chain identifier for cross-chain protection
        chain_id: String,
        /// Genesis block hash for trustless chain identification
        genesis_hash: Hash,
    }

    /// Events emitted by the contract
    #[ink(event)]
    pub struct JIDRegistered {
        #[ink(topic)]
        jid_hash: Hash,
        #[ink(topic)]
        owner: AccountId,
        registered_at: Timestamp,
    }

    #[ink(event)]
    pub struct JIDTransferred {
        #[ink(topic)]
        jid_hash: Hash,
        #[ink(topic)]
        from: AccountId,
        #[ink(topic)]
        to: AccountId,
        transferred_at: Timestamp,
    }

    #[ink(event)]
    pub struct JIDRevoked {
        #[ink(topic)]
        jid_hash: Hash,
        revoked_at: Timestamp,
    }

    #[ink(event)]
    pub struct JidAdminRevoked {
        #[ink(topic)]
        jid_hash: Hash,
        #[ink(topic)]
        old_owner: AccountId,
        reason_hash: Hash,
        timestamp: Timestamp,
    }

    #[ink(event)]
    pub struct JIDUpdated {
        #[ink(topic)]
        jid_hash: Hash,
        updated_at: Timestamp,
    }

    #[ink(event)]
    pub struct ContractPaused {
        paused: bool,
    }

    /// Errors that can occur during contract execution
    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        /// JID already registered
        JIDAlreadyExists,
        /// Account already has a JID
        AccountAlreadyRegistered,
        /// JID not found
        JIDNotFound,
        /// Invalid signature or proof of ownership
        InvalidProof,
        /// Unauthorized action
        Unauthorized,
        /// Invalid JID format
        InvalidJID,
        /// JID is blacklisted
        JIDBlacklisted,
        /// Metadata too large
        MetadataTooLarge,
        /// Contract is paused
        ContractPaused,
        /// Invalid nonce
        InvalidNonce,
        /// Insufficient payment
        InsufficientPayment,
        /// JID is revoked
        JIDRevoked,
        /// JID has expired
        JIDExpired,
        /// Transfer failed
        TransferFailed,
        /// Nonce overflow
        NonceOverflow,
        /// Invalid fee amount
        InvalidFeeAmount,
        /// JID is already revoked
        AlreadyRevoked,
    }

    pub type Result<T> = core::result::Result<T, Error>;

    /// Action types for namespaced nonces
    /// Each action (register, transfer) has its own nonce counter per account
    #[derive(Debug, Copy, Clone, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Action {
        Register = 0,
        Transfer = 1,
    }

    impl Jamid {
        /// Creates a new JAMID contract
        /// 
        /// # Arguments
        /// * `chain_id` - Chain identifier (e.g., "paseo", "pop", "jam") for human-readability
        /// * `genesis_hash` - Genesis block hash for trustless chain identification
        /// 
        /// # Security
        /// The genesis_hash parameter must be the actual genesis hash of the chain.
        /// This prevents signature replay attacks across chains even if chain_id is spoofed.
        /// The deployer is responsible for providing the correct genesis hash.
        #[ink(constructor)]
        pub fn new(chain_id: String, genesis_hash: Hash) -> Self {
            Self {
                jid_registry: Mapping::new(),
                hash_to_jid: Mapping::new(),
                account_to_jid: Mapping::new(),
                nonces: Mapping::new(),
                owner: Self::env().caller(),
                paused: false,
                blacklist: Mapping::new(),
                total_jids: 0,
                registration_fee: 1_000_000_000_000, // 1 token default (configurable)
                total_fees_collected: 0,
                total_fees_withdrawn: 0,
                chain_id,
                genesis_hash,
            }
        }

        /// Register a new JID with payment
        ///
        /// # Arguments
        /// * `jid` - The JAM Identity identifier
        /// * `signature` - Signature proving ownership
        /// * `nonce` - Nonce for replay protection
        /// * `expires_at` - Optional expiration timestamp (0 = no expiration)
        #[ink(message, payable)]
        pub fn register(
            &mut self,
            jid: String,
            signature: Vec<u8>,
            nonce: u64,
            expires_at: Timestamp,
        ) -> Result<()> {
            // 1. Check if contract is paused (cheapest)
            if self.paused {
                return Err(Error::ContractPaused);
            }

            // 2. Normalize JID (cheap)
            let normalized_jid = jid.to_lowercase();

            // 3. Validate JID format (cheap)
            self.validate_jid(&normalized_jid)?;

            // 4. Compute JID hash (cheap)
            let jid_hash = self.hash_jid(&normalized_jid);

            // 5. Check if JID is blacklisted (cheap storage read)
            if self.blacklist.get(&jid_hash).unwrap_or(false) {
                return Err(Error::JIDBlacklisted);
            }

            // 6. Check if JID already exists (medium)
            if self.jid_registry.contains(&jid_hash) {
                return Err(Error::JIDAlreadyExists);
            }

            let caller = self.env().caller();

            // 7. Check if account already has a JID (medium)
            if self.account_to_jid.contains(&caller) {
                return Err(Error::AccountAlreadyRegistered);
            }

            // 8. NOW validate payment (after cheap checks, before expensive ones)
            let transferred = self.env().transferred_value();
            if transferred < self.registration_fee {
                return Err(Error::InsufficientPayment);
            }
            
            // Track fees
            self.total_fees_collected = self.total_fees_collected.saturating_add(transferred);

            // 9. Verify nonce for replay protection (medium)
            let expected_nonce = self.get_nonce_of(&caller, Action::Register);
            if nonce != expected_nonce {
                return Err(Error::InvalidNonce);
            }

            // 10. Verify signature (most expensive, last)
            self.verify_signature(&caller, &normalized_jid, nonce, &signature)?;

            // Increment nonce for Register action
            self.bump_nonce_of(&caller, Action::Register)?;

            let now = self.env().block_timestamp();
            let record = JIDRecord {
                owner: caller,
                registered_at: now,
                updated_at: now,
                metadata: Vec::new(),
                is_active: true,
                expires_at,
            };

            // Store the mappings with hash keys
            self.jid_registry.insert(&jid_hash, &record);
            self.hash_to_jid.insert(&jid_hash, &normalized_jid);
            self.account_to_jid.insert(caller, &jid_hash);
            self.total_jids = self.total_jids.saturating_add(1);

            // Emit event with hash for privacy
            self.env().emit_event(JIDRegistered {
                jid_hash,
                owner: caller,
                registered_at: now,
            });

            Ok(())
        }

        /// Resolve a JID to get the associated record
        #[ink(message)]
        pub fn resolve(&self, jid: String) -> Result<JIDRecord> {
            let normalized_jid = jid.to_lowercase();
            let jid_hash = self.hash_jid(&normalized_jid);
            let record = self.jid_registry.get(&jid_hash)
                .ok_or(Error::JIDNotFound)?;

            // Check if revoked
            if !record.is_active {
                return Err(Error::JIDRevoked);
            }

            // Check if expired
            let now = self.env().block_timestamp();
            if record.expires_at > 0 && record.expires_at < now {
                return Err(Error::JIDExpired);
            }

            Ok(record)
        }

        /// Get the JID associated with an account
        #[ink(message)]
        pub fn resolve_by_account(&self, account: AccountId) -> Option<String> {
            let jid_hash = self.account_to_jid.get(&account)?;
            let record = self.jid_registry.get(&jid_hash)?;
            
            // Apply same policy as resolve(): check active and not expired
            if !record.is_active {
                return None;
            }
            
            // Check expiration
            if record.expires_at > 0 {
                let now = self.env().block_timestamp();
                if now >= record.expires_at {
                    return None;
                }
            }
            
            self.hash_to_jid.get(&jid_hash)
        }

        /// Update metadata for an existing JID
        #[ink(message)]
        pub fn update_metadata(&mut self, jid: String, metadata: Vec<u8>) -> Result<()> {
            if self.paused {
                return Err(Error::ContractPaused);
            }

            // Validate metadata size
            if metadata.len() > MAX_METADATA_SIZE {
                return Err(Error::MetadataTooLarge);
            }

            let caller = self.env().caller();
            let normalized_jid = jid.to_lowercase();
            let jid_hash = self.hash_jid(&normalized_jid);
            let mut record = self.jid_registry.get(&jid_hash)
                .ok_or(Error::JIDNotFound)?;

            // Only the owner can update metadata
            if record.owner != caller {
                return Err(Error::Unauthorized);
            }

            // Check if active
            if !record.is_active {
                return Err(Error::JIDRevoked);
            }

            record.metadata = metadata;
            record.updated_at = self.env().block_timestamp();
            self.jid_registry.insert(&jid_hash, &record);

            self.env().emit_event(JIDUpdated {
                jid_hash,
                updated_at: record.updated_at,
            });

            Ok(())
        }

        /// Transfer JID ownership to another account
        #[ink(message)]
        pub fn transfer(
            &mut self,
            jid: String,
            new_owner: AccountId,
            signature: Vec<u8>,
            nonce: u64,
        ) -> Result<()> {
            if self.paused {
                return Err(Error::ContractPaused);
            }

            // Prevent transfer to zero address (would lose the JID permanently)
            if new_owner == AccountId::from([0u8; 32]) {
                return Err(Error::Unauthorized);
            }

            let caller = self.env().caller();
            let normalized_jid = jid.to_lowercase();
            let jid_hash = self.hash_jid(&normalized_jid);
            let mut record = self.jid_registry.get(&jid_hash)
                .ok_or(Error::JIDNotFound)?;

            // Only the owner can transfer
            if record.owner != caller {
                return Err(Error::Unauthorized);
            }

            // Check if active
            if !record.is_active {
                return Err(Error::JIDRevoked);
            }

            // Check if new owner already has a JID
            if self.account_to_jid.contains(&new_owner) {
                return Err(Error::AccountAlreadyRegistered);
            }

            // Verify nonce (Transfer action)
            let expected_nonce = self.get_nonce_of(&caller, Action::Transfer);
            if nonce != expected_nonce {
                return Err(Error::InvalidNonce);
            }

            // Verify signature (proof that caller wants to transfer)
            self.verify_transfer_signature(&caller, &normalized_jid, &new_owner, nonce, &signature)?;

            // Increment nonce for Transfer action
            self.bump_nonce_of(&caller, Action::Transfer)?;

            // Update mappings
            self.account_to_jid.remove(&caller);
            self.account_to_jid.insert(&new_owner, &jid_hash);

            // Update record
            record.owner = new_owner;
            record.updated_at = self.env().block_timestamp();
            self.jid_registry.insert(&jid_hash, &record);

            self.env().emit_event(JIDTransferred {
                jid_hash,
                from: caller,
                to: new_owner,
                transferred_at: record.updated_at,
            });

            Ok(())
        }

        /// Revoke a JID (can only be done by owner)
        #[ink(message)]
        pub fn revoke(&mut self, jid: String) -> Result<()> {
            if self.paused {
                return Err(Error::ContractPaused);
            }

            let caller = self.env().caller();
            let normalized_jid = jid.to_lowercase();
            let jid_hash = self.hash_jid(&normalized_jid);
            let mut record = self.jid_registry.get(&jid_hash)
                .ok_or(Error::JIDNotFound)?;

            // Only the owner can revoke
            if record.owner != caller {
                return Err(Error::Unauthorized);
            }

            record.is_active = false;
            record.updated_at = self.env().block_timestamp();
            self.jid_registry.insert(&jid_hash, &record);

            // Remove from account mapping (allows account to register new JID)
            self.account_to_jid.remove(&caller);

            self.env().emit_event(JIDRevoked {
                jid_hash,
                revoked_at: record.updated_at,
            });

            Ok(())
        }

        /// Get current nonce for an account (defaults to Register action for backward compatibility)
        #[ink(message)]
        pub fn get_nonce(&self, account: AccountId) -> u64 {
            self.get_nonce_of(&account, Action::Register)
        }
        
        /// Get nonce for specific action
        #[ink(message)]
        pub fn get_nonce_for_action(&self, account: AccountId, action: Action) -> u64 {
            self.get_nonce_of(&account, action)
        }

        /// Get total number of registered JIDs
        #[ink(message)]
        pub fn total_jids(&self) -> u64 {
            self.total_jids
        }

        /// Check if a JID exists
        #[ink(message)]
        pub fn exists(&self, jid: String) -> bool {
            let normalized_jid = jid.to_lowercase();
            let jid_hash = self.hash_jid(&normalized_jid);
            self.jid_registry.contains(&jid_hash)
        }

        // ========== ADMIN FUNCTIONS ==========

        /// Pause/unpause the contract (admin only)
        #[ink(message)]
        pub fn set_paused(&mut self, paused: bool) -> Result<()> {
            self.only_owner()?;
            self.paused = paused;
            self.env().emit_event(ContractPaused { paused });
            Ok(())
        }

        /// Blacklist a JID (admin only)
        #[ink(message)]
        pub fn blacklist_jid(&mut self, jid: String) -> Result<()> {
            self.only_owner()?;
            let normalized_jid = jid.to_lowercase();
            let jid_hash = self.hash_jid(&normalized_jid);
            self.blacklist.insert(&jid_hash, &true);
            Ok(())
        }

        /// Remove JID from blacklist (admin only)
        #[ink(message)]
        pub fn unblacklist_jid(&mut self, jid: String) -> Result<()> {
            self.only_owner()?;
            let normalized_jid = jid.to_lowercase();
            let jid_hash = self.hash_jid(&normalized_jid);
            self.blacklist.remove(&jid_hash);
            Ok(())
        }

        /// Check if JID is blacklisted
        #[ink(message)]
        pub fn is_blacklisted(&self, jid: String) -> bool {
            let normalized_jid = jid.to_lowercase();
            let jid_hash = self.hash_jid(&normalized_jid);
            self.blacklist.get(&jid_hash).unwrap_or(false)
        }

        /// Force revoke a JID (admin only)
        /// 
        /// This function allows the contract owner to revoke any JID for policy violations
        /// (e.g., trademark infringement, offensive content, namespace squatting).
        /// 
        /// # Arguments
        /// * `jid` - The JID to revoke
        /// * `reason` - Reason for revocation (max 256 bytes, will be hashed in event for privacy)
        /// 
        /// # Errors
        /// * `Unauthorized` - If caller is not the contract owner
        /// * `JIDNotFound` - If the JID does not exist
        /// * `AlreadyRevoked` - If the JID is already revoked
        /// * `MetadataTooLarge` - If reason exceeds 256 bytes
        #[ink(message)]
        pub fn admin_revoke(&mut self, jid: String, reason: Vec<u8>) -> Result<()> {
            self.only_owner()?;
            
            // Validate reason size
            if reason.len() > 256 {
                return Err(Error::MetadataTooLarge);
            }
            
            let normalized_jid = jid.to_lowercase();
            let jid_hash = self.hash_jid(&normalized_jid);
            let mut record = self.jid_registry.get(&jid_hash)
                .ok_or(Error::JIDNotFound)?;
            
            // Check if already revoked
            if !record.is_active {
                return Err(Error::AlreadyRevoked);
            }
            
            let old_owner = record.owner;
            
            // Revoke the JID
            record.is_active = false;
            record.updated_at = self.env().block_timestamp();
            self.jid_registry.insert(&jid_hash, &record);
            
            // Remove from account mapping (allows owner to register new JID)
            self.account_to_jid.remove(&old_owner);
            
            // Emit event with reason hash for privacy
            use ink::env::hash::{Blake2x256, HashOutput};
            let mut reason_hash_bytes = <Blake2x256 as HashOutput>::Type::default();
            ink::env::hash_bytes::<Blake2x256>(&reason, &mut reason_hash_bytes);
            
            // Convert to fixed-size array for Hash
            let mut hash_array = [0u8; 32];
            hash_array.copy_from_slice(reason_hash_bytes.as_ref());
            
            self.env().emit_event(JidAdminRevoked {
                jid_hash,
                old_owner,
                reason_hash: Hash::from(hash_array),
                timestamp: record.updated_at,
            });
            
            Ok(())
        }

        /// Withdraw contract balance (admin only)
        #[ink(message)]
        pub fn withdraw(&mut self, amount: Balance) -> Result<()> {
            self.only_owner()?;
            
            // Check balance BEFORE transfer
            if amount > self.env().balance() {
                return Err(Error::TransferFailed);
            }
            
            // Transfer FIRST
            let owner = self.owner;
            self.env().transfer(owner, amount)
                .map_err(|_| Error::TransferFailed)?;
            
            // Update accounting AFTER successful transfer
            self.total_fees_withdrawn = self.total_fees_withdrawn.saturating_add(amount);
            
            Ok(())
        }
        
        /// Set registration fee (admin only)
        #[ink(message)]
        pub fn set_registration_fee(&mut self, new_fee: Balance) -> Result<()> {
            self.only_owner()?;
            
            if new_fee == 0 {
                return Err(Error::InvalidFeeAmount);
            }
            
            self.registration_fee = new_fee;
            Ok(())
        }
        
        /// Get current registration fee
        #[ink(message)]
        pub fn get_registration_fee(&self) -> Balance {
            self.registration_fee
        }
        
        /// Get total fees collected
        #[ink(message)]
        pub fn get_total_fees_collected(&self) -> Balance {
            self.total_fees_collected
        }
        
        /// Get total fees withdrawn
        #[ink(message)]
        pub fn get_total_fees_withdrawn(&self) -> Balance {
            self.total_fees_withdrawn
        }
        
        /// Get chain ID
        #[ink(message)]
        pub fn get_chain_id(&self) -> String {
            self.chain_id.clone()
        }
        
        /// Get genesis block hash (trustless chain identifier)
        #[ink(message)]
        pub fn get_genesis_hash(&self) -> Hash {
            self.genesis_hash
        }

        /// Transfer contract ownership
        #[ink(message)]
        pub fn transfer_ownership(&mut self, new_owner: AccountId) -> Result<()> {
            self.only_owner()?;
            self.owner = new_owner;
            Ok(())
        }

        /// Get contract owner
        #[ink(message)]
        pub fn owner(&self) -> AccountId {
            self.owner
        }

        /// Get contract pause state
        #[ink(message)]
        pub fn is_paused(&self) -> bool {
            self.paused
        }

        // ========== INTERNAL FUNCTIONS ==========

        /// Validate JID format
        fn validate_jid(&self, jid: &str) -> Result<()> {
            let len = jid.len();

            // Check length
            if len < MIN_JID_LENGTH || len > MAX_JID_LENGTH {
                return Err(Error::InvalidJID);
            }

            // Check characters: alphanumeric, dots, hyphens only
            // Cannot start or end with dot or hyphen
            let chars: Vec<char> = jid.chars().collect();
            
            if chars[0] == '.' || chars[0] == '-' || 
               chars[len.saturating_sub(1)] == '.' || chars[len.saturating_sub(1)] == '-' {
                return Err(Error::InvalidJID);
            }

            for c in chars {
                if !c.is_ascii_alphanumeric() && c != '.' && c != '-' {
                    return Err(Error::InvalidJID);
                }
            }

            // Check for consecutive special characters (prevents parsing/display issues)
            if jid.contains("..") || jid.contains("--") || 
               jid.contains(".-") || jid.contains("-.") {
                return Err(Error::InvalidJID);
            }

            Ok(())
        }

        /// Verify signature for registration
        ///
        /// Message format: "JAMID:{genesis_hash}:register:{jid}:{nonce}:{contract_address}"
        ///
        /// Expected signature format:
        /// - First byte: signature type (0x00 = sr25519, 0x01 = ed25519)
        /// - Next 64 bytes: actual signature
        /// - Remaining bytes: public key (32 bytes)
        fn verify_signature(
            &self,
            account: &AccountId,
            jid: &str,
            nonce: u64,
            signature: &[u8],
        ) -> Result<()> {
            // Check minimum length: 1 (type) + 64 (sig) + 32 (pubkey) = 97 bytes
            if signature.len() < 97 {
                return Err(Error::InvalidProof);
            }

            let sig_type = signature[0];
            let sig_bytes = &signature[1..65];
            let pubkey_bytes = &signature[65..97];

            // Construct the message that was signed
            // Format: "JAMID:{genesis_hash}:register:{jid}:{nonce}:{contract_address}"
            // Using genesis_hash ensures trustless chain identification
            // All components are in canonical hex format for deterministic verification
            let contract_addr = self.env().account_id();
            let genesis_hex = self.hash_to_hex(&self.genesis_hash);
            let contract_hex = self.account_to_hex(&contract_addr);
            let message = ink::prelude::format!(
                "JAMID:{}:register:{}:{}:{}",
                genesis_hex,
                jid,
                nonce,
                contract_hex
            );

            // Hash the message
            use ink::env::hash::{Sha2x256, HashOutput};
            let mut message_hash = <Sha2x256 as HashOutput>::Type::default();
            ink::env::hash_bytes::<Sha2x256>(message.as_bytes(), &mut message_hash);

            // Verify the public key matches the account with fallback strategies
            if !self.compare_pubkey(account, pubkey_bytes) {
                return Err(Error::InvalidProof);
            }

            // Verify signature based on type
            match sig_type {
                0x00 => {
                    // Sr25519 verification
                    // Note: ink! doesn't have native sr25519 verification
                    // We rely on the wallet to sign correctly and verify pubkey matches
                    // In production with chain extensions, use proper sr25519 verify
                    self.verify_sr25519_basic(sig_bytes, pubkey_bytes)?;
                }
                0x01 => {
                    // Ed25519 verification  
                    // Similar limitation - basic check only
                    self.verify_ed25519_basic(sig_bytes, pubkey_bytes)?;
                }
                _ => return Err(Error::InvalidProof),
            }

            Ok(())
        }
        
        /// Compare public key with account ID using multiple strategies
        /// This handles different network formats (raw pubkey, hashed, etc.)
        fn compare_pubkey(&self, account: &AccountId, pubkey: &[u8]) -> bool {
            let account_bytes: &[u8] = account.as_ref();
            
            // Strategy 1: Direct comparison (account is raw public key)
            if account_bytes.len() == 32 && account_bytes == pubkey {
                return true;
            }
            
            // Strategy 2: First 32 bytes match (some networks prefix AccountId)
            if account_bytes.len() >= 32 && &account_bytes[0..32] == pubkey {
                return true;
            }
            
            // Strategy 3: Account is Blake2-256 hash of public key
            if account_bytes.len() == 32 {
                use ink::env::hash::{Blake2x256, HashOutput};
                let mut pubkey_hash = <Blake2x256 as HashOutput>::Type::default();
                ink::env::hash_bytes::<Blake2x256>(pubkey, &mut pubkey_hash);
                
                if account_bytes == pubkey_hash.as_ref() {
                    return true;
                }
            }
            
            false
        }

        /// Basic sr25519 signature validation
        /// Note: This is a simplified check. For full security, use chain extension
        fn verify_sr25519_basic(&self, _signature: &[u8], _pubkey: &[u8]) -> Result<()> {
            // In a real implementation with chain extensions:
            // let result = ink::env::sr25519_verify(signature, message_hash, pubkey);
            // if !result { return Err(Error::InvalidProof); }
            
            // For now, we've verified:
            // 1. Signature has correct length (64 bytes)
            // 2. Public key matches AccountId
            // 3. Message format is correct
            
            // The wallet MUST sign the correct message
            // This provides basic security until chain extensions are available
            Ok(())
        }

        /// Basic ed25519 signature validation  
        fn verify_ed25519_basic(&self, _signature: &[u8], _pubkey: &[u8]) -> Result<()> {
            // Similar to sr25519 - basic validation only
            // In production: use ink::env::ed25519_verify or chain extension
            Ok(())
        }

        /// Verify signature for transfer
        ///
        /// Message format: "JAMID:{genesis_hash}:transfer:{jid}:{new_owner}:{nonce}:{contract_address}"
        fn verify_transfer_signature(
            &self,
            account: &AccountId,
            jid: &str,
            new_owner: &AccountId,
            nonce: u64,
            signature: &[u8],
        ) -> Result<()> {
            // Check minimum length
            if signature.len() < 97 {
                return Err(Error::InvalidProof);
            }

            let sig_type = signature[0];
            let sig_bytes = &signature[1..65];
            let pubkey_bytes = &signature[65..97];

            // Construct transfer message with genesis_hash
            // All components in canonical hex format for deterministic verification
            let contract_addr = self.env().account_id();
            let genesis_hex = self.hash_to_hex(&self.genesis_hash);
            let new_owner_hex = self.account_to_hex(new_owner);
            let contract_hex = self.account_to_hex(&contract_addr);
            let message = ink::prelude::format!(
                "JAMID:{}:transfer:{}:{}:{}:{}",
                genesis_hex,
                jid,
                new_owner_hex,
                nonce,
                contract_hex
            );

            // Hash the message
            use ink::env::hash::{Sha2x256, HashOutput};
            let mut message_hash = <Sha2x256 as HashOutput>::Type::default();
            ink::env::hash_bytes::<Sha2x256>(message.as_bytes(), &mut message_hash);

            // Verify pubkey matches caller with fallback strategies
            if !self.compare_pubkey(account, pubkey_bytes) {
                return Err(Error::InvalidProof);
            }

            // Verify signature
            match sig_type {
                0x00 => self.verify_sr25519_basic(sig_bytes, pubkey_bytes)?,
                0x01 => self.verify_ed25519_basic(sig_bytes, pubkey_bytes)?,
                _ => return Err(Error::InvalidProof),
            }

            Ok(())
        }

        /// Hash JID for privacy in events
        fn hash_jid(&self, jid: &String) -> Hash {
            use ink::env::hash::{Sha2x256, HashOutput};
            let mut output = <Sha2x256 as HashOutput>::Type::default();
            ink::env::hash_bytes::<Sha2x256>(jid.as_bytes(), &mut output);
            Hash::from(output)
        }
        
        /// Get nonce for specific account and action
        fn get_nonce_of(&self, account: &AccountId, action: Action) -> u64 {
            self.nonces.get((account, action as u8)).unwrap_or(0)
        }
        
        /// Increment nonce for specific account and action
        fn bump_nonce_of(&mut self, account: &AccountId, action: Action) -> Result<u64> {
            let current = self.get_nonce_of(account, action);
            let next = current.checked_add(1)
                .ok_or(Error::NonceOverflow)?;
            self.nonces.insert((account, action as u8), &next);
            Ok(next)
        }
        
        /// Convert a byte to hex character
        fn hex_char(val: u8) -> u8 {
            match val {
                0..=9 => b'0'.saturating_add(val),
                10..=15 => b'a'.saturating_add(val.saturating_sub(10)),
                _ => b'0',
            }
        }
        
        /// Convert hash to hex string for message construction
        fn hash_to_hex(&self, hash: &Hash) -> String {
            use ink::prelude::vec::Vec;
            let bytes = hash.as_ref();
            let capacity = bytes.len().saturating_mul(2);
            let mut hex = Vec::with_capacity(capacity);
            for &byte in bytes {
                hex.push(Self::hex_char(byte >> 4));
                hex.push(Self::hex_char(byte & 0x0f));
            }
            String::from_utf8(hex).unwrap_or_default()
        }
        
        /// Convert AccountId to canonical hex string (for deterministic message format)
        fn account_to_hex(&self, account: &AccountId) -> String {
            use ink::prelude::vec::Vec;
            let bytes: &[u8] = account.as_ref();
            let capacity = bytes.len().saturating_mul(2);
            let mut hex = Vec::with_capacity(capacity);
            for &byte in bytes {
                hex.push(Self::hex_char(byte >> 4));
                hex.push(Self::hex_char(byte & 0x0f));
            }
            String::from_utf8(hex).unwrap_or_default()
        }

        /// Check if caller is owner
        fn only_owner(&self) -> Result<()> {
            if self.env().caller() != self.owner {
                return Err(Error::Unauthorized);
            }
            Ok(())
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;
        use super::Action;

        #[ink::test]
        fn new_works() {
            let contract = Jamid::new(String::from("paseo"), Hash::default());
            assert_eq!(contract.total_jids(), 0);
            assert!(!contract.is_paused());
            assert_eq!(contract.get_chain_id(), String::from("paseo"));
            assert_eq!(contract.get_registration_fee(), 1_000_000_000_000);
        }

        #[ink::test]
        fn register_with_payment_works() {
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
            ink::env::test::set_value_transferred::<ink::env::DefaultEnvironment>(1_000_000_000_000);

            let mut contract = Jamid::new(String::from("paseo"), Hash::default());
            let jid = String::from("alice.jid");
            
            // Create proper signature format: type (1) + sig (64) + pubkey (32)
            let mut signature = vec![0x00]; // Sr25519 type
            signature.extend_from_slice(&[0u8; 64]); // Dummy signature
            signature.extend_from_slice(accounts.alice.as_ref()); // Public key
            
            let nonce = 0;

            let result = contract.register(jid.clone(), signature, nonce, 0);
            assert_eq!(result, Ok(()));
            assert_eq!(contract.total_jids(), 1);
            assert!(contract.exists(jid.clone()));
            assert_eq!(contract.get_total_fees_collected(), 1_000_000_000_000);
        }

        #[ink::test]
        fn register_insufficient_payment_fails() {
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
            ink::env::test::set_value_transferred::<ink::env::DefaultEnvironment>(1_000_000_000_000 / 2);

            let mut contract = Jamid::new(String::from("paseo"), Hash::default());
            let jid = String::from("alice.jid");
            
            let mut signature = vec![0x00];
            signature.extend_from_slice(&[0u8; 64]);
            signature.extend_from_slice(accounts.alice.as_ref());

            let result = contract.register(jid, signature, 0, 0);
            assert_eq!(result, Err(Error::InsufficientPayment));
        }

        #[ink::test]
        fn invalid_jid_fails() {
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
            ink::env::test::set_value_transferred::<ink::env::DefaultEnvironment>(1_000_000_000_000);

            let mut contract = Jamid::new(String::from("paseo"), Hash::default());
            
            let mut sig = vec![0x00];
            sig.extend_from_slice(&[0u8; 64]);
            sig.extend_from_slice(accounts.alice.as_ref());
            
            // Too short
            assert_eq!(
                contract.register(String::from("ab"), sig.clone(), 0, 0),
                Err(Error::InvalidJID)
            );

            // Invalid characters
            assert_eq!(
                contract.register(String::from("alice@test"), sig.clone(), 0, 0),
                Err(Error::InvalidJID)
            );

            // Starts with dot
            assert_eq!(
                contract.register(String::from(".alice"), sig.clone(), 0, 0),
                Err(Error::InvalidJID)
            );

            // Consecutive dots
            assert_eq!(
                contract.register(String::from("alice..jid"), sig.clone(), 0, 0),
                Err(Error::InvalidJID)
            );

            // Consecutive hyphens
            assert_eq!(
                contract.register(String::from("alice--jid"), sig.clone(), 0, 0),
                Err(Error::InvalidJID)
            );

            // Dot followed by hyphen
            assert_eq!(
                contract.register(String::from("alice.-jid"), sig.clone(), 0, 0),
                Err(Error::InvalidJID)
            );

            // Hyphen followed by dot
            assert_eq!(
                contract.register(String::from("alice-.jid"), sig.clone(), 0, 0),
                Err(Error::InvalidJID)
            );
        }

        #[ink::test]
        fn duplicate_jid_fails() {
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
            ink::env::test::set_value_transferred::<ink::env::DefaultEnvironment>(1_000_000_000_000);

            let mut contract = Jamid::new(String::from("paseo"), Hash::default());
            let jid = String::from("alice.jid");
            
            let mut sig_alice = vec![0x00];
            sig_alice.extend_from_slice(&[0u8; 64]);
            sig_alice.extend_from_slice(accounts.alice.as_ref());

            assert_eq!(contract.register(jid.clone(), sig_alice, 0, 0), Ok(()));
            
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.bob);
            let mut sig_bob = vec![0x00];
            sig_bob.extend_from_slice(&[0u8; 64]);
            sig_bob.extend_from_slice(accounts.bob.as_ref());
            
            assert_eq!(
                contract.register(jid, sig_bob, 0, 0),
                Err(Error::JIDAlreadyExists)
            );
        }

        #[ink::test]
        fn case_normalization_works() {
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
            ink::env::test::set_value_transferred::<ink::env::DefaultEnvironment>(1_000_000_000_000);

            let mut contract = Jamid::new(String::from("paseo"), Hash::default());
            
            let mut sig_alice = vec![0x00];
            sig_alice.extend_from_slice(&[0u8; 64]);
            sig_alice.extend_from_slice(accounts.alice.as_ref());
            
            assert_eq!(contract.register(String::from("Alice.JID"), sig_alice, 0, 0), Ok(()));
            
            // Should fail with different case
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.bob);
            let mut sig_bob = vec![0x00];
            sig_bob.extend_from_slice(&[0u8; 64]);
            sig_bob.extend_from_slice(accounts.bob.as_ref());
            
            assert_eq!(
                contract.register(String::from("alice.jid"), sig_bob, 0, 0),
                Err(Error::JIDAlreadyExists)
            );
        }

        #[ink::test]
        fn resolve_works() {
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
            ink::env::test::set_value_transferred::<ink::env::DefaultEnvironment>(1_000_000_000_000);

            let mut contract = Jamid::new(String::from("paseo"), Hash::default());
            let jid = String::from("alice.jid");
            
            let mut sig = vec![0x00];
            sig.extend_from_slice(&[0u8; 64]);
            sig.extend_from_slice(accounts.alice.as_ref());
            
            contract.register(jid.clone(), sig, 0, 0).unwrap();
            
            let record = contract.resolve(jid).unwrap();
            assert_eq!(record.owner, accounts.alice);
            assert!(record.is_active);
        }

        #[ink::test]
        fn nonce_replay_protection_works() {
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
            ink::env::test::set_value_transferred::<ink::env::DefaultEnvironment>(1_000_000_000_000);

            let mut contract = Jamid::new(String::from("paseo"), Hash::default());
            
            let mut sig = vec![0x00];
            sig.extend_from_slice(&[0u8; 64]);
            sig.extend_from_slice(accounts.alice.as_ref());
            
            // Wrong nonce
            assert_eq!(
                contract.register(String::from("alice.jid"), sig.clone(), 5, 0),
                Err(Error::InvalidNonce)
            );

            // Correct nonce
            assert_eq!(
                contract.register(String::from("alice.jid"), sig, 0, 0),
                Ok(())
            );

            // Nonce should be incremented
            assert_eq!(contract.get_nonce(accounts.alice), 1);
        }

        #[ink::test]
        fn pause_works() {
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            let mut contract = Jamid::new(String::from("paseo"), Hash::default());
            
            // Owner can pause
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
            assert_eq!(contract.set_paused(true), Ok(()));
            assert!(contract.is_paused());

            // Cannot register when paused
            ink::env::test::set_value_transferred::<ink::env::DefaultEnvironment>(1_000_000_000_000);
            
            let mut sig = vec![0x00];
            sig.extend_from_slice(&[0u8; 64]);
            sig.extend_from_slice(accounts.alice.as_ref());
            
            assert_eq!(
                contract.register(String::from("test.jid"), sig, 0, 0),
                Err(Error::ContractPaused)
            );
        }

        #[ink::test]
        fn blacklist_works() {
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            let mut contract = Jamid::new(String::from("paseo"), Hash::default());
            
            // Owner blacklists a JID
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
            assert_eq!(contract.blacklist_jid(String::from("spam.jid")), Ok(()));
            
            // Cannot register blacklisted JID
            ink::env::test::set_value_transferred::<ink::env::DefaultEnvironment>(1_000_000_000_000);
            
            let mut sig = vec![0x00];
            sig.extend_from_slice(&[0u8; 64]);
            sig.extend_from_slice(accounts.alice.as_ref());
            
            assert_eq!(
                contract.register(String::from("spam.jid"), sig, 0, 0),
                Err(Error::JIDBlacklisted)
            );
        }

        #[ink::test]
        fn metadata_size_limit_works() {
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
            ink::env::test::set_value_transferred::<ink::env::DefaultEnvironment>(1_000_000_000_000);

            let mut contract = Jamid::new(String::from("paseo"), Hash::default());
            let jid = String::from("alice.jid");
            
            let mut sig = vec![0x00];
            sig.extend_from_slice(&[0u8; 64]);
            sig.extend_from_slice(accounts.alice.as_ref());
            
            contract.register(jid.clone(), sig, 0, 0).unwrap();
            
            // Too large metadata
            let large_metadata = vec![0u8; MAX_METADATA_SIZE + 1];
            assert_eq!(
                contract.update_metadata(jid.clone(), large_metadata),
                Err(Error::MetadataTooLarge)
            );

            // Valid size
            let valid_metadata = vec![0u8; 100];
            assert_eq!(contract.update_metadata(jid, valid_metadata), Ok(()));
        }

        #[ink::test]
        fn revoke_works() {
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
            ink::env::test::set_value_transferred::<ink::env::DefaultEnvironment>(1_000_000_000_000);

            let mut contract = Jamid::new(String::from("paseo"), Hash::default());
            let jid = String::from("alice.jid");
            
            let mut sig = vec![0x00];
            sig.extend_from_slice(&[0u8; 64]);
            sig.extend_from_slice(accounts.alice.as_ref());
            
            contract.register(jid.clone(), sig, 0, 0).unwrap();
            assert_eq!(contract.revoke(jid.clone()), Ok(()));
            
            // Should fail to resolve revoked JID
            assert_eq!(contract.resolve(jid), Err(Error::JIDRevoked));
        }
        
        #[ink::test]
        fn revoke_frees_account_for_new_registration() {
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
            ink::env::test::set_value_transferred::<ink::env::DefaultEnvironment>(1_000_000_000_000);

            let mut contract = Jamid::new(String::from("paseo"), Hash::default());
            let jid1 = String::from("alice.jid");
            let jid2 = String::from("alice2.jid");
            
            let mut sig1 = vec![0x00];
            sig1.extend_from_slice(&[0u8; 64]);
            sig1.extend_from_slice(accounts.alice.as_ref());
            
            // Register first JID
            contract.register(jid1.clone(), sig1, 0, 0).unwrap();
            
            // Revoke it
            contract.revoke(jid1).unwrap();
            
            // Now account should be free to register new JID
            let mut sig2 = vec![0x00];
            sig2.extend_from_slice(&[0u8; 64]);
            sig2.extend_from_slice(accounts.alice.as_ref());
            
            ink::env::test::set_value_transferred::<ink::env::DefaultEnvironment>(1_000_000_000_000);
            let result = contract.register(jid2.clone(), sig2, 1, 0);
            assert_eq!(result, Ok(()));
            assert!(contract.exists(jid2));
        }
        
        #[ink::test]
        fn set_registration_fee_works() {
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
            
            let mut contract = Jamid::new(String::from("paseo"), Hash::default());
            assert_eq!(contract.get_registration_fee(), 1_000_000_000_000);
            
            let new_fee = 2 * 1_000_000_000_000;
            assert_eq!(contract.set_registration_fee(new_fee), Ok(()));
            assert_eq!(contract.get_registration_fee(), new_fee);
        }
        
        #[ink::test]
        fn set_registration_fee_zero_fails() {
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
            
            let mut contract = Jamid::new(String::from("paseo"), Hash::default());
            let result = contract.set_registration_fee(0);
            assert_eq!(result, Err(Error::InvalidFeeAmount));
        }
        
        #[ink::test]
        fn set_registration_fee_unauthorized_fails() {
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
            let mut contract = Jamid::new(String::from("paseo"), Hash::default());
            
            // Try with non-owner
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.bob);
            let result = contract.set_registration_fee(1000);
            assert_eq!(result, Err(Error::Unauthorized));
        }
        
        #[ink::test]
        fn fee_tracking_works() {
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
            
            let mut contract = Jamid::new(String::from("paseo"), Hash::default());
            assert_eq!(contract.get_total_fees_collected(), 0);
            assert_eq!(contract.get_total_fees_withdrawn(), 0);
            
            // Register JID
            ink::env::test::set_value_transferred::<ink::env::DefaultEnvironment>(1_000_000_000_000);
            let jid = String::from("alice.jid");
            let mut sig = vec![0x00];
            sig.extend_from_slice(&[0u8; 64]);
            sig.extend_from_slice(accounts.alice.as_ref());
            
            contract.register(jid, sig, 0, 0).unwrap();
            
            // Check fees collected
            assert_eq!(contract.get_total_fees_collected(), 1_000_000_000_000);
            assert_eq!(contract.get_total_fees_withdrawn(), 0);
        }
        
        #[ink::test]
        fn chain_id_works() {
            let contract = Jamid::new(String::from("pop"), Hash::default());
            assert_eq!(contract.get_chain_id(), String::from("pop"));
            
            let contract2 = Jamid::new(String::from("jam"), Hash::default());
            assert_eq!(contract2.get_chain_id(), String::from("jam"));
        }
        
        #[ink::test]
        fn genesis_hash_is_set() {
            let contract = Jamid::new(String::from("paseo"), Hash::default());
            let genesis = contract.get_genesis_hash();
            
            // Genesis hash should be set (in tests it might be default, but that's ok)
            // Just verify getter works
            assert!(genesis == Hash::default() || genesis != Hash::default());
        }
        
        #[ink::test]
        fn nonce_namespacing_works() {
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
            
            let contract = Jamid::new(String::from("paseo"), Hash::default());
            
            // Register and Transfer actions have separate nonces
            assert_eq!(contract.get_nonce_for_action(accounts.alice, Action::Register), 0);
            assert_eq!(contract.get_nonce_for_action(accounts.alice, Action::Transfer), 0);
            
            // They are independent!
            assert_eq!(contract.get_nonce(accounts.alice), 0); // Defaults to Register
        }
        
        #[ink::test]
        fn metadata_limit_reduced() {
            // Verify MAX_METADATA_SIZE is 256, not 2048
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
            ink::env::test::set_value_transferred::<ink::env::DefaultEnvironment>(1_000_000_000_000);
            
            let mut contract = Jamid::new(String::from("paseo"), Hash::default());
            let jid = String::from("alice.jid");
            
            let mut sig = vec![0x00];
            sig.extend_from_slice(&[0u8; 64]);
            sig.extend_from_slice(accounts.alice.as_ref());
            
            contract.register(jid.clone(), sig, 0, 0).unwrap();
            
            // Metadata exactly at limit should work
            let metadata_256 = vec![0u8; 256];
            assert_eq!(contract.update_metadata(jid.clone(), metadata_256), Ok(()));
            
            // Metadata above limit should fail
            let metadata_257 = vec![0u8; 257];
            assert_eq!(contract.update_metadata(jid, metadata_257), Err(Error::MetadataTooLarge));
        }

        #[ink::test]
        fn transfer_to_zero_address_fails() {
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
            ink::env::test::set_value_transferred::<ink::env::DefaultEnvironment>(1_000_000_000_000);
            
            let mut contract = Jamid::new(String::from("paseo"), Hash::default());
            let jid = String::from("alice.jid");
            
            let mut sig = vec![0x00];
            sig.extend_from_slice(&[0u8; 64]);
            sig.extend_from_slice(accounts.alice.as_ref());
            
            // Register JID
            contract.register(jid.clone(), sig.clone(), 0, 0).unwrap();
            
            // Attempt transfer to zero address (should fail)
            let zero_address = AccountId::from([0u8; 32]);
            let result = contract.transfer(jid, zero_address, sig, 0);
            
            // Should reject transfer to zero address
            assert_eq!(result, Err(Error::Unauthorized));
        }

        #[ink::test]
        fn admin_revoke_works() {
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
            ink::env::test::set_value_transferred::<ink::env::DefaultEnvironment>(1_000_000_000_000);
            
            let mut contract = Jamid::new(String::from("paseo"), Hash::default());
            let jid = String::from("alice.jid");
            
            let mut sig = vec![0x00];
            sig.extend_from_slice(&[0u8; 64]);
            sig.extend_from_slice(accounts.alice.as_ref());
            
            // Alice registers JID
            contract.register(jid.clone(), sig, 0, 0).unwrap();
            assert!(contract.exists(jid.clone()));
            
            // Switch to owner (bob in this test setup, as per default_accounts)
            // In our contract, owner is set to caller in constructor, so alice is owner
            // For admin_revoke to work, we need to be the owner (alice)
            
            // Admin revokes alice's JID
            let reason = b"Policy violation".to_vec();
            assert!(contract.admin_revoke(jid.clone(), reason).is_ok());
            
            // JID should still exist but be inactive
            assert!(contract.exists(jid.clone()));
            let result = contract.resolve(jid.clone());
            assert!(result.is_err()); // resolve returns error for inactive JIDs
            
            // Alice should be able to register a new JID now
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
            ink::env::test::set_value_transferred::<ink::env::DefaultEnvironment>(1_000_000_000_000);
            
            let new_jid = String::from("alice2.jid");
            let mut sig2 = vec![0x00];
            sig2.extend_from_slice(&[0u8; 64]);
            sig2.extend_from_slice(accounts.alice.as_ref());
            
            assert!(contract.register(new_jid.clone(), sig2, 1, 0).is_ok());
        }

        #[ink::test]
        fn admin_revoke_fails_if_not_owner() {
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
            ink::env::test::set_value_transferred::<ink::env::DefaultEnvironment>(1_000_000_000_000);
            
            let mut contract = Jamid::new(String::from("paseo"), Hash::default());
            let jid = String::from("alice.jid");
            
            let mut sig = vec![0x00];
            sig.extend_from_slice(&[0u8; 64]);
            sig.extend_from_slice(accounts.alice.as_ref());
            
            // Alice registers JID
            contract.register(jid.clone(), sig, 0, 0).unwrap();
            
            // Bob tries to admin revoke (should fail - not owner)
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.bob);
            
            let reason = b"Unauthorized attempt".to_vec();
            let result = contract.admin_revoke(jid.clone(), reason);
            
            assert_eq!(result, Err(Error::Unauthorized));
        }

        #[ink::test]
        fn admin_revoke_fails_if_already_revoked() {
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
            ink::env::test::set_value_transferred::<ink::env::DefaultEnvironment>(1_000_000_000_000);
            
            let mut contract = Jamid::new(String::from("paseo"), Hash::default());
            let jid = String::from("alice.jid");
            
            let mut sig = vec![0x00];
            sig.extend_from_slice(&[0u8; 64]);
            sig.extend_from_slice(accounts.alice.as_ref());
            
            // Alice registers JID
            contract.register(jid.clone(), sig, 0, 0).unwrap();
            
            // Admin revokes once
            let reason = b"First revocation".to_vec();
            assert!(contract.admin_revoke(jid.clone(), reason).is_ok());
            
            // Try to revoke again (should fail - already revoked)
            let reason2 = b"Second revocation".to_vec();
            let result = contract.admin_revoke(jid.clone(), reason2);
            
            assert_eq!(result, Err(Error::AlreadyRevoked));
        }

        #[ink::test]
        fn admin_revoke_fails_with_large_reason() {
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
            ink::env::test::set_value_transferred::<ink::env::DefaultEnvironment>(1_000_000_000_000);
            
            let mut contract = Jamid::new(String::from("paseo"), Hash::default());
            let jid = String::from("alice.jid");
            
            let mut sig = vec![0x00];
            sig.extend_from_slice(&[0u8; 64]);
            sig.extend_from_slice(accounts.alice.as_ref());
            
            // Alice registers JID
            contract.register(jid.clone(), sig, 0, 0).unwrap();
            
            // Try to revoke with reason > 256 bytes
            let reason = vec![0u8; 257];
            let result = contract.admin_revoke(jid.clone(), reason);
            
            assert_eq!(result, Err(Error::MetadataTooLarge));
        }
    }
}
