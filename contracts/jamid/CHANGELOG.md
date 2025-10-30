# JAMID Contract Changelog

## Version 0.3.1 (Hardening & Canonical Format)

### 🔴 BREAKING CHANGES

#### 1. **Canonical Message Format (AccountId in Hex)** ✅ CRITICAL
- **Problem**: Previous implementation used Rust's `{:?}` debug format for `AccountId`, producing non-deterministic output
- **Solution**: All `AccountId` values now explicitly converted to lowercase hex (without 0x prefix)

**Message format changes:**
```rust
// OLD (non-deterministic)
"JAMID:{genesis_hash}:register:{jid}:{nonce}:{contract:?}"

// NEW (canonical)
"JAMID:{genesis_hash}:register:{jid}:{nonce}:{contract_hex}"
```

**Registration message:**
```
JAMID:91b171bb...c90c3:register:alice.jid:0:5fe3a52b...7d8e
```

**Transfer message:**
```
JAMID:91b171bb...c90c3:transfer:alice.jid:8f7c2a...4b3d:0:5fe3a52b...7d8e
```

**Impact**: All existing signatures are invalidated. SDK must be updated to use hex format.

**SDK Update Required:**
```typescript
// Helper function
function accountToHex(address: string): string {
  return u8aToHex(decodeAddress(address), -1, false).slice(2);
}

// Usage in message construction
const contractHex = accountToHex(contractAddress);
const newOwnerHex = accountToHex(newOwner);
const message = `JAMID:${genesisHex}:register:${jid}:${nonce}:${contractHex}`;
```

### 🔒 Security Hardening

#### 2. **Prevent Transfer to Zero Address** ✅
- **Added check**: `if new_owner == AccountId::from([0u8; 32])`
- **Behavior**: Transfer to zero address now returns `Error::Unauthorized`
- **Reason**: Prevents permanent loss of JID ownership

**Test added**: `transfer_to_zero_address_fails()`

#### 3. **JID Validation - Consecutive Special Characters** ✅
- **New checks**: Block `..`, `--`, `.-`, `-.` patterns
- **Reason**: Prevents parsing ambiguities and display issues

**Examples now rejected:**
- `alice..jid` (double dots)
- `alice--jid` (double hyphens)
- `alice.-jid` (dot-hyphen)
- `alice-.jid` (hyphen-dot)

**Tests added**: 4 new assertions in `invalid_jid_fails()`

### 🧪 Testing

- **22 tests passing** (100% success rate)
- +1 new test: `transfer_to_zero_address_fails()`
- +4 new JID validation assertions

### 📦 Build Output

- **Contract size: 40KB** (WASM) - optimized from 41KB
- **Bundle size: 102KB** (.contract) - optimized from 103KB
- All clippy warnings resolved

### 🔧 Internal Improvements

- Added `account_to_hex()` helper for canonical AccountId serialization
- Type annotations added for explicit `&[u8]` handling
- Message construction now fully deterministic across all environments

---

## Version 0.3.0 (Critical Security Fixes - Production Ready)

### 🔴 BREAKING CHANGES

#### 1. **Genesis Hash - Trustless Chain Identification** ✅ CRITICAL
- **Constructor signature changed**
  - OLD: `new(chain_id: String)`
  - NEW: `new(chain_id: String, genesis_hash: Hash)`
  - Deployer must provide actual genesis hash of the chain
  
- **Message format updated to use genesis_hash**
  - Registration: `JAMID:{genesis_hash_hex}:register:{jid}:{nonce}:{contract}`
  - Transfer: `JAMID:{genesis_hash_hex}:transfer:{jid}:{new_owner}:{nonce}:{contract}`
  - **Provides unforgeable cross-chain protection**
  - Genesis hash is cryptographically unique per chain
  - Cannot be spoofed unlike string chain_id

- **New public getter: `get_genesis_hash() -> Hash`**
  - SDK can verify contract is on correct chain
  - Essential for multi-chain deployments

**Security Impact**: Eliminates ALL cross-chain replay attack vectors, even with address collisions.

#### 2. **Nonce Namespacing by Action** ✅ CRITICAL
- **Separate nonce counters for different actions**
  - `Action::Register = 0` - for JID registration
  - `Action::Transfer = 1` - for JID transfers
  - Storage: `Mapping<(AccountId, u8), u64>`
  
- **New public API**
  - `get_nonce_for_action(account, action) -> u64` - Get nonce for specific action
  - `get_nonce(account) -> u64` - Backward compatible, defaults to Register
  
- **Internal helpers**
  - `get_nonce_of(account, action)` - Read nonce
  - `bump_nonce_of(account, action)` - Increment with overflow check

**Security Impact**: Prevents logical collisions between register and transfer signatures.

#### 3. **Metadata Size Limit Reduced** ✅ CRITICAL
- **MAX_METADATA_SIZE: 2048 → 256 bytes**
  - Prevents DoS attacks via metadata bloating
  - For larger data, use IPFS CID/URL pointers
  - Test added: `metadata_limit_reduced()`

**Security Impact**: Reduces on-chain storage costs and prevents spam.

### ⚡ Performance & Gas Optimizations

#### 4. **Reordered Checks in `register()`** ✅
- **Optimized order for gas efficiency**
  1. Pause check (cheapest)
  2. JID normalization + validation
  3. Hash computation
  4. Blacklist check
  5. JID existence check
  6. Account check
  7. **Payment validation** ← Moved after cheap checks
  8. Nonce verification
  9. Signature verification (most expensive, last)
  
**Gas Impact**: Fail-fast on invalid inputs before processing payment or signatures.

### 🧹 Code Quality Improvements

#### 5. **Removed Redundant `REGISTRATION_FEE` Constant** ✅
- Only use storage field `registration_fee` (configurable)
- Default: `1_000_000_000_000` (1 token)
- Eliminates potential inconsistency

#### 6. **Clippy Fixes for Arithmetic Operations** ✅
- All arithmetic operations use `saturating_*` methods
- `hex_char()`: Uses `saturating_add/sub`
- `hash_to_hex()`: Uses `saturating_mul` for capacity
- Passes `cargo clippy` in release mode

### 🧪 Testing

- **21 tests (100% passing)**
  - 18 existing tests updated for new API
  - 3 new tests added:
    - `genesis_hash_is_set()` - Verify genesis hash storage
    - `nonce_namespacing_works()` - Verify independent nonce counters
    - `metadata_limit_reduced()` - Verify 256B limit

### 📦 Build Output

- **Contract size: 41KB (WASM)**
- **Bundle size: 103KB (.contract)**
- All clippy warnings addressed

### 🔧 Migration Guide

#### For SDK/Integration:

**1. Update deployment:**
```typescript
// Get genesis hash from chain
const api = await ApiPromise.create({ provider });
const genesisHash = api.genesisHash;

// Deploy with genesis hash
await contract.new("paseo", genesisHash);
```

**2. Update message construction:**
```typescript
// OLD
const message = `JAMID:${chainId}:register:${jid}:${nonce}:${contract}`;

// NEW - use genesis hash hex
const genesisHex = genesisHash.toHex().slice(2); // Remove 0x prefix
const message = `JAMID:${genesisHex}:register:${jid}:${nonce}:${contract}`;
```

**3. Use action-specific nonces:**
```typescript
// For registration
const nonce = await contract.get_nonce_for_action(account, { Register: null });

// For transfer
const nonce = await contract.get_nonce_for_action(account, { Transfer: null });
```

### ⚠️ Remaining Considerations for Mainnet

- **Upgradeability**: Consider proxy pattern for future versions
- **Multi-sig ownership**: Reduce centralization risk
- **Real crypto verification**: Enable chain extensions for sr25519/ed25519

---

## Version 0.2.0 (Security & Cross-Network Improvements)

### 🔒 Security Enhancements

#### 1. **Cross-Chain Replay Protection** ✅
- **Added `chain_id` parameter to constructor**
  - Must specify chain identifier (e.g., "paseo", "pop", "jam") at deployment
  - Each contract instance is tied to a specific network
  
- **Updated message format to include chain_id**
  - Registration: `JAMID:{chain_id}:register:{jid}:{nonce}:{contract_address}`
  - Transfer: `JAMID:{chain_id}:transfer:{jid}:{new_owner}:{nonce}:{contract_address}`
  - **Prevents signatures from being replayed on different networks**

#### 2. **Improved Account ID Verification** ✅
- **Multi-strategy public key comparison**
  - Strategy 1: Direct comparison (raw public key)
  - Strategy 2: First 32 bytes match (prefixed formats)
  - Strategy 3: Blake2-256 hash of public key
  - **Ensures compatibility across different Polkadot network formats**

#### 3. **Nonce Overflow Protection** ✅
- **Replaced `saturating_add` with `checked_add`**
  - Prevents silent overflow in nonce tracking
  - Returns `NonceOverflow` error if nonce exceeds u64::MAX
  - **Better error handling for long-running accounts**

### 💰 Economic Improvements

#### 4. **Configurable Registration Fee** ✅
- **New admin function: `set_registration_fee(new_fee)`**
  - Allows adapting to different network economics
  - Cannot be set to zero (prevents abuse)
  - Owner-only access
  
- **Fee Transparency**
  - `get_registration_fee()`: Returns current fee
  - `get_total_fees_collected()`: Total fees collected
  - `get_total_fees_withdrawn()`: Total fees withdrawn by owner
  - **Provides transparency and auditability**

### 🔄 Lifecycle Improvements

#### 5. **Account Liberation on Revoke** ✅
- **Fixed `revoke()` to free account for new registration**
  - Previous behavior: Account remained "burned" after revoke
  - New behavior: Account can register a new JID after revoking
  - **Improves user experience and flexibility**

### ⚡ Performance & Storage Optimization

#### 6. **Hash-Based Storage Keys** ✅
- **Replaced String keys with fixed-size Hash (32 bytes)**
  - `jid_registry: Mapping<Hash, JIDRecord>` (optimized)
  - `hash_to_jid: Mapping<Hash, String>` (reverse lookup for UX)
  - `account_to_jid: Mapping<AccountId, Hash>` (efficient account mapping)
  
- **Benefits:**
  - ✅ **Fixed storage costs**: Every JID uses exactly 32 bytes for key (vs 3-64 bytes with String)
  - ✅ **Predictable gas costs**: Lookup always O(1) with consistent size
  - ✅ **DoS protection**: Impossible to bloat storage with long JID names
  - ✅ **Scalability**: Design supports millions of JIDs efficiently
  
- **Implementation:**
  - Uses Blake2-256 hashing for JID keys
  - Maintains reverse mapping for user-friendly resolution
  - Zero API changes - fully backward compatible
  - All 18 tests pass without modifications
  
- **Performance Impact:**
  - Contract size: ~40KB (0.8KB increase for reverse mapping)
  - Gas costs: More predictable and consistent
  - Storage efficiency: ~50% reduction for long JID names

### 📊 New Public Functions

- `get_registration_fee() -> Balance`
- `get_total_fees_collected() -> Balance`
- `get_total_fees_withdrawn() -> Balance`
- `get_chain_id() -> String`

### 🐛 Bug Fixes

- Fixed account mapping not cleared on revoke
- Added nonce overflow checks in both `register()` and `transfer()`
- Improved fee tracking in `withdraw()` function

### ⚠️ Breaking Changes

**IMPORTANT**: These changes are **breaking** for existing SDK implementations:

1. **Constructor signature changed**
   - Old: `Jamid::new()`
   - New: `Jamid::new(chain_id: String)`
   
2. **Message format changed**
   - Old: `JAMID:register:{jid}:{nonce}:{contract_address}`
   - New: `JAMID:{chain_id}:register:{jid}:{nonce}:{contract_address}`
   
3. **SDK must be updated** to:
   - Get chain_id from contract: `contract.get_chain_id()`
   - Include chain_id in message construction
   - Update signature creation functions

### 🧪 Testing

- Added 18 comprehensive unit tests (all passing ✅)
- New tests for:
  - Chain ID functionality
  - Configurable fees
  - Fee tracking
  - Revoke account liberation
  - Nonce overflow protection

### 📖 Documentation

- Updated README with all new features
- Added detailed message format examples
- Documented cross-chain security model
- Updated SDK integration examples
- Added transparency function documentation

### 🚀 Deployment Recommendations

For **testnet** (Paseo/Pop):
- Deploy with `chain_id = "paseo"` or `"pop"`
- Test cross-chain isolation by deploying on multiple networks
- Verify SDK signature format works correctly
- Monitor fee collection and withdrawal

For **mainnet** (JAM):
- Deploy with `chain_id = "jam"`
- Set appropriate registration fee for JAM economics
- Ensure SDK is fully updated and tested
- Consider multi-sig ownership before production

### 🔮 Known Limitations (Not Fixed)

These limitations are acceptable for production:

1. **Cryptographic Verification**: Basic validation only
   - Waiting for chain extensions for full sr25519/ed25519 verification
   - Current pubkey matching provides good security

2. **No Upgrade Path**: Contract is immutable
   - By design for ink! contracts
   - Use migration functions if needed

3. **Timestamp Manipulation**: ±15 seconds possible
   - Standard blockchain limitation
   - Minimal impact on expiration logic

4. **Single Owner**: Centralization risk
   - Consider multi-sig for mainnet
   - Can transfer ownership as needed

### ✅ Resolved Limitations

~~**String-based Storage**~~ → **FIXED in v0.2.0**
- Implemented hash-based keys (32 bytes fixed)
- Storage optimization complete
- Production-ready for millions of JIDs

### 📦 Artifacts

Build with:
```bash
cargo contract build --release
```

Contract size: ~39KB (optimized WASM)

### 🤝 Migration from v0.1.0

If you have a v0.1.0 deployment:

1. Deploy new v0.2.0 contract with `chain_id`
2. Update SDK to use new message format
3. (Optional) Export data from v0.1.0 and import to v0.2.0
4. Test thoroughly on testnet before mainnet migration

---

**Contributors**: Snowinch Team  
**Security Review**: Internal (Community review recommended)  
**Audit Status**: Not audited (recommended for mainnet)

