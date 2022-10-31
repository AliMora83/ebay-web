import Head from 'next/head'
import React, { FormEvent, useState } from 'react'
import Header from '../components/Header'
import { MediaRenderer, useAddress, useContract, useCreateAuctionListing, useCreateDirectListing, useNetwork, useNetworkMismatch, useOwnedNFTs } from '@thirdweb-dev/react'
import { NATIVE_TOKEN_ADDRESS, NFT } from '@thirdweb-dev/sdk'
import network from '../utils/network'
import { useRouter } from 'next/router'
import Footer from '../components/Footer'


type Props = {}

function Create({}: Props) {
    const address = useAddress();
    const router = useRouter();
    const { contract } = useContract(
        process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
        "marketplace"
        );

    const { contract: collectionContract } = useContract(
        process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
        "nft-collection"
        );

        const ownedNfts = useOwnedNFTs(collectionContract, address);

        const [selectedNft, setSelectedNft] = useState<NFT>();

        const networkMismatch = useNetworkMismatch();
        const [, switchNetwork] = useNetwork();

        const { mutate: createDirectListing, isLoading, error} = useCreateDirectListing(contract);
        const { mutate: createAuctionListing, isLoading: isLoadingDirect, error: errorDirect} = useCreateAuctionListing(contract);

        const handleCreateListing = async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            console.log("Test")

            if (networkMismatch) {
                switchNetwork && switchNetwork(network);
                return;
            }
            if (!selectedNft) return;
                const target = e.target as typeof e.target & {
                elements: {listingType:{ value: string }; price: { value: string }};
         
            };
            const { listingType, price } = target.elements;

            if (listingType.value === "directListing") {
                createDirectListing({
                    assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
                    tokenId: selectedNft.metadata.id,
                    currencyContractAddress: NATIVE_TOKEN_ADDRESS,
                    listingDurationInSeconds: 60 * 60 * 24 * 7, // 1 week
                    quantity: 1,
                    buyoutPricePerToken: price.value,
                    startTimestamp: new Date()
                }, {
                    onSuccess(data, variables, context) {
                        console.log("Success: ",data, variables, context)
                        router.push("/");
                    },
                    onError(error, variables, context) {
                        console.log("Error: ", error, variables, context)
                    },
                })
            }

            if (listingType.value === "auctionListing") {
                createAuctionListing({
                    assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
                    buyoutPricePerToken: price.value,
                    tokenId: selectedNft.metadata.id,
                    startTimestamp: new Date(),
                    currencyContractAddress: NATIVE_TOKEN_ADDRESS,
                    listingDurationInSeconds: 60 * 60 * 24 * 7, // 1 week
                    quantity: 1,
                    reservePricePerToken: 0,
                }, {
                    onSuccess(data, variables, context) {
                        console.log("Success: ", data, variables, context)
                        router.push("/");
                    },
                    onError(error, variables, context) {
                        console.log("Error: ", error, variables, context)
                    },
            });
        }
        };

  return (
    <div>
        <Head>
          <title>NAMKA Marketplace</title>
          <link rel="icon" href="/nk_icon.png" />
        </Head>
        <Header/>

        <main className='max-w-6xl mx-auto p-10 pt-2 mb-10 text-center'>
            <h1 className='text-4xl font-bold'>List an item</h1>
            <h2 className='text-xl font-semibold pt-2'>Select an item to Sell/Auction</h2>
            <hr className='my-5' />
            <p className='text-sm text-gray-500'>Below you will find NFT's connected to your wallet</p>
            <p className='text-sm text-gray-500 pb-3'>Select one for more options</p>
        

            <div className='flex overflow-x-scroll space-x-2 p-4'>
                {ownedNfts?.data?.map((nft) => (
                    <div key={nft.metadata.image}
                    onClick={() => setSelectedNft(nft)}
                    className={`flex flex-col space-y-2 card min-w-fit
                    border-2 bg-gray-100 ${nft.metadata.id === selectedNft?.metadata.id
                    ? "border-black"
                    : "border-transparent"}`}>
                    <MediaRenderer className='h-44 rounded-lg'
                    src={nft.metadata.image}/>
                    <p className='text-lg truncate font-bold'>{nft.metadata.name}</p>
                    <p className='text-sm text-gray-600 truncate w-48'>{nft.metadata.description}</p> 
                </div>
                ))}
             
            </div>
               
            {selectedNft && (
                <form onSubmit={handleCreateListing}>
                    <div className='flex flex-col p-10'>
                    <div className='grid grid-cols-2 gap-5'>
                        <label className='border-r font-light'>Direct / Fixed Price</label>
                        <input type="radio" name='listingType' value="directlisting" className='ml-auto h-10 w-10'/>
                        
                        <label className='border-r font-light'>Auction</label>
                        <input type="radio" name='listingType' value="auctionlisting" className='ml-auto h-10 w-10'/>
                    
                        <label className='border-r font-light'>Price</label>
                        <input type="text" name='price' placeholder='0.05' className='bg-gray-100 p-5' />
                    </div>
                    <button type='submit'
                    className='bg-black text-white font-semibold w-56 md:mt-5 mx-auto md:ml-auto rounded-lg p-4 mt-8'>
                        Create Listing
                    </button>
                    </div>
                </form>
                )}
               
        </main>
        <Footer/>
    </div>
  )
};

export default Create