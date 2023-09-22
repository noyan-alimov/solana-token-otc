import { z } from 'zod'

const walletZod = z.string().min(32, 'Invalid solana address').max(44, 'Invalid solana address')

export const formSchema = z.object({
    taker: walletZod,
    offeredMint: walletZod,
    desiredMint: walletZod,
    offeredAmount: z.coerce.number().positive(),
    desiredAmount: z.coerce.number().positive(),
})

export type FormSchemaType = z.infer<typeof formSchema>

export const mySwapFormSchema = z.object({
    taker: walletZod
})

export type MySwapFormSchemaType = z.infer<typeof mySwapFormSchema>