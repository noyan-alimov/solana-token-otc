export type TokenOtc = {
  "version": "0.1.0",
  "name": "token_otc",
  "instructions": [
    {
      "name": "initializeSwap",
      "accounts": [
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "taker",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "swap",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeEscrow",
      "accounts": [
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "taker",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "offeredMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "swap",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createSwap",
      "accounts": [
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "taker",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "creatorAtaOffered",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "offeredMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "desiredMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "swap",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "offeredAmount",
          "type": "u64"
        },
        {
          "name": "desiredAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "closeSwap",
      "accounts": [
        {
          "name": "creator",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "taker",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "offeredMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "desiredMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "creatorAtaOffered",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "creatorAtaDesired",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "takerAtaOffered",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "takerAtaDesired",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "swap",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "cancelSwap",
      "accounts": [
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "taker",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "offeredMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "creatorAtaOffered",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "swap",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "swap",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "publicKey"
          },
          {
            "name": "taker",
            "type": "publicKey"
          },
          {
            "name": "offeredMint",
            "type": "publicKey"
          },
          {
            "name": "desiredMint",
            "type": "publicKey"
          },
          {
            "name": "escrow",
            "type": "publicKey"
          },
          {
            "name": "offeredAmount",
            "type": "u64"
          },
          {
            "name": "desiredAmount",
            "type": "u64"
          },
          {
            "name": "state",
            "type": "u8"
          },
          {
            "name": "swapBump",
            "type": "u8"
          },
          {
            "name": "escrowBump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "SwapState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Created"
          },
          {
            "name": "Closed"
          },
          {
            "name": "Cancelled"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidSwapState",
      "msg": "Swap is in invalid state"
    }
  ]
};

export const IDL: TokenOtc = {
  "version": "0.1.0",
  "name": "token_otc",
  "instructions": [
    {
      "name": "initializeSwap",
      "accounts": [
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "taker",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "swap",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeEscrow",
      "accounts": [
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "taker",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "offeredMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "swap",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createSwap",
      "accounts": [
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "taker",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "creatorAtaOffered",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "offeredMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "desiredMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "swap",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "offeredAmount",
          "type": "u64"
        },
        {
          "name": "desiredAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "closeSwap",
      "accounts": [
        {
          "name": "creator",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "taker",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "offeredMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "desiredMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "creatorAtaOffered",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "creatorAtaDesired",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "takerAtaOffered",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "takerAtaDesired",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "swap",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "cancelSwap",
      "accounts": [
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "taker",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "offeredMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "creatorAtaOffered",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "swap",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "swap",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "publicKey"
          },
          {
            "name": "taker",
            "type": "publicKey"
          },
          {
            "name": "offeredMint",
            "type": "publicKey"
          },
          {
            "name": "desiredMint",
            "type": "publicKey"
          },
          {
            "name": "escrow",
            "type": "publicKey"
          },
          {
            "name": "offeredAmount",
            "type": "u64"
          },
          {
            "name": "desiredAmount",
            "type": "u64"
          },
          {
            "name": "state",
            "type": "u8"
          },
          {
            "name": "swapBump",
            "type": "u8"
          },
          {
            "name": "escrowBump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "SwapState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Created"
          },
          {
            "name": "Closed"
          },
          {
            "name": "Cancelled"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidSwapState",
      "msg": "Swap is in invalid state"
    }
  ]
};
