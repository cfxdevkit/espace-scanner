// Types for /account/transactions
export interface AccountTransactionsParams {
  /** Account address, it's like 0x672158893ce87d812befd2209bc1b7818fe48b2a */
  account: string;

  /** The number of skipped records, usually it's pageSize * (pageNumber - 1). Maximum 10000.
   * @default 0 */
  skip?: number;

  /** The number of records displayed on the page. Maximum 100.
   * @default 10 */
  limit?: number;

  /** Account address, it's like 0x672158893ce87d812befd2209bc1b7818fe48b2a */
  from?: string;

  /** Account address, it's like 0x672158893ce87d812befd2209bc1b7818fe48b2a */
  to?: string;

  /** */
  startBlock?: number;

  /** */
  endBlock?: number;

  /** Timestamp in seconds. */
  minTimestamp?: number;

  /** Timestamp in seconds. */
  maxTimestamp?: number;

  /** Sort in ASC or DESC order by timestamp
   * @default DESC */
  sort?: string;
}

export type AccountTransactions = {
  total?: number;

  list?: Array<{
    blockNumber?: number;

    /** One block may have multiple transactions. It's the position of this transaction in all transactions. */
    transactionIndex?: number;

    nonce?: number;

    /** transaction hash */
    hash?: string;

    from?: string;

    to?: string;

    /** Amount of cfx, in drip. */
    value?: string;

    gasPrice?: string;

    gasFee?: string;

    /** Timestamp in seconds.  */
    timestamp?: number | string;

    status?: number;

    contractCreated?: string;

    /** method id or method name. */
    method?: string;
  }>;

  addressInfo?: {
    [key: string]: {
      contract?: {
        /** Name of the contract. */
        name?: string;

        verify?: {
          /** Verify result of the contract, 1-verified, 0-not verified. */
          result?: number;
        };
      };

      token?: {
        /** Name of the token. */
        name?: string;

        /** Symbol of the token. */
        symbol?: string;

        /** Decimal of the token, omit if empty. */
        decimals?: number;

        /** Website  of the token, optional */
        website?: string;

        /** Icon url, optional */
        iconUrl?: string;

        /** Token type, ERC20、ERC721 or ERC1155 */
        tokenType?: string;
      };
    };
  };
};

// Types for /account/cfx/transfers
export interface CfxTransfersParams {
  /** Account address, it's like 0x672158893ce87d812befd2209bc1b7818fe48b2a */
  account: string;

  /** The number of skipped records, usually it's pageSize * (pageNumber - 1). Maximum 10000.
   * @default 0 */
  skip?: number;

  /** The number of records displayed on the page. Maximum 100.
   * @default 10 */
  limit?: number;

  /** Account address, it's like 0x672158893ce87d812befd2209bc1b7818fe48b2a */
  from?: string;

  /** Account address, it's like 0x672158893ce87d812befd2209bc1b7818fe48b2a */
  to?: string;

  /** */
  startBlock?: number;

  /** */
  endBlock?: number;

  /** Timestamp in seconds. */
  minTimestamp?: number;

  /** Timestamp in seconds. */
  maxTimestamp?: number;

  /** Sort in ASC or DESC order by timestamp
   * @default DESC */
  sort?: string;
}

export type CfxTransfers = {
  total?: number;

  list?: Array<{
    blockNumber?: number;

    transactionHash?: string;

    from?: string;

    to?: string;

    amount?: string;

    timestamp?: number | string;
  }>;

  addressInfo?: {
    [key: string]: {
      contract?: {
        /** Name of the contract. */
        name?: string;

        verify?: {
          /** Verify result of the contract, 1-verified, 0-not verified. */
          result?: number;
        };
      };

      token?: {
        /** Name of the token. */
        name?: string;

        /** Symbol of the token. */
        symbol?: string;

        /** Decimal of the token, omit if empty. */
        decimals?: number;

        /** Website  of the token, optional */
        website?: string;

        /** Icon url, optional */
        iconUrl?: string;

        /** Token type, ERC20、ERC721 or ERC1155 */
        tokenType?: string;
      };
    };
  };
};

// Types for /account/erc20/transfers
export interface Erc20TransfersParams {
  /** Account address, it's like 0x672158893ce87d812befd2209bc1b7818fe48b2a */
  account: string;

  /** The number of skipped records, usually it's pageSize * (pageNumber - 1). Maximum 10000.
   * @default 0 */
  skip?: number;

  /** The number of records displayed on the page. Maximum 100.
   * @default 10 */
  limit?: number;

  /** Contract address, it's like 0x672158893ce87d812befd2209bc1b7818fe48b2a */
  contract?: string;

  /** Account address, it's like 0x672158893ce87d812befd2209bc1b7818fe48b2a */
  from?: string;

  /** Account address, it's like 0x672158893ce87d812befd2209bc1b7818fe48b2a */
  to?: string;

  /** */
  startBlock?: number;

  /** */
  endBlock?: number;

  /** Timestamp in seconds. */
  minTimestamp?: number;

  /** Timestamp in seconds. */
  maxTimestamp?: number;

  /** Sort in ASC or DESC order by timestamp
   * @default DESC */
  sort?: string;
}

export type Erc20Transfers = {
  total?: number;

  list?: Array<{
    blockNumber?: number;

    transactionHash?: string;

    from?: string;

    to?: string;

    amount?: string;

    timestamp?: number | string;

    contract?: string;
  }>;

  addressInfo?: {
    [key: string]: {
      contract?: {
        /** Name of the contract. */
        name?: string;

        verify?: {
          /** Verify result of the contract, 1-verified, 0-not verified. */
          result?: number;
        };
      };

      token?: {
        /** Name of the token. */
        name?: string;

        /** Symbol of the token. */
        symbol?: string;

        /** Decimal of the token, omit if empty. */
        decimals?: number;

        /** Website  of the token, optional */
        website?: string;

        /** Icon url, optional */
        iconUrl?: string;

        /** Token type, ERC20、ERC721 or ERC1155 */
        tokenType?: string;
      };
    };
  };
};

// Types for /account/erc721/transfers
export interface Erc721TransfersParams {
  /** Account address, it's like 0x672158893ce87d812befd2209bc1b7818fe48b2a */
  account: string;

  /** The number of skipped records, usually it's pageSize * (pageNumber - 1). Maximum 10000.
   * @default 0 */
  skip?: number;

  /** The number of records displayed on the page. Maximum 100.
   * @default 10 */
  limit?: number;

  /** Contract address, it's like 0x672158893ce87d812befd2209bc1b7818fe48b2a */
  contract?: string;

  /** Account address, it's like 0x672158893ce87d812befd2209bc1b7818fe48b2a */
  from?: string;

  /** Account address, it's like 0x672158893ce87d812befd2209bc1b7818fe48b2a */
  to?: string;

  /** */
  startBlock?: number;

  /** */
  endBlock?: number;

  /** Timestamp in seconds. */
  minTimestamp?: number;

  /** Timestamp in seconds. */
  maxTimestamp?: number;

  /** Token id. It's uint256 in solidity. Using string here. */
  tokenId?: string;

  /** Sort in ASC or DESC order by timestamp
   * @default DESC */
  sort?: string;
}

export type Erc721Transfers = {
  total?: number;

  list?: Array<{
    blockNumber?: number;

    transactionHash?: string;

    from?: string;

    to?: string;

    tokenId?: string;

    timestamp?: number | string;
  }>;

  addressInfo?: {
    [key: string]: {
      contract?: {
        /** Name of the contract. */
        name?: string;

        verify?: {
          /** Verify result of the contract, 1-verified, 0-not verified. */
          result?: number;
        };
      };

      token?: {
        /** Name of the token. */
        name?: string;

        /** Symbol of the token. */
        symbol?: string;

        /** Decimal of the token, omit if empty. */
        decimals?: number;

        /** Website  of the token, optional */
        website?: string;

        /** Icon url, optional */
        iconUrl?: string;

        /** Token type, ERC20、ERC721 or ERC1155 */
        tokenType?: string;
      };
    };
  };
};

// Types for /account/erc1155/transfers
export interface Erc1155TransfersParams {
  /** Account address, it's like 0x672158893ce87d812befd2209bc1b7818fe48b2a */
  account: string;

  /** The number of skipped records, usually it's pageSize * (pageNumber - 1). Maximum 10000.
   * @default 0 */
  skip?: number;

  /** The number of records displayed on the page. Maximum 100.
   * @default 10 */
  limit?: number;

  /** Contract address, it's like 0x672158893ce87d812befd2209bc1b7818fe48b2a */
  contract?: string;

  /** Account address, it's like 0x672158893ce87d812befd2209bc1b7818fe48b2a */
  from?: string;

  /** Account address, it's like 0x672158893ce87d812befd2209bc1b7818fe48b2a */
  to?: string;

  /** */
  startBlock?: number;

  /** */
  endBlock?: number;

  /** Timestamp in seconds. */
  minTimestamp?: number;

  /** Timestamp in seconds. */
  maxTimestamp?: number;

  /** Token id. It's uint256 in solidity. Using string here. */
  tokenId?: string;

  /** Sort in ASC or DESC order by timestamp
   * @default DESC */
  sort?: string;
}

export type Erc1155Transfers = {
  total?: number;

  list?: Array<{
    blockNumber?: number;

    transactionHash?: string;

    from?: string;

    to?: string;

    amount?: string;

    tokenId?: string;

    timestamp?: number | string;
  }>;

  addressInfo?: {
    [key: string]: {
      contract?: {
        /** Name of the contract. */
        name?: string;

        verify?: {
          /** Verify result of the contract, 1-verified, 0-not verified. */
          result?: number;
        };
      };

      token?: {
        /** Name of the token. */
        name?: string;

        /** Symbol of the token. */
        symbol?: string;

        /** Decimal of the token, omit if empty. */
        decimals?: number;

        /** Website  of the token, optional */
        website?: string;

        /** Icon url, optional */
        iconUrl?: string;

        /** Token type, ERC20、ERC721 or ERC1155 */
        tokenType?: string;
      };
    };
  };
};

// Types for /account/erc3525/transfers
export interface Erc3525TransfersParams {
  /** Account address, it's like 0x672158893ce87d812befd2209bc1b7818fe48b2a */
  account: string;

  /** The number of skipped records, usually it's pageSize * (pageNumber - 1). Maximum 10000.
   * @default 0 */
  skip?: number;

  /** The number of records displayed on the page. Maximum 100.
   * @default 10 */
  limit?: number;

  /** Contract address, it's like 0x672158893ce87d812befd2209bc1b7818fe48b2a */
  contract?: string;

  /** Account address, it's like 0x672158893ce87d812befd2209bc1b7818fe48b2a */
  from?: string;

  /** Account address, it's like 0x672158893ce87d812befd2209bc1b7818fe48b2a */
  to?: string;

  /** */
  startBlock?: number;

  /** */
  endBlock?: number;

  /** Timestamp in seconds. */
  minTimestamp?: number;

  /** Timestamp in seconds. */
  maxTimestamp?: number;

  /** Token id. It's uint256 in solidity. Using string here. */
  tokenId?: string;

  /** Sort in ASC or DESC order by timestamp
   * @default DESC */
  sort?: string;
}

export type Erc3525Transfers = {
  total?: number;

  list?: Array<{
    blockNumber?: number;

    transactionHash?: string;

    from?: string;

    to?: string;

    /** field for TransferValue event */
    fromTokenId?: string;

    /** field for TransferValue event */
    toTokenId?: string;

    /** event name, TransferValue or Transfer */
    event?: string;

    amount?: string;

    tokenId?: string;

    slot?: string;

    timestamp?: number | string;
  }>;

  addressInfo?: {
    [key: string]: {
      contract?: {
        /** Name of the contract. */
        name?: string;

        verify?: {
          /** Verify result of the contract, 1-verified, 0-not verified. */
          result?: number;
        };
      };

      token?: {
        /** Name of the token. */
        name?: string;

        /** Symbol of the token. */
        symbol?: string;

        /** Decimal of the token, omit if empty. */
        decimals?: number;

        /** Website  of the token, optional */
        website?: string;

        /** Icon url, optional */
        iconUrl?: string;

        /** Token type, ERC20、ERC721 or ERC1155 */
        tokenType?: string;
      };
    };
  };
};

// Types for /account/transfers
export interface AccountTransfersParams {
  /** Account address, it's like 0x672158893ce87d812befd2209bc1b7818fe48b2a */
  account: string;

  /** A cursor to retrieve the next page
   * @default 0 */
  cursor?: string;

  /** The number of skipped records, usually it's pageSize * (pageNumber - 1). Maximum 10000.
   * @default 0 */
  skip?: number;

  /** The number of records displayed on the page. Maximum 100.
   * @default 10 */
  limit?: number;

  /** Contract address, it's like 0x672158893ce87d812befd2209bc1b7818fe48b2a */
  contract?: string;

  /** Account address, it's like 0x672158893ce87d812befd2209bc1b7818fe48b2a */
  from?: string;

  /** Account address, it's like 0x672158893ce87d812befd2209bc1b7818fe48b2a */
  to?: string;

  /** */
  startBlock?: number;

  /** */
  endBlock?: number;

  /** Timestamp in seconds. */
  minTimestamp?: number;

  /** Timestamp in seconds. */
  maxTimestamp?: number;

  /** Token id. It's uint256 in solidity. Using string here. */
  tokenId?: string;

  /** Sort in ASC or DESC order by timestamp
   * @default DESC */
  sort?: string;

  /** Query the transfer record of the address based on the specified transferType which includes
1. Transaction

	1.1 'transaction'
2. CFX Transfer

	2.1 'call'

	2.2 'create'
3. Token Transfer

	3.1 'transfer_20'

	3.2 'transfer_721'

	3.3 'transfer_1155' */
  transferType?: string;
}

export type AccountTransfers = {
  total?: number;

  next?: string;

  list?: Array<{
    epochNumber?: number;

    transactionHash?: string;

    from?: string;

    to?: string;

    amount?: string;

    tokenId?: string;

    timestamp?: number | string;

    cursor?: string;

    type?: string;

    nonce?: string;

    method?: string;

    status?: number;

    gasFee?: string;

    methodId?: string;

    contract?: string;
  }>;

  addressInfo?: {
    [key: string]: {
      contract?: {
        name?: string;

        verify?: {
          result?: number;
        };
      };

      token?: {
        name?: string;

        symbol?: string;

        decimals?: number;

        website?: string;

        iconUrl?: string;

        tokenType?: string;
      };
    };
  };
};

// Types for /account/approvals
export interface AccountApprovalsParams {
  /** Account address, it's like 0x672158893ce87d812befd2209bc1b7818fe48b2a */
  account: string;

  /**
   * @default
   * @enum ERC20, ERC721, ERC1155 */
  tokenType?: "ERC20" | "ERC721" | "ERC1155";

  /** Whether to query each NFT token id, only valid for ERC721.
   * @default false
   * @enum true, false */
  byTokenId?: true | false;
}

export type AccountApprovals = {
  total?: number;

  list?: Array<{
    /** This field has different meanings according to different situations.
For ERC20, it is the approval amount. For ERC1155 it is the `ApprovalForAll` flag.
For ERC721, it is the `ApprovalForAll` flag or the `Approval` tokenId, depending on the `type` field. */
    value?: string;

    /** Approval type, could be: `Approval` or `ApprovalForAll`. */
    approvalType?: string;

    /** Token balance for ERC20 */
    balance?: string;

    contract?: string;

    spenderName?: string;

    spender?: string;

    tokenInfo?: {
      name?: string;

      symbol?: string;

      base32?: string;

      iconUrl?: string;

      type?: string;

      decimals?: number;
    };
  }>;
};

// Types for /account/tokens
export interface AccountTokensParams {
  /** Account address, it's like 0x672158893ce87d812befd2209bc1b7818fe48b2a */
  account: string;

  /** Token type, includes ERC20、ERC721、ERC1155 or native. Multiple types separated by commas. If not set, all tokens will be returned. */
  tokenType?: string;
}

export type AccountTokens = {
  list?: Array<{
    /** Contract address of the token. Omit if it is native token. */
    contract?: string;

    /** Name of the token. */
    name?: string;

    /** Symbol of the token. */
    symbol?: string;

    /** Decimal of the token, omit if empty. */
    decimals?: number;

    /** Token type, ERC20、ERC721、ERC1155 or native */
    type?: string;

    /** Icon url, optional. */
    iconUrl?: string;

    /** The quote url of token, optional. */
    quoteUrl?: string;

    /** The price of token in USDT, optional. */
    priceInUSDT?: string;

    /** The token/native-token balance of an account, the string is not divided by the token decimal. */
    amount?: string;
  }>;
};

// Types for /token/tokeninfos
export interface TokenTokeninfosParams {
  /** Contract addresses, separated by comma,
eg. it's like 0x672158893ce87d812befd2209bc1b7818fe48b2a,0xfd2209bc1b7818fe48b2a672158893ce87d812be */
  contracts: string;
}

export type TokenTokeninfos = {
  list?: Array<{
    /** Contract address of the token. */
    contract?: string;

    /** Name of the token. */
    name?: string;

    /** Symbol of the token. */
    symbol?: string;

    /** Decimal of the token, omit if empty. */
    decimals?: number;

    /** Token type, ERC20、ERC721、ERC1155. */
    type?: string;

    /** Icon url, optional. */
    iconUrl?: string;

    /** The quote url of token, optional. */
    quoteUrl?: string;

    /** The price of token in USDT, optional. */
    priceInUSDT?: string;

    /** A string describing a particular reason that we were unable to get token info. */
    error?: string;
  }>;
};
