import { ESpaceScannerWrapper } from "../../../wrapper/scanner";
import { jest } from "@jest/globals";

describe("ESpaceScannerWrapper", () => {
  let wrapper: ESpaceScannerWrapper;

  beforeEach(() => {
    wrapper = new ESpaceScannerWrapper({ target: "mainnet" });
  });

  it("should initialize with default config", () => {
    const defaultWrapper = new ESpaceScannerWrapper();
    expect(defaultWrapper).toBeInstanceOf(ESpaceScannerWrapper);
  });

  it("should initialize with custom config", () => {
    const customWrapper = new ESpaceScannerWrapper({ target: "testnet" });
    expect(customWrapper).toBeInstanceOf(ESpaceScannerWrapper);
  });

  it("should have all required modules", () => {
    expect(wrapper.account).toBeDefined();
    expect(wrapper.block).toBeDefined();
    expect(wrapper.contract).toBeDefined();
    expect(wrapper.nft).toBeDefined();
    expect(wrapper.stats).toBeDefined();
    expect(wrapper.token).toBeDefined();
    expect(wrapper.transaction).toBeDefined();
    expect(wrapper.utils).toBeDefined();
    expect(wrapper.deprecated).toBeDefined();
  });

  it("should initialize modules with the same config", () => {
    const testnetWrapper = new ESpaceScannerWrapper({ target: "testnet" });

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
      testnetWrapper.account.getBalance({ address: validAddress }),
      testnetWrapper.block.getBlockNumberByTime({ timestamp: 1234567890, closest: "before" }),
      testnetWrapper.contract.getABI({ address: validAddress }),
      testnetWrapper.nft.getBalances({ owner: validAddress }),
      testnetWrapper.stats.getSupply(),
      testnetWrapper.token.getTokenBalance({
        address: validAddress,
        contractaddress: validContractAddress,
      }),
      testnetWrapper.transaction.getStatus({ txhash: "0x1234" }),
      testnetWrapper.utils.decodeMethod({ hashes: "0x1234" }),
      testnetWrapper.deprecated.AccountTransactions({
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
