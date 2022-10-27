import React from 'react'

type Props = {}

function Header({}: Props) {
  return (
    <div>
        <nav>
            <div>
                <h1 className="text-3xl font-bold underline">Hello</h1>
                <button className='text-3xl font-bold underline'> 
                    Connect Wallet</button>
            </div>
        </nav>
    </div>
  )
}

export default Header