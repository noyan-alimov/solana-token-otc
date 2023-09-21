import { WalletContextState } from '@solana/wallet-adapter-react'
import { Connection, PublicKey, Transaction } from '@solana/web3.js'
import { getAnchorProgram, getEscrowPubkey, getSwapPubkey } from './utils'
import { TOKEN_PROGRAM_ID, TokenAccountNotFoundError, TokenInvalidAccountOwnerError, createAssociatedTokenAccountInstruction, getAccount, getAssociatedTokenAddressSync } from '@solana/spl-token'

export const getCloseSwapTxn = async ({
    connection,
    wallet,
    creator,
    taker,
    offeredMint,
    desiredMint
}: {
    connection: Connection,
    wallet: WalletContextState,
    creator: PublicKey,
    taker: PublicKey,
    offeredMint: PublicKey,
    desiredMint: PublicKey
}) => {
    const txn = new Transaction()
    const program = getAnchorProgram(connection, wallet)

    const swapPubkey = getSwapPubkey(taker)
    const escrowPubkey = getEscrowPubkey(taker)

    const creatorAtaOffered = getAssociatedTokenAddressSync(offeredMint, creator)
    const creatorAtaDesired = getAssociatedTokenAddressSync(desiredMint, creator)
    
    const takerAtaOffered = getAssociatedTokenAddressSync(offeredMint, taker)
    try {
        await getAccount(connection, takerAtaOffered, 'finalized')
    } catch (error) {
        if (error instanceof TokenAccountNotFoundError || error instanceof TokenInvalidAccountOwnerError) {
            txn.add(createAssociatedTokenAccountInstruction(
                taker,
                takerAtaOffered,
                taker,
                offeredMint
            ))
        }
    }
    const takerAtaDesired = getAssociatedTokenAddressSync(desiredMint, taker)

    txn.add(
        await program.methods.closeSwap().accounts({
            creator,
            taker,
            escrow: escrowPubkey,
            swap: swapPubkey,
            creatorAtaOffered,
            creatorAtaDesired,
            takerAtaOffered,
            takerAtaDesired,
            offeredMint,
            desiredMint,
            tokenProgram: TOKEN_PROGRAM_ID
        }).instruction()
    )

    return txn
}