import { zodResolver } from '@hookform/resolvers/zod'
import { MySwapFormSchemaType, mySwapFormSchema } from '../schemas'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ErrorFormMsg } from './ErrorFormMsg'
import { Swap } from './Swap'
import { useState } from 'react'


export const MySwap = () => {
    const [walletAddress, setWalletAddress] = useState<string>('')

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<MySwapFormSchemaType>({
        resolver: zodResolver(mySwapFormSchema),
    })

    const onSubmit: SubmitHandler<MySwapFormSchemaType> = (data: MySwapFormSchemaType) => {
        setWalletAddress(data.taker)
        reset()
    }

    return (
        <div>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label className='block' htmlFor='taker'>Input wallet you wanted to swap with to see your created swap</label>
                    <input
                        className='p-2 rounded w-128'
                        {...register('taker')}
                    />
                    {errors.taker && <ErrorFormMsg msg={errors.taker.message} />}
                </div>
                <div><button type='submit' className='btn btn-secondary'>SUBMIT</button></div>
            </form>
            <div>
                {walletAddress && <Swap walletAddress={walletAddress} />}
            </div>
        </div>
    )
}