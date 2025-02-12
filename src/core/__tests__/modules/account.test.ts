import { AccountModule } from "../../modules/account";
import { jest } from "@jest/globals";
import {
  TransactionItem,
  InternalTransactionItem,
  TokenTransferItem,
  NFTTransferItem,
  MinedBlockItem,
} from "../../../types";

describe("AccountModule", () => {
  let module: AccountModule;
  const mockFetch = jest.fn() as jest.MockedFunction<typeof global.fetch>;
  const validAddress = "0x1234567890123456789012345678901234567890";
  const invalidAddress = "0xinvalid";

  beforeEach(() => {
    jest.clearAllMocks();
    module = new AccountModule({});
    global.fetch = mockFetch;
  });

  describe("getBalance", () => {
    const mockBalance = "1000000000000000000";

    beforeEach(() => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockBalance }),
        } as Response)
      );
    });

    it("should fetch balance for valid address", async () => {
      const result = await module.getBalance(validAddress);
      expect(result).toBe(mockBalance);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api?module=account&action=balance&address=${validAddress}`),
        expect.any(Object)
      );
    });

    it("should handle custom tag parameter", async () => {
      const tag = "earliest";
      await module.getBalance(validAddress, tag);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          `/api?module=account&action=balance&address=${validAddress}&tag=${tag}`
        ),
        expect.any(Object)
      );
    });

    it("should throw error for invalid address", async () => {
      await expect(module.getBalance(invalidAddress)).rejects.toThrow("Invalid address");
    });
  });

  describe("getBalanceMulti", () => {
    const mockBalances = [[validAddress, "1000000000000000000"]];

    beforeEach(() => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: mockBalances }),
        } as Response)
      );
    });

    it("should fetch balances for multiple valid addresses", async () => {
      const result = await module.getBalanceMulti([validAddress]);
      expect(result).toEqual(mockBalances);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api?module=account&action=balancemulti&address=${validAddress}`),
        expect.any(Object)
      );
    });

    it("should handle custom tag parameter", async () => {
      const tag = "earliest";
      await module.getBalanceMulti([validAddress], tag);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          `/api?module=account&action=balancemulti&address=${validAddress}&tag=${tag}`
        ),
        expect.any(Object)
      );
    });

    it("should throw error for invalid addresses", async () => {
      await expect(module.getBalanceMulti([invalidAddress])).rejects.toThrow("Invalid addresses");
    });
  });

  describe("getTransactionList", () => {
    const mockTransaction: TransactionItem = {
      blockNumber: "1",
      timeStamp: "1000000000",
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
    };

    beforeEach(() => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: [mockTransaction] }),
        } as Response)
      );
    });

    it("should fetch transaction list for valid address", async () => {
      const result = await module.getTransactionList(validAddress);
      expect(result).toEqual([mockTransaction]);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api?module=account&action=txlist&address=${validAddress}`),
        expect.any(Object)
      );
    });

    it("should handle pagination and block range parameters", async () => {
      const startBlock = 1000;
      const endBlock = 2000;
      const page = 2;
      const offset = 50;
      const sort = "asc" as const;

      await module.getTransactionList(validAddress, startBlock, endBlock, page, offset, sort);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          `/api?module=account&action=txlist&address=${validAddress}&startblock=${startBlock}&endblock=${endBlock}&page=${page}&offset=${offset}&sort=${sort}`
        ),
        expect.any(Object)
      );
    });

    it("should throw error for invalid address", async () => {
      await expect(module.getTransactionList(invalidAddress)).rejects.toThrow("Invalid address");
    });
  });

  describe("getInternalTransactionList", () => {
    const mockInternalTx: InternalTransactionItem = {
      blockNumber: "1",
      timeStamp: "1000000000",
      hash: "0x123",
      from: validAddress,
      to: validAddress,
      value: "1000000000000000000",
      contractAddress: "",
      input: "0x",
      type: "call",
      gas: "21000",
      gasUsed: "21000",
      isError: "0",
      errCode: "",
    };

    beforeEach(() => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: [mockInternalTx] }),
        } as Response)
      );
    });

    it("should fetch internal transactions by address", async () => {
      const result = await module.getInternalTransactionList({ address: validAddress });
      expect(result).toEqual([mockInternalTx]);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          `/api?module=account&action=txlistinternal&address=${validAddress}`
        ),
        expect.any(Object)
      );
    });

    it("should fetch internal transactions by transaction hash", async () => {
      const txhash = "0x123456789";
      const result = await module.getInternalTransactionList({ txhash });
      expect(result).toEqual([mockInternalTx]);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api?module=account&action=txlistinternal&txhash=${txhash}`),
        expect.any(Object)
      );
    });

    it("should handle pagination and block range parameters", async () => {
      const options = {
        address: validAddress,
        startBlock: 1000,
        endBlock: 2000,
        page: 2,
        offset: 50,
        sort: "asc" as const,
      };

      await module.getInternalTransactionList(options);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          `/api?module=account&action=txlistinternal&address=${options.address}&startblock=${options.startBlock}&endblock=${options.endBlock}&page=${options.page}&offset=${options.offset}&sort=${options.sort}`
        ),
        expect.any(Object)
      );
    });

    it("should throw error when both address and txhash are provided", async () => {
      await expect(
        module.getInternalTransactionList({ address: validAddress, txhash: "0x123" })
      ).rejects.toThrow("Cannot specify both address and txhash");
    });

    it("should throw error for invalid address", async () => {
      await expect(module.getInternalTransactionList({ address: invalidAddress })).rejects.toThrow(
        "Invalid address"
      );
    });
  });

  describe("getTokenTransfers", () => {
    const mockTransfer: TokenTransferItem = {
      blockNumber: "1",
      timeStamp: "1000000000",
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
    };

    beforeEach(() => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: [mockTransfer] }),
        } as Response)
      );
    });

    it("should fetch token transfers by address", async () => {
      const result = await module.getTokenTransfers({ address: validAddress });
      expect(result).toEqual([mockTransfer]);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api?module=account&action=tokentx&address=${validAddress}`),
        expect.any(Object)
      );
    });

    it("should fetch token transfers by contract address", async () => {
      const result = await module.getTokenTransfers({ contractAddress: validAddress });
      expect(result).toEqual([mockTransfer]);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          `/api?module=account&action=tokentx&contractaddress=${validAddress}`
        ),
        expect.any(Object)
      );
    });

    it("should handle pagination and block range parameters", async () => {
      const options = {
        address: validAddress,
        contractAddress: validAddress,
        startBlock: 1000,
        endBlock: 2000,
        page: 2,
        offset: 50,
        sort: "asc" as const,
      };

      await module.getTokenTransfers(options);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          `/api?module=account&action=tokentx&address=${options.address}&contractaddress=${options.contractAddress}&startblock=${options.startBlock}&endblock=${options.endBlock}&page=${options.page}&offset=${options.offset}&sort=${options.sort}`
        ),
        expect.any(Object)
      );
    });

    it("should throw error for invalid address", async () => {
      await expect(module.getTokenTransfers({ address: invalidAddress })).rejects.toThrow(
        "Invalid address"
      );
    });

    it("should throw error for invalid contract address", async () => {
      await expect(module.getTokenTransfers({ contractAddress: invalidAddress })).rejects.toThrow(
        "Invalid contract address"
      );
    });
  });

  describe("getNFTTransfers", () => {
    const mockNFTTransfer: NFTTransferItem = {
      blockNumber: "1",
      timeStamp: "1000000000",
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
    };

    beforeEach(() => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: [mockNFTTransfer] }),
        } as Response)
      );
    });

    it("should fetch NFT transfers by address", async () => {
      const result = await module.getNFTTransfers({ address: validAddress });
      expect(result).toEqual([mockNFTTransfer]);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api?module=account&action=tokennfttx&address=${validAddress}`),
        expect.any(Object)
      );
    });

    it("should fetch NFT transfers by contract address", async () => {
      const result = await module.getNFTTransfers({ contractAddress: validAddress });
      expect(result).toEqual([mockNFTTransfer]);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          `/api?module=account&action=tokennfttx&contractaddress=${validAddress}`
        ),
        expect.any(Object)
      );
    });

    it("should handle pagination and block range parameters", async () => {
      const options = {
        address: validAddress,
        contractAddress: validAddress,
        startBlock: 1000,
        endBlock: 2000,
        page: 2,
        offset: 50,
        sort: "asc" as const,
      };

      await module.getNFTTransfers(options);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          `/api?module=account&action=tokennfttx&address=${options.address}&contractaddress=${options.contractAddress}&startblock=${options.startBlock}&endblock=${options.endBlock}&page=${options.page}&offset=${options.offset}&sort=${options.sort}`
        ),
        expect.any(Object)
      );
    });

    it("should throw error for invalid address", async () => {
      await expect(module.getNFTTransfers({ address: invalidAddress })).rejects.toThrow(
        "Invalid address"
      );
    });

    it("should throw error for invalid contract address", async () => {
      await expect(module.getNFTTransfers({ contractAddress: invalidAddress })).rejects.toThrow(
        "Invalid contract address"
      );
    });
  });

  describe("getMinedBlocks", () => {
    const mockMinedBlock: MinedBlockItem = {
      blockNumber: "1",
      timeStamp: "1000000000",
      blockReward: "2000000000000000000",
      blockMiner: validAddress,
      blockHash: "0xabc",
      difficulty: "1000",
      totalDifficulty: "10000",
      size: "1000",
      gasUsed: "21000",
      gasLimit: "30000",
      extraData: "0x",
      uncles: [],
    };

    beforeEach(() => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: [mockMinedBlock] }),
        } as Response)
      );
    });

    it("should fetch mined blocks with default parameters", async () => {
      const result = await module.getMinedBlocks(validAddress);
      expect(result).toEqual([mockMinedBlock]);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          `/api?module=account&action=getminedblocks&address=${validAddress}&blocktype=blocks`
        ),
        expect.any(Object)
      );
    });

    it("should handle custom parameters", async () => {
      const blockType = "uncles";
      const page = 2;
      const offset = 50;

      await module.getMinedBlocks(validAddress, blockType, page, offset);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          `/api?module=account&action=getminedblocks&address=${validAddress}&blocktype=${blockType}&page=${page}&offset=${offset}`
        ),
        expect.any(Object)
      );
    });

    it("should throw error for invalid address", async () => {
      await expect(module.getMinedBlocks(invalidAddress)).rejects.toThrow("Invalid address");
    });
  });
});
