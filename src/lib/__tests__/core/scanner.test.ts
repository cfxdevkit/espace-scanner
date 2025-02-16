import { ESpaceScanner } from "../../../core/scanner";
import { jest } from "@jest/globals";

describe("ESpaceScanner", () => {
  let scanner: ESpaceScanner;

  beforeEach(() => {
    scanner = new ESpaceScanner({ target: "mainnet" });
  });

  it("should initialize with default config", () => {
    const defaultScanner = new ESpaceScanner();
    expect(defaultScanner).toBeInstanceOf(ESpaceScanner);
  });

  it("should initialize with custom config", () => {
    const customScanner = new ESpaceScanner({ target: "testnet" });
    expect(customScanner).toBeInstanceOf(ESpaceScanner);
  });

  it("should have all required modules", () => {
    expect(scanner.account).toBeDefined();
    expect(scanner.block).toBeDefined();
    expect(scanner.contract).toBeDefined();
    expect(scanner.nft).toBeDefined();
    expect(scanner.statistics).toBeDefined();
    expect(scanner.token).toBeDefined();
    expect(scanner.transaction).toBeDefined();
    expect(scanner.utils).toBeDefined();
    expect(scanner.deprecated).toBeDefined();
  });

  it("should initialize modules with the same config", () => {
    const testnetScanner = new ESpaceScanner({ target: "testnet" });

    // Test a method from each module to ensure they're initialized with the correct config
    const mockResponses = {
      getBalance: { status: "1", result: "1000000000000000000" },
      getBlockNumberByTime: { status: "1", result: "1234567" },
      getABI: { status: "1", result: "[]" },
      getBalances: { status: "1", result: { total: 0, list: [] } },
      getSupply: { status: "1", result: { totalIssued: "1000000000000000000" } },
      getTokenBalance: { status: "1", result: "1000000000000000000" },
      getStatus: { status: "1", result: { isError: "0" } },
      decodeMethod: { status: "1", result: { name: "transfer" } },
      AccountTransactions: { status: "1", result: { total: 0, list: [] } },
    };

    let currentMockIndex = 0;
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(Object.values(mockResponses)[currentMockIndex++]),
      } as Response)
    );

    const validAddress = "0x1234567890123456789012345678901234567890";
    const validContractAddress = "0x2234567890123456789012345678901234567890";

    // Call one method from each module to verify they're working
    return Promise.all([
      testnetScanner.account.getBalance({ address: validAddress }),
      testnetScanner.block.getBlockNumberByTime({ timestamp: 1234567890, closest: "before" }),
      testnetScanner.contract.getABI({ address: validAddress }),
      testnetScanner.nft.getBalances({ owner: validAddress }),
      testnetScanner.statistics.getSupply(),
      testnetScanner.token.getTokenBalance({
        address: validAddress,
        contractaddress: validContractAddress,
      }),
      testnetScanner.transaction.getStatus({ txhash: "0x1234" }),
      testnetScanner.utils.decodeMethod({ hashes: "0x1234" }),
      testnetScanner.deprecated.AccountTransactions({
        account: validAddress,
      }),
    ]).then(() => {
      // Verify that fetch was called 9 times (once for each module)
      expect(fetch).toHaveBeenCalledTimes(9);
      // Verify that all calls were made to the testnet URL
      const calls = (global.fetch as jest.Mock).mock.calls;
      calls.forEach((call) => {
        expect(call[0]).toContain("testnet");
      });
    });
  });
});
