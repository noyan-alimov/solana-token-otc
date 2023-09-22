import { useWallet } from '@solana/wallet-adapter-react'
import { CreateSwapForm } from './components/CreateSwapForm'
import { Swap } from './components/Swap'

function App() {
  const wallet = useWallet()

  return (
    <div className='flex flex-col gap-8'>
      <CreateSwapForm />
      <div className='h-px w-full bg-gray-500 my-6'></div>
      {wallet.publicKey && (
        <div>
          <h2 className='text-xl mb-4'>Initiated swap by someone to you</h2>
          <Swap walletAddress={wallet.publicKey.toString()} />
        </div>
      )}
    </div>
  )
}

export default App
