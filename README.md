# @cfxdevkit/confluxscan-espace

A TypeScript library for interacting with Conflux eSpace Scanner API.

[![npm version](https://img.shields.io/npm/v/@cfxdevkit/confluxscan-espace)](https://www.npmjs.com/package/@cfxdevkit/confluxscan-espace)
[![Build Status](https://img.shields.io/github/actions/workflow/status/cfxdevkit/espace-scanner/ci.yml)](https://github.com/cfxdevkit/espace-scanner/actions)
[![Coverage Status](https://codecov.io/gh/cfxdevkit/espace-scanner/branch/main/graph/badge.svg)](https://codecov.io/gh/cfxdevkit/espace-scanner)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Node Version](https://img.shields.io/node/v/@cfxdevkit/confluxscan-espace)](https://www.npmjs.com/package/@cfxdevkit/confluxscan-espace)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/cfxdevkit/espace-scanner/pulls)


## Installation

```bash
npm install @cfxdevkit/confluxscan-espace
```

## Features

- Full TypeScript support with comprehensive type definitions
- Complete Conflux eSpace Scanner API coverage
- Comprehensive data formatting utilities
- Built-in error handling and address validation
- Detailed documentation and examples
- Jest-based test suite with high coverage
- ESLint and Prettier for code quality
- Husky for git hooks

## Usage

### Basic Setup

```typescript
import { ESpaceScanner, ESpaceScannerWrapper } from "@cfxdevkit/confluxscan-espace";

// Initialize scanner for different networks
const mainnetScanner = new ESpaceScannerWrapper({ target: "mainnet" });
const testnetScanner = new ESpaceScannerWrapper({ target: "testnet" });

// With API key for higher rate limits
const scannerWithApiKey = new ESpaceScannerWrapper({
    target: "mainnet",
    apiKey: "YOUR_API_KEY" // optional
});
```

### Contract Methods

```typescript
// Get contract ABI (both formatted and raw)
const contractABI = await mainnetScanner.getContractABI("0x1234...");
const rawContractABI = await mainnetScanner.getContractABI("0x1234...", true);

// Get contract source code
const contractSource = await mainnetScanner.getContractSourceCode("0x1234...");
const rawContractSource = await mainnetScanner.getContractSourceCode("0x1234...", true);
```

### Token Methods

```typescript
// Get account tokens (ERC20/ERC721)
const erc20Tokens = await mainnetScanner.getAccountTokens(walletAddress, "ERC20");
const erc721Tokens = await mainnetScanner.getAccountTokens(walletAddress, "ERC721");

// Raw data with pagination
const rawTokens = await mainnetScanner.getAccountTokens(
    walletAddress,
    "ERC20",
    0,  // skip
    10, // limit
    true // returnRaw
);
```

### Statistics Methods

```typescript
// Common statistics parameters
const statsParams = {
    minTimestamp: Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60, // 7 days ago
    maxTimestamp: Math.floor(Date.now() / 1000),
    limit: 5
};

// Active accounts statistics
const activeAccounts = await mainnetScanner.getActiveAccountStats(statsParams);

// CFX holder statistics
const cfxHolders = await mainnetScanner.getCfxHolderStats(statsParams);

// Account growth statistics
const accountGrowth = await mainnetScanner.getAccountGrowthStats(statsParams);

// TPS (Transactions Per Second) statistics
const tpsStats = await mainnetScanner.getTpsStats({ 
    ...statsParams, 
    intervalType: "hour" 
});
```

### Top Statistics Methods

```typescript
// Available periods: "24h" | "7d"
const periods = ["24h", "7d"];

// Top gas usage statistics
const topGasUsed = await mainnetScanner.getTopGasUsed("24h");

// Top transaction senders
const topTxSenders = await mainnetScanner.getTopTransactionSenders("7d");

// Top token statistics
const topTokenTransfers = await mainnetScanner.getTopTokenTransfers("24h");
const topTokenSenders = await mainnetScanner.getTopTokenSenders("24h");
const topTokenReceivers = await mainnetScanner.getTopTokenReceivers("24h");
const topTokenParticipants = await mainnetScanner.getTopTokenParticipants("24h");
```

### Token Statistics Methods

```typescript
// Token holder statistics
const tokenHolderStats = await mainnetScanner.getTokenHolderStats(tokenAddress);

// Token sender/receiver statistics
const tokenSenderStats = await mainnetScanner.getTokenUniqueSenderStats(tokenAddress);
const tokenReceiverStats = await mainnetScanner.getTokenUniqueReceiverStats(tokenAddress);
```

### Block Statistics Methods

```typescript
// Block base fee statistics
const blockBaseFeeStats = await mainnetScanner.getBlockBaseFeeStats(statsParams);

// Block gas used statistics
const blockGasUsedStats = await mainnetScanner.getBlockGasUsedStats(statsParams);

// Block average priority fee statistics
const blockAvgPriorityFeeStats = await mainnetScanner.getBlockAvgPriorityFeeStats(statsParams);

// Block transactions by type statistics
const blockTxsByTypeStats = await mainnetScanner.getBlockTxsByTypeStats(statsParams);
// Returns statistics for legacy, CIP-2930, and CIP-1559 transactions
```

### Error Handling

The library includes comprehensive error handling:

```typescript
try {
    // Invalid address
    await scanner.getContractABI("0xinvalid");
} catch (error) {
    console.error("Invalid address error:", error.message);
}

try {
    // Non-existent contract
    await scanner.getContractABI("0x0000000000000000000000000000000000000000");
} catch (error) {
    console.error("Non-existent contract error:", error.message);
}
```

For more comprehensive examples including error handling, statistics, and token operations, check out the [examples/usage.ts](examples/usage.ts) file.

## Project Structure

```
├── src/
│   ├── core/         # Core API implementation
│   ├── formatters/   # Number and date formatting utilities
│   ├── wrapper/      # High-level wrapper with formatting
│   ├── types/        # TypeScript type definitions
│   └── utils/        # Utility functions
├── examples/         # Usage examples
```

## Development

Requirements:
- Node.js >= 16.0.0
- npm or yarn

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Generate documentation
npm run docs

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Run example
npm run example

# Clean build artifacts
npm run clean
```

## Testing

The package includes a comprehensive test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Documentation

API documentation is generated using TypeDoc:

```bash
# Generate documentation
npm run docs
```

The documentation will be available in the `docs` directory.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your PR:
- Passes all tests
- Has updated documentation
- Follows the existing code style
- Includes relevant tests

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Links

- [GitHub Repository](https://github.com/cfxdevkit/espace-scanner)
- [Issue Tracker](https://github.com/cfxdevkit/espace-scanner/issues)
- [Documentation](https://cfxdevkit.github.io/espace-scanner)

## Support

For support, please:
1. Check the documentation
2. Search existing issues
3. Open a new issue if needed 