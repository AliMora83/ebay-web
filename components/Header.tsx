import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react'
import Link from 'next/link';
import React from 'react'
import { ChevronDownIcon, ShoppingCartIcon, BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import nk_logo from 'public/nklogo1.png'
import useListItem from "../utils/hooks/useListItem";



type Props = {}

function Header({}: Props) {


  const connectMetamask = useMetamask();
  const disconnect = useDisconnect();
  const address = useAddress();

  return (
    <div className='max-w-6xl mx-auto p-2'>
        <nav className='flex justify-between'>
            <div className='flex items-center space-x-2 text-sm'>
              {address ? (
              <button onClick={disconnect}
              className='connectWalletBtn'>
                Hi, {address.slice(0, 4) + '...' + address.slice(-4)}</button>
              ) : (
                <button onClick={connectMetamask}
                className='connectWalletBtn'> 
                    Connect Wallet</button>
              )}
              <p className='header_link'>Help & Contact</p>
            </div>
            <div className='flex items-center space-x-4 text-sm'>
              <p className='header_link'>Sell</p>
              <p className='header_link'>Watchlist</p>

              <Link className='flex items-center hover:link'
              href="/addItem">
              Add to Invetory
              <ChevronDownIcon className='h-4' />
              </Link>
              <BellIcon className='h-6'/>
              <ShoppingCartIcon className='h-6'/>
            </div>
        </nav>
        <hr className='mt-2'/>

        <section className='flex items-center space-x-2 py-5'>
          <div className='h-24 w-24 sm:w-28 md:w-44 cursor-pointer flex-shrink'>
            <Link href="/">
            <Image 
            alt="logo"
            src={nk_logo}
            width={100}
            height={100}
            className="h-full w-full object-contain"/>
</Link> 
          </div>
          {/* <button className='hidden lg:flex items-center space-x-2 w-20'>
           <p className='text-gray-600 text-sm'>Sort by Category</p> 
            <ChevronDownIcon className='h-4 flex-shrink-0'/>
          </button> */}

          <div className='flex items-center space-x-2 px-2 md:px-5
          py-2 border-black border-2 flex-1'>
                <MagnifyingGlassIcon className='w-5 text-gray-400'/>
                <input className='flex-1 outline-none' type="text" placeholder='Search here' />
          </div>
                <button className='hidden sm:inline bg-[#080a0b]/80 text-white px-5 md:px-10 py-2 border-2 border-[#080a0b]'>
                  Search
                </button>
         <Link href="/create">
            <button className='border-2 border-[#080a0b] px-5 md:px-10 py-2 text-[#080a0b] hover:bg-[#080a0b]/50 hover:text-white cursor-pointer'>
              List Item</button></Link>
        </section>
        <hr className='mt-2'/>

<section className='flex py-3 space-x-6 text-xs md:text-sm whitespace-nowrap justify-center px-6'>
  <p className='link'>Home</p>
  <p className='link'>Electronics</p>
  <p className='link'>Computers</p>
  <p className='link hidden sm:inline'>Video Games</p>
  <p className='link hidden sm:inline'>Health & Beauty</p>
  <p className='link hidden lg:inline'>Collectables</p>
  <p className='link hidden lg:inline'>Books</p>
  <p className='link hidden lg:inline'>Music</p>
  <p className='link hidden xl:inline'>Deals</p>
  <p className='link hidden xl:inline'>Other</p>
  <p className='link'>More</p>
</section>
    </div>
  )
}

export default Header