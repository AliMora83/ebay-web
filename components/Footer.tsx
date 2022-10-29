import React from 'react'
import nk_icon from 'public/nk_icon.png'
import Image from 'next/image'



type Props = {}

function Footer({}: Props) {
  return (
    <div>
         <footer className='flex flex-col items-center text-white justify-between pb-5
          fixed bottom-0 left-0 right-0 space-y-3 card'>
      <Image className='rounded-full h-6 w-6'
         src={nk_icon} alt="icon" />
      <p className='text-xs px-10 text-gray-500 text-center'>
        Web3 Development by Ali Mora | This is a eBay Clone build on Web3</p>
    </footer>
    </div>
  )
}

export default Footer