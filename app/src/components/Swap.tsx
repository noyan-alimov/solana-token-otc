import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useQuery } from '@tanstack/react-query'
import { FC } from 'react'
import { getAnchorProgram, getSwapPubkey } from '../transactions/utils'
import { PublicKey } from '@solana/web3.js'
import { getCloseSwapTxn } from '../transactions/closeSwap'
import { getCancelSwapTxn } from '../transactions/cancelSwap'
import toast from 'react-hot-toast'

export const Swap: FC<{ walletAddress: string }> = ({ walletAddress }) => {
    const wallet = useWallet()
    const { connection } = useConnection()

    const query = useQuery(['swap', walletAddress], async () => {
        const program = getAnchorProgram(connection, wallet)
        const swapPda = getSwapPubkey(new PublicKey(walletAddress))
        const swapData = await program.account.swap.fetchNullable(swapPda)
        if (!swapData) return null
        return {
            creator: swapData.creator.toString(),
            taker: swapData.taker.toString(),
            offeredMint: swapData.offeredMint.toString(),
            desiredMint: swapData.desiredMint.toString(),
            offeredAmount: swapData.offeredAmount.toNumber(),
            desiredAmount: swapData.desiredAmount.toNumber(),
            state: swapData.state
        }
    })

    const closeSwap = () => {
        toast.promise((async () => {
            const txn = await getCloseSwapTxn({
                connection,
                wallet,
                creator: new PublicKey(query.data.creator),
                taker: new PublicKey(query.data.taker),
                offeredMint: new PublicKey(query.data.offeredMint),
                desiredMint: new PublicKey(query.data.desiredMint),
            })
            await wallet.sendTransaction(txn, connection)
        })(), {
            loading: 'Accepting swap...',
            success: 'Swap accepted!',
            error: 'Error accepting swap'
        })
    }

    const cancelSwap = () => {
        toast.promise((async () => {
            const txn = await getCancelSwapTxn({
                connection,
                wallet,
                creator: new PublicKey(query.data.creator),
                taker: new PublicKey(query.data.taker),
                offeredMint: new PublicKey(query.data.offeredMint)
            })
            await wallet.sendTransaction(txn, connection)
        })(), {
            loading: 'Canceling swap...',
            success: 'Swap canceled!',
            error: 'Error canceling swap'
        })
    }

    if (query.isLoading) return <div>Loading...</div>

    if (query.isError) {
        console.error(query.error)
        return <div>Error: {'Error querying swap data'}</div>
    }

    if (!query.data) return <div>No one initiated a swap with you</div>

    return (
        <div>
            <div className='mb-4'>{JSON.stringify(query.data, null, 2)}</div>
            <div>
                {walletAddress === query.data.creator.toString() ? (
                    <button className='btn btn-secondary' onClick={cancelSwap}>Cancel Swap</button>
                ) : (
                    <button className='btn btn-secondary' onClick={closeSwap}>Accept Swap</button>
                )}
            </div>
        </div>
    )
}