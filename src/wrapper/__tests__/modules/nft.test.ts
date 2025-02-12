import { NFTWrapper } from "../../modules/nft";
import { ESpaceScanner } from "../../../core";
import { ResponseFormatter } from "../../../formatters";
import { jest } from "@jest/globals";
import {
  NFTBalanceResponse,
  NFTTokenResponse,
  NFTPreviewResponse,
  NFTFungibleTokenResponse,
  NFTOwnerResponse,
} from "../../../types";

jest.mock("../../../core/scanner");
jest.mock("../../../formatters/responses", () => ({
  ResponseFormatter: {
    formatNumber: jest.fn().mockReturnValue("1"),
  },
}));

describe("NFTWrapper", () => {
  let wrapper: NFTWrapper;
  let mockScanner: jest.Mocked<ESpaceScanner>;
  const validAddress = "0x1234567890123456789012345678901234567890";

  beforeEach(() => {
    jest.clearAllMocks();

    // Create mock scanner instance
    mockScanner = {
      nft: {
        getNFTBalances: jest.fn(),
        getNFTTokens: jest.fn(),
        getNFTPreview: jest.fn(),
        getNFTFungibleTokens: jest.fn(),
        getNFTOwners: jest.fn(),
      },
    } as unknown as jest.Mocked<ESpaceScanner>;

    // Mock the ESpaceScanner constructor
    (ESpaceScanner as jest.MockedClass<typeof ESpaceScanner>).mockImplementation(() => mockScanner);

    wrapper = new NFTWrapper({});
  });

  describe("getNFTBalances", () => {
    const mockResponse: NFTBalanceResponse = {
      total: 1,
      list: [
        {
          contract: validAddress,
          tokenId: "1",
          amount: "1",
          tokenUri: "https://example.com/token/1",
          metadata: {
            name: "Test NFT",
            description: "Test Description",
            image: "https://example.com/image/1",
          },
        },
      ],
    };

    beforeEach(() => {
      mockScanner.nft.getNFTBalances.mockResolvedValue(mockResponse);
    });

    it("should return formatted NFT balances", async () => {
      const result = await wrapper.getNFTBalances(validAddress);
      expect(result).toEqual({
        ...mockResponse,
        list: mockResponse.list.map((item) => ({
          ...item,
          amount: "1",
        })),
      });
      expect(mockScanner.nft.getNFTBalances).toHaveBeenCalledWith(validAddress, 0, 10);
      expect(ResponseFormatter.formatNumber).toHaveBeenCalledWith("1");
    });

    it("should return raw response when returnRaw is true", async () => {
      const result = await wrapper.getNFTBalances(validAddress, 0, 10, true);
      expect(result).toEqual(mockResponse);
      expect(mockScanner.nft.getNFTBalances).toHaveBeenCalledWith(validAddress, 0, 10);
      expect(ResponseFormatter.formatNumber).not.toHaveBeenCalled();
    });
  });

  describe("getNFTTokens", () => {
    const mockResponse: NFTTokenResponse = {
      total: 1,
      list: [
        {
          contract: validAddress,
          tokenId: "1",
          owner: validAddress,
          tokenUri: "https://example.com/token/1",
          metadata: {
            name: "Test NFT",
            description: "Test Description",
            image: "https://example.com/image/1",
          },
        },
      ],
    };

    beforeEach(() => {
      mockScanner.nft.getNFTTokens.mockResolvedValue(mockResponse);
    });

    it("should return NFT tokens", async () => {
      const result = await wrapper.getNFTTokens(validAddress);
      expect(result).toEqual(mockResponse);
      expect(mockScanner.nft.getNFTTokens).toHaveBeenCalledWith(validAddress, 0, 10);
    });

    it("should return raw response when returnRaw is true", async () => {
      const result = await wrapper.getNFTTokens(validAddress, 0, 10, true);
      expect(result).toEqual(mockResponse);
      expect(mockScanner.nft.getNFTTokens).toHaveBeenCalledWith(validAddress, 0, 10);
    });
  });

  describe("getNFTPreview", () => {
    const mockResponse: NFTPreviewResponse = {
      total: 1,
      list: [
        {
          contract: validAddress,
          tokenId: "1",
          tokenUri: "https://example.com/token/1",
          metadata: {
            name: "Test NFT",
            description: "Test Description",
            image: "https://example.com/image/1",
          },
        },
      ],
    };

    beforeEach(() => {
      mockScanner.nft.getNFTPreview.mockResolvedValue(mockResponse);
    });

    it("should return NFT preview", async () => {
      const tokenId = "1";
      const result = await wrapper.getNFTPreview(validAddress, tokenId);
      expect(result).toEqual(mockResponse);
      expect(mockScanner.nft.getNFTPreview).toHaveBeenCalledWith(validAddress, tokenId);
    });

    it("should return raw response when returnRaw is true", async () => {
      const tokenId = "1";
      const result = await wrapper.getNFTPreview(validAddress, tokenId, true);
      expect(result).toEqual(mockResponse);
      expect(mockScanner.nft.getNFTPreview).toHaveBeenCalledWith(validAddress, tokenId);
    });
  });

  describe("getNFTFungibleTokens", () => {
    const mockResponse: NFTFungibleTokenResponse = {
      total: 1,
      list: [
        {
          contract: validAddress,
          name: "Test Token",
          symbol: "TEST",
          decimals: 18,
          totalSupply: "1000000000000000000",
        },
      ],
    };

    beforeEach(() => {
      mockScanner.nft.getNFTFungibleTokens.mockResolvedValue(mockResponse);
    });

    it("should return NFT fungible tokens", async () => {
      const result = await wrapper.getNFTFungibleTokens(validAddress);
      expect(result).toEqual(mockResponse);
      expect(mockScanner.nft.getNFTFungibleTokens).toHaveBeenCalledWith(validAddress, 0, 10);
    });

    it("should return raw response when returnRaw is true", async () => {
      const result = await wrapper.getNFTFungibleTokens(validAddress, 0, 10, true);
      expect(result).toEqual(mockResponse);
      expect(mockScanner.nft.getNFTFungibleTokens).toHaveBeenCalledWith(validAddress, 0, 10);
    });
  });

  describe("getNFTOwners", () => {
    const mockResponse: NFTOwnerResponse = {
      total: 1,
      list: [
        {
          address: validAddress,
          quantity: "1",
        },
      ],
    };

    beforeEach(() => {
      mockScanner.nft.getNFTOwners.mockResolvedValue(mockResponse);
    });

    it("should return formatted NFT owners", async () => {
      const tokenId = "1";
      const result = await wrapper.getNFTOwners(validAddress, tokenId);
      expect(result).toEqual({
        ...mockResponse,
        list: mockResponse.list.map((item) => ({
          ...item,
          quantity: "1",
        })),
      });
      expect(mockScanner.nft.getNFTOwners).toHaveBeenCalledWith(validAddress, tokenId, 0, 10);
      expect(ResponseFormatter.formatNumber).toHaveBeenCalledWith("1");
    });

    it("should return raw response when returnRaw is true", async () => {
      const tokenId = "1";
      const result = await wrapper.getNFTOwners(validAddress, tokenId, 0, 10, true);
      expect(result).toEqual(mockResponse);
      expect(mockScanner.nft.getNFTOwners).toHaveBeenCalledWith(validAddress, tokenId, 0, 10);
      expect(ResponseFormatter.formatNumber).not.toHaveBeenCalled();
    });
  });
});
