import Head from 'next/head'
import React from 'react'
import Header from '../components/Header'
import { useAddress, useContract, useOwnedNFTs } from '@thirdweb-dev/react'


type Props = {}

function Create({}: Props) {
    const address = useAddress();
    const { contract } = useContract(
        process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
        "marketplace"
        );

    const { contract: collectionContract } = useContract(
        process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
        "nft-collection"
        );

        const ownedNfts = useOwnedNFTs(collectionContract, address);


  return (
    <div>
        <Head>
          <title>NAMKA Marketplace</title>
          <link rel="icon" href="/nk_icon.png" />
        </Head>
        <Header/>

        <main className='max-w-6xl mx-auto p-10 pt-2'>
            <h1 className='text-4xl font-bold'>List an item</h1>
            <h2 className='text-xl font-semibold pt-5'>Select an item to sell</h2>
            <hr className='mb-5' />
            <p className='text-sm text-gray-500'>Below you will find the NFT's you own in your wallet</p>
        </main>
    </div>
  )
}

export default Create