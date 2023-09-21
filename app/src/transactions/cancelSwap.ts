import { WalletContextState } from '@solana/wallet-adapter-react'
import { Connection, PublicKey, Transaction } from '@solana/web3.js'
import { getAnchorProgram, getEscrowPubkey, getSwapPubkey } from './utils'
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync } from '@solana/spl-token'

export const getCancelSwapTxn = async ({
    connection,
    wallet,
    creator,
    taker,
    offeredMint
}: {
    connection: Connection,
    wallet: WalletContextState,
    creator: PublicKey,
    taker: PublicKey,
    offeredMint: PublicKey
}) => {
    const txn = new Transaction()
    const program = getAnchorProgram(connection, wallet)

    const swapPubkey = getSwapPubkey(taker)
    const escrowPubkey = getEscrowPubkey(taker)

    const creatorAtaOffered = getAssociatedTokenAddressSync(offeredMint, creator)

    txn.add(
        await program.methods.closeSwap().accounts({
            creator,
            taker,
            escrow: escrowPubkey,
            swap: swapPubkey,
            creatorAtaOffered,
            offeredMint,
            tokenProgram: TOKEN_PROGRAM_ID
        }).instruction()
    )

    return txn
}