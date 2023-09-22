import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { getCreateSwapTx } from '../transactions/createSwap'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import toast, { Toaster } from 'react-hot-toast'
import { FormSchemaType, formSchema } from '../schemas'

export const CreateSwapForm = () => {
    const wallet = useWallet()
    const { connection } = useConnection()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
    })

    const onSubmit: SubmitHandler<FormSchemaType> = (data: FormSchemaType) => {
        if (!wallet.publicKey) {
            toast.error('Wallet not connected')
            return
        }

        toast.promise((async () => {
            console.log(data)
            const txn = await getCreateSwapTx({
                connection,
                wallet,
                taker: new PublicKey(data.taker),
                creator: wallet.publicKey,
                offeredMint: new PublicKey(data.offeredMint),
                desiredMint: new PublicKey(data.desiredMint),
                offeredAmount: data.offeredAmount,
                desiredAmount: data.desiredAmount
            })
            await wallet.sendTransaction(txn, connection)
            reset()
        })(), {
            loading: 'Creating swap',
            success: 'Swap created',
            error: 'Error creating swap'
        })
    }

    return (
        <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
            <Toaster />
            <div>
                <label className='block' htmlFor='taker'>Which wallet do you want to swap with?</label>
                <input
                    className='p-2 rounded w-128'
                    {...register('taker')}
                />
                {errors.taker && <ErrorFormMsg msg={errors.taker.message} />}
            </div>
            <div className='flex gap-4'>
                <div>
                    <label className='block' htmlFor='offeredMint'>Which token mint are you offering?</label>
                    <input
                        className='p-2 rounded w-128'
                        {...register('offeredMint')}
                    />
                    {errors.offeredMint && <ErrorFormMsg msg={errors.offeredMint.message} />}
                </div>
                <div>
                    <label className='block' htmlFor='offeredAmount'>Amount</label>
                    <input
                        className='p-2 rounded'
                        type='number'
                        {...register('offeredAmount')}
                    />
                    {errors.offeredAmount && <ErrorFormMsg msg={errors.offeredAmount.message} />}
                </div>
            </div>
            <div className='flex gap-4'>
                <div>
                    <label className='block' htmlFor='desiredMint'>Which token mint do you want in exchange?</label>
                    <input
                        className='p-2 rounded w-128'
                        {...register('desiredMint')}
                    />
                    {errors.desiredMint && <ErrorFormMsg msg={errors.desiredMint.message} />}
                </div>
                <div>
                    <label className='block' htmlFor='desiredAmount'>Amount</label>
                    <input
                        className='p-2 rounded'
                        type='number'
                        {...register('desiredAmount')}
                    />
                    {errors.desiredAmount && <ErrorFormMsg msg={errors.desiredAmount.message} />}
                </div>
            </div>
            <div>
                <button type='submit' className='btn btn-primary'>
                    SUBMIT
                </button>
            </div>
        </form>
    )
}

const ErrorFormMsg = ({ msg }: { msg: string }) => (
    <p className='text-red-500'>{msg}</p>
)