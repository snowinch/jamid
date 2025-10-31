# @jamid/tsconfig

Shared TypeScript configurations for JAMID packages.

## Configurations

### `base.json`
Base configuration for all TypeScript projects. Includes:
- Strict mode enabled
- ES2022 target
- ESNext modules
- Source maps and declarations

### `library.json`
For library packages (SDK, types, etc.). Extends `base.json` with:
- Composite projects support
- Declaration files generation
- Proper include/exclude patterns

### `nextjs.json`
For Next.js applications. Extends `base.json` with:
- Next.js specific settings
- DOM type definitions
- JSX preserve mode
- Path aliases support

## Usage

In your package's `tsconfig.json`:

```json
{
  "extends": "@jamid/tsconfig/base.json",
  "compilerOptions": {
    // Your overrides here
  }
}
```

Or for libraries:

```json
{
  "extends": "@jamid/tsconfig/library.json"
}
```

Or for Next.js apps:

```json
{
  "extends": "@jamid/tsconfig/nextjs.json"
}
```

