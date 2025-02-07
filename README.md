# @confluxscan/espace

A TypeScript library for interacting with Conflux eSpace Scanner API.

## Installation

```bash
npm install @confluxscan/espace
# or
yarn add @confluxscan/espace
```

## Features

- Full TypeScript support
- Complete Conflux eSpace Scanner API coverage
- Comprehensive data formatting utilities
- Built-in rate limiting and error handling
- Detailed documentation and examples

## Usage

```typescript
import { ESpaceScanner, ESpaceScannerWrapper } from "@confluxscan/espace";

// Basic usage
const scanner = new ESpaceScanner("mainnet", "YOUR_API_KEY");
const wrapper = new ESpaceScannerWrapper("mainnet", "YOUR_API_KEY");

// Get contract ABI
const contractABI = await scanner.getContractABI("0x1234...");

// Get formatted contract ABI with human-readable output
const { formatted, raw } = await wrapper.getContractABI("0x1234...");
console.log(formatted); // Pretty printed output
console.log(raw); // Raw data

// Get token statistics
const stats = await scanner.getTokenHolderStats("0x1234...");

// Get formatted token statistics
const { formatted, raw } = await wrapper.getTokenHolderStats("0x1234...");
```

## API Documentation

### ESpaceScanner

The base scanner class that provides direct access to the Conflux eSpace Scanner API.

#### Constructor

```typescript
constructor(target: "mainnet" | "testnet" = "mainnet", apiKey?: string, host?: string)
```

### ESpaceScannerWrapper

A wrapper class that provides formatted output for all scanner methods.

#### Constructor

```typescript
constructor(target: "mainnet" | "testnet" = "mainnet", apiKey?: string, host?: string)
```

For detailed API documentation, please visit our [documentation site](https://your-username.github.io/confluxscan-espace).

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Generate documentation
npm run docs

# Lint code
npm run lint

# Format code
npm run format
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 