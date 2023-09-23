import { WalletContextState } from '@solana/wallet-adapter-react'
import { Connection, LAMPORTS_PER_SOL, PublicKey, SYSVAR_RENT_PUBKEY, SystemProgram, Transaction } from '@solana/web3.js'
import { getAnchorProgram, getEscrowPubkey, getSwapPubkey } from './utils'
import { TOKEN_PROGRAM_ID, TokenAccountNotFoundError, TokenInvalidAccountOwnerError, createAssociatedTokenAccountInstruction, getAccount, getAssociatedTokenAddressSync } from '@solana/spl-token'
import { BN } from 'bn.js'

export const getCreateSwapTx = async ({
    connection,
    wallet,
    creator,
    taker,
    offeredMint,
    desiredMint,
    offeredAmount,
    desiredAmount
}: {
    connection: Connection,
    wallet: WalletContextState,
    creator: PublicKey,
    taker: PublicKey,
    offeredMint: PublicKey,
    desiredMint: PublicKey,
    offeredAmount: number,
    desiredAmount: number
}) => {
    const txn = new Transaction()
    const program = getAnchorProgram(connection, wallet)

    const swapPubkey = getSwapPubkey(taker)
    const swap = await program.account.swap.fetchNullable(swapPubkey)
    if (!swap) {
        txn.add(
            await program.methods.initializeSwap().accounts({
                creator,
                taker,
                swap: swapPubkey,
                systemProgram: SystemProgram.programId
            }).instruction()
        )
    }

    const escrowPubkey = getEscrowPubkey(taker)
    txn.add(
        await program.methods.initializeEscrow().accounts({
            creator,
            taker,
            escrow: escrowPubkey,
            swap: swapPubkey,
            offeredMint,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            rent: SYSVAR_RENT_PUBKEY
        }).instruction()
    )

    const creatorAtaOffered = getAssociatedTokenAddressSync(offeredMint, creator)

    const creatorAtaDesired = getAssociatedTokenAddressSync(desiredMint, creator)
    try {
        await getAccount(connection, creatorAtaDesired, 'finalized')
    } catch (error) {
        if (error instanceof TokenAccountNotFoundError || error instanceof TokenInvalidAccountOwnerError) {
            txn.add(createAssociatedTokenAccountInstruction(
                creator,
                creatorAtaDesired,
                creator,
                desiredMint
            ))
        }
    }

    txn.add(
        await program.methods.createSwap(new BN(offeredAmount * LAMPORTS_PER_SOL), new BN(desiredAmount * LAMPORTS_PER_SOL)).accounts({
            creator,
            taker,
            escrow: escrowPubkey,
            swap: swapPubkey,
            creatorAtaOffered,
            offeredMint,
            desiredMint,
            tokenProgram: TOKEN_PROGRAM_ID
        }).instruction()
    )

    return txn
}