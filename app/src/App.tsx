import { useWallet } from '@solana/wallet-adapter-react'
import { CreateSwapForm } from './components/CreateSwapForm'
import { Swap } from './components/Swap'
import { MySwap } from './components/MySwap'

function App() {
  const wallet = useWallet()

  return (
    <div className='flex flex-col gap-8'>
      <h1 className='text-3xl font-bold'>Solana OTC token swap</h1>
      <div>
        <h2 className='text-xl mb-4'>Create swap</h2>
        <CreateSwapForm />
      </div>
      <div className='h-px w-full bg-gray-500 my-6'></div>
      <div>
        <h2 className='text-xl mb-4'>Created swap by someone to you</h2>
        {wallet.publicKey ? <Swap walletAddress={wallet.publicKey.toString()} /> : 'Connect wallet to see swap'}
      </div>
      <div className='h-px w-full bg-gray-500 my-6'></div>
      <div>
        <h2 className='text-xl mb-4'>My created swap</h2>
        {wallet.publicKey ? <MySwap /> : 'Connect wallet to see swap'}
      </div>
    </div>
  )
}

export default App
