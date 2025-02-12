import { AccountWrapper } from "../../modules/account";
import { ESpaceScanner } from "../../../core";
import { ResponseFormatter } from "../../../formatters";
import { jest } from "@jest/globals";
import {
  TransactionList,
  InternalTransactionList,
  TokenTransferList,
  NFTTransferList,
  MinedBlockList,
  AccountBalanceMultiItem,
} from "../../../types";

jest.mock("../../../core/scanner");

describe("AccountWrapper", () => {
  let wrapper: AccountWrapper;
  let mockScanner: jest.Mocked<ESpaceScanner>;
  const validAddress = "0x1234567890123456789012345678901234567890";

  beforeEach(() => {
    jest.clearAllMocks();

    // Create mock scanner instance
    mockScanner = {
      account: {
        getBalance: jest.fn(),
        getBalanceMulti: jest.fn(),
        getTransactionList: jest.fn(),
        getInternalTransactionList: jest.fn(),
        getTokenTransfers: jest.fn(),
        getNFTTransfers: jest.fn(),
        getMinedBlocks: jest.fn(),
      },
    } as unknown as jest.Mocked<ESpaceScanner>;

    // Mock the ESpaceScanner constructor
    (ESpaceScanner as jest.MockedClass<typeof ESpaceScanner>).mockImplementation(() => mockScanner);

    wrapper = new AccountWrapper({});

    // Mock formatter methods
    jest.spyOn(ResponseFormatter, "formatCFX").mockReturnValue("1.0 CFX");
    jest.spyOn(ResponseFormatter, "formatGas").mockReturnValue("1.0 Gwei");
    jest.spyOn(ResponseFormatter, "formatTimestamp").mockReturnValue("2024-02-07 12:00:00");
    jest.spyOn(ResponseFormatter, "formatNumber").mockReturnValue("1,000");
    jest.spyOn(ResponseFormatter, "formatUnit").mockReturnValue("1.0");
  });

  describe("getBalance", () => {
    beforeEach(() => {
      mockScanner.account.getBalance.mockResolvedValue("1000000000000000000");
    });

    it("should return formatted balance", async () => {
      const result = await wrapper.getBalance(validAddress);
      expect(result).toBe("1.0 CFX");
      expect(mockScanner.account.getBalance).toHaveBeenCalledWith(validAddress, "latest_state");
      expect(ResponseFormatter.formatCFX).toHaveBeenCalledWith("1000000000000000000");
    });

    it("should return raw balance when returnRaw is true", async () => {
      const result = await wrapper.getBalance(validAddress, "latest_state", true);
      expect(result).toBe("1000000000000000000");
      expect(mockScanner.account.getBalance).toHaveBeenCalledWith(validAddress, "latest_state");
      expect(ResponseFormatter.formatCFX).not.toHaveBeenCalled();
    });
  });

  describe("getBalanceMulti", () => {
    const addresses = [validAddress, "0x9876543210987654321098765432109876543210"];
    const mockBalances: AccountBalanceMultiItem = [
      [validAddress, "1000000000000000000"],
      [addresses[1], "2000000000000000000"],
    ];

    beforeEach(() => {
      mockScanner.account.getBalanceMulti.mockResolvedValue(mockBalances);
    });

    it("should return formatted balances", async () => {
      const result = await wrapper.getBalanceMulti(addresses);
      expect(result).toEqual(mockBalances.map(([address, _balance]) => [address, "1.0 CFX"]));
      expect(mockScanner.account.getBalanceMulti).toHaveBeenCalledWith(addresses, "latest_state");
      expect(ResponseFormatter.formatCFX).toHaveBeenCalledTimes(2);
    });

    it("should return raw balances when returnRaw is true", async () => {
      const result = await wrapper.getBalanceMulti(addresses, "latest_state", true);
      expect(result).toEqual(mockBalances);
      expect(mockScanner.account.getBalanceMulti).toHaveBeenCalledWith(addresses, "latest_state");
      expect(ResponseFormatter.formatCFX).not.toHaveBeenCalled();
    });
  });

  describe("getTransactionList", () => {
    const mockTransactions: TransactionList = [
      {
        blockNumber: "1",
        timeStamp: "1707307200",
        hash: "0x123",
        nonce: "1",
        blockHash: "0xabc",
        transactionIndex: "0",
        from: validAddress,
        to: validAddress,
        value: "1000000000000000000",
        gas: "21000",
        gasPrice: "1000000000",
        isError: "0",
        txreceipt_status: "1",
        input: "0x",
        contractAddress: "",
        cumulativeGasUsed: "21000",
        gasUsed: "21000",
        confirmations: "100",
        methodId: "0x",
        functionName: "",
      },
    ];

    beforeEach(() => {
      mockScanner.account.getTransactionList.mockResolvedValue(mockTransactions);
    });

    it("should return formatted transactions", async () => {
      const result = await wrapper.getTransactionList(validAddress);
      expect(result).toEqual(
        mockTransactions.map((tx) => ({
          ...tx,
          timeStamp: "2024-02-07 12:00:00",
          value: "1.0 CFX",
          gas: "1.0 Gwei",
          gasPrice: "1.0 Gwei",
          cumulativeGasUsed: "1.0 Gwei",
          gasUsed: "1.0 Gwei",
        }))
      );
      expect(mockScanner.account.getTransactionList).toHaveBeenCalledWith(
        validAddress,
        undefined,
        undefined,
        1,
        100,
        "desc"
      );
    });

    it("should return raw transactions when returnRaw is true", async () => {
      const result = await wrapper.getTransactionList(validAddress, {}, true);
      expect(result).toEqual(mockTransactions);
      expect(mockScanner.account.getTransactionList).toHaveBeenCalledWith(
        validAddress,
        undefined,
        undefined,
        1,
        100,
        "desc"
      );
    });
  });

  describe("getInternalTransactionList", () => {
    const mockTransactions: InternalTransactionList = [
      {
        blockNumber: "1",
        timeStamp: "1707307200",
        hash: "0x123",
        from: validAddress,
        to: validAddress,
        value: "1000000000000000000",
        gas: "21000",
        gasUsed: "21000",
        input: "0x",
        type: "call",
        isError: "0",
        contractAddress: "",
        errCode: "",
      },
    ];

    beforeEach(() => {
      mockScanner.account.getInternalTransactionList.mockResolvedValue(mockTransactions);
    });

    it("should return formatted internal transactions", async () => {
      const result = await wrapper.getInternalTransactionList();
      expect(result).toEqual(
        mockTransactions.map((tx) => ({
          ...tx,
          timeStamp: "2024-02-07 12:00:00",
          value: "1.0 CFX",
          gas: "1.0 Gwei",
          gasUsed: "1.0 Gwei",
        }))
      );
      expect(mockScanner.account.getInternalTransactionList).toHaveBeenCalledWith({});
    });

    it("should return raw internal transactions when returnRaw is true", async () => {
      const result = await wrapper.getInternalTransactionList({}, true);
      expect(result).toEqual(mockTransactions);
      expect(mockScanner.account.getInternalTransactionList).toHaveBeenCalledWith({});
    });
  });

  describe("getTokenTransfers", () => {
    const mockTransfers: TokenTransferList = [
      {
        blockNumber: "1",
        timeStamp: "1707307200",
        hash: "0x123",
        nonce: "1",
        blockHash: "0xabc",
        from: validAddress,
        contractAddress: validAddress,
        to: validAddress,
        value: "1000000000000000000",
        tokenName: "Test Token",
        tokenSymbol: "TEST",
        tokenDecimal: "18",
        transactionIndex: "0",
        gas: "21000",
        gasPrice: "1000000000",
        gasUsed: "21000",
        cumulativeGasUsed: "21000",
        input: "0x",
        confirmations: "100",
      },
    ];

    beforeEach(() => {
      mockScanner.account.getTokenTransfers.mockResolvedValue(mockTransfers);
    });

    it("should return formatted token transfers", async () => {
      const result = await wrapper.getTokenTransfers();
      expect(result).toEqual(
        mockTransfers.map((tx) => ({
          ...tx,
          timeStamp: "2024-02-07 12:00:00",
          value: "1.0",
          gas: "1.0 Gwei",
          gasPrice: "1.0 Gwei",
          gasUsed: "1.0 Gwei",
          cumulativeGasUsed: "1.0 Gwei",
        }))
      );
      expect(mockScanner.account.getTokenTransfers).toHaveBeenCalledWith({});
    });

    it("should return raw token transfers when returnRaw is true", async () => {
      const result = await wrapper.getTokenTransfers({}, true);
      expect(result).toEqual(mockTransfers);
      expect(mockScanner.account.getTokenTransfers).toHaveBeenCalledWith({});
    });
  });

  describe("getNFTTransfers", () => {
    const mockTransfers: NFTTransferList = [
      {
        blockNumber: "1",
        timeStamp: "1707307200",
        hash: "0x123",
        nonce: "1",
        blockHash: "0xabc",
        from: validAddress,
        contractAddress: validAddress,
        to: validAddress,
        tokenID: "1",
        tokenName: "Test NFT",
        tokenSymbol: "TNFT",
        tokenDecimal: "0",
        transactionIndex: "0",
        gas: "21000",
        gasPrice: "1000000000",
        gasUsed: "21000",
        cumulativeGasUsed: "21000",
        input: "0x",
        confirmations: "100",
      },
    ];

    beforeEach(() => {
      mockScanner.account.getNFTTransfers.mockResolvedValue(mockTransfers);
    });

    it("should return formatted NFT transfers", async () => {
      const result = await wrapper.getNFTTransfers();
      expect(result).toEqual(
        mockTransfers.map((tx) => ({
          ...tx,
          timeStamp: "2024-02-07 12:00:00",
          gas: "1.0 Gwei",
          gasPrice: "1.0 Gwei",
          gasUsed: "1.0 Gwei",
          cumulativeGasUsed: "1.0 Gwei",
        }))
      );
      expect(mockScanner.account.getNFTTransfers).toHaveBeenCalledWith({});
    });

    it("should return raw NFT transfers when returnRaw is true", async () => {
      const result = await wrapper.getNFTTransfers({}, true);
      expect(result).toEqual(mockTransfers);
      expect(mockScanner.account.getNFTTransfers).toHaveBeenCalledWith({});
    });
  });

  describe("getMinedBlocks", () => {
    const mockBlocks: MinedBlockList = [
      {
        blockNumber: "1",
        timeStamp: "1707307200",
        blockReward: "1000000000000000000",
        blockMiner: validAddress,
        blockHash: "0xabc",
        difficulty: "1000000",
        totalDifficulty: "1000000",
        size: "1000",
        gasUsed: "21000",
        gasLimit: "30000",
        extraData: "0x",
        uncles: [],
      },
    ];

    beforeEach(() => {
      mockScanner.account.getMinedBlocks.mockResolvedValue(mockBlocks);
    });

    it("should return formatted mined blocks", async () => {
      const result = await wrapper.getMinedBlocks(validAddress, { page: 1, offset: 100 });
      expect(result).toEqual(
        mockBlocks.map((block) => ({
          ...block,
          timeStamp: "2024-02-07 12:00:00",
          blockReward: "1.0 CFX",
          gasUsed: "1.0 Gwei",
          gasLimit: "1.0 Gwei",
        }))
      );
      expect(mockScanner.account.getMinedBlocks).toHaveBeenCalledWith(
        validAddress,
        "blocks",
        1,
        100
      );
    });

    it("should return raw mined blocks when returnRaw is true", async () => {
      const result = await wrapper.getMinedBlocks(validAddress, { page: 1, offset: 100 }, true);
      expect(result).toEqual(mockBlocks);
      expect(mockScanner.account.getMinedBlocks).toHaveBeenCalledWith(
        validAddress,
        "blocks",
        1,
        100
      );
    });
  });
});
