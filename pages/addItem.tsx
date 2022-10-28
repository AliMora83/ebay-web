import { useAddress, useContract } from '@thirdweb-dev/react'
import React, { FormEvent, useState } from 'react'
import Header from '../components/Header'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Head from 'next/head'
import nk_logo from 'public/nklogo1.png'




type Props = {}

function addItem({}: Props) {
    const address = useAddress();
    const router = useRouter();
    const { contract } = useContract(
        process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
        "nft-collection"
    );

    const [preview, setPreview] = useState<string>();
    const [image, setImage] = useState<File>();

    const mintNft = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!contract || !address) return;
        if (!image){
            alert("Please select valid image");
            return;
        }
        const target = e.target as typeof e.target & {
            name: { value: string };
            description: { value: string };
        }

        const metadata = {
            name: target.name.value,
            description: target.description.value,
            image: image,
        }

        try {
            const tx = await contract.mintTo(address, metadata);
            const receipt = tx.receipt;
            const tokenId = tx.id;
            const nft = await tx.data();
            console.log(receipt, tokenId, nft);
            router.push("/");
        } catch (error) {
            console.error(error)

        }
    };

  return (
    <div>
        <Head>
          <title>NAMKA Marketplace</title>
          <link rel="icon" href="/nk_icon.png" />
        </Head>
        <Header/>

        <main className='max-w-6xl mx-auto p-10 border'>
            <h1 className='text-3xl font-bold'>Add new item to Marketplace</h1>
            <h2 className='text-xl font-semibold pt-2'>Item details</h2>
            <p className='pb-5'>By adding an item to the marketplace, you're essentially Minting an NFT of the item into your wallet which we can then list for sale!</p>
        
        <div className='flex flex-col justify-center items-center md:flex-row md:space-x-5 pt-5'>
            <Image 
            src={preview || nk_logo}
            alt='your item image here'
            width={100}
            height={100}
            className='border h-80 w-80 object-contain rounded-lg p-10' />
        

        <form onSubmit={mintNft} className='flex flex-col flex-1 p-2 space-y-2'>
            <label className="font-light">Item name</label>
            <input placeholder='Name of item...' className='formField' type="text" name='name' id='name' />

            <label className="font-light">Item description</label>
            <input placeholder='Enter description here...' className='formField'  type="text" name='description' id='description' />

            <label className="font-light">Image of item</label>
            <input className='pb-5' type="file" 
            onChange={(e) => {
                if (e.target.files?.[0]) {
                    setPreview(URL.createObjectURL(e.target.files[0]));
                    setImage(e.target.files[0]);
                }
            }}
            />
            <button type='submit' className='bg-[#080a0b]/80 text-white px-5 md:px-10 py-2
            font-bold rounded-xl w-56 md:mt-auto mx-auto md:ml-auto'>
                Add/Mint item</button>
        </form>
        </div>

                </main>
    </div>
  )
}

export default addItem