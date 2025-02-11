# @cfxdevkit/confluxscan-espace

A TypeScript library for interacting with Conflux eSpace Scanner API.

[![npm version](https://img.shields.io/npm/v/@cfxdevkit/confluxscan-espace)](https://www.npmjs.com/package/@cfxdevkit/confluxscan-espace)
[![Build Status](https://img.shields.io/github/actions/workflow/status/cfxdevkit/confluxscan-espace/ci.yml)](https://github.com/cfxdevkit/confluxscan-espace/actions)
[![Coverage Status](https://codecov.io/gh/cfxdevkit/confluxscan-espace/branch/main/graph/badge.svg)](https://codecov.io/gh/cfxdevkit/confluxscan-espace)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@cfxdevkit/confluxscan-espace)](https://bundlephobia.com/package/@cfxdevkit/confluxscan-espace)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Node Version](https://img.shields.io/node/v/@cfxdevkit/confluxscan-espace)](https://www.npmjs.com/package/@cfxdevkit/confluxscan-espace)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/cfxdevkit/confluxscan-espace/pulls)


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

```typescript
import { ESpaceScanner, ESpaceScannerWrapper } from "@cfxdevkit/confluxscan-espace";

const scanner = new ESpaceScanner({
    target: "mainnet", 
});

// Initialize scanner with configuration
const scannerWrapper = new ESpaceScannerWrapper({ 
    target: "mainnet", 
    apiKey: "YOUR_API_KEY" // optional
});

// Get contract ABI with formatted output
const { formatted, raw } = await scannerWrapper.getContractABI("0x1234...");
console.log(formatted); // human readable string output
console.log(raw); // raw data output

// Get token statistics with raw output
const stats = await scanner.getTokenHolderStats("0x1234...");
console.log(stats); // raw data output
// Use formatters directly
import { NumberFormatter, DateFormatter } from "@cfxdevkit/confluxscan-espace";

// Format CFX amounts
console.log(NumberFormatter.formatCFX("1000000000000000000")); // "1 CFX"

// Format timestamps
console.log(DateFormatter.formatTimestamp(1707307200)); // "2024-02-07 12:00:00"

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