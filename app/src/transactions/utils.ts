import { Connection, PublicKey } from '@solana/web3.js'
import { TokenOtc } from '../token_otc'
import { AnchorProvider, Program } from '@project-serum/anchor'
import { WalletContextState } from '@solana/wallet-adapter-react'
import idl from '../token_otc.json'

export const programId = new PublicKey(idl.metadata.address)
let program: Program<TokenOtc>

export const getAnchorProgram = (connection: Connection, wallet: WalletContextState) => {
    if (program) return program
    const provider = new AnchorProvider(connection, wallet, { preflightCommitment: 'processed' })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    program = new Program(idl as any, programId, provider)
    return program
}

export const getSwapPubkey = (taker: PublicKey) => {
    const [auctionPubkey] = PublicKey.findProgramAddressSync(
        [Buffer.from('auction'), taker.toBuffer()], programId
    )
    return auctionPubkey
}

export const getEscrowPubkey = (taker: PublicKey) => {
    const [escrowPubkey] = PublicKey.findProgramAddressSync(
        [Buffer.from('escrow'), taker.toBuffer()], programId
    )
    return escrowPubkey
}