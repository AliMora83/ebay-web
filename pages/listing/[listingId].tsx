import { UserCircleIcon } from '@heroicons/react/24/solid';
import { MediaRenderer, useAcceptDirectListingOffer, useAddress, useBuyNow, useContract, useListing, useMakeBid, 
        useMakeOffer, useNetwork, useNetworkMismatch, useOffers } 
        from '@thirdweb-dev/react';
import { ListingType, NATIVE_TOKENS } from '@thirdweb-dev/sdk';
import Head from 'next/head';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header';
import Countdown from 'react-countdown';
import Footer from '../../components/Footer';
import network from '../../utils/network';
import { ethers } from 'ethers';


function ListingPage() {
    const router = useRouter();
    const address = useAddress();
    const [bidAmount, setBidAmount] = useState("");
    const networkMismatch = useNetworkMismatch();
    const [, switchNetwork] = useNetwork();
    const { listingId } = router.query as { listingId: string };
    const [minimumNextBid, setMinimumNextBid] = useState<{
        displayValue: string;
        symbol: string;
    }>();

    const { contract } = useContract(
        process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
        "marketplace"
        );

        const {data: offers} = useOffers(contract,listingId);
        const { mutate: makeOffer } = useMakeOffer(contract);
        const { mutate: makeBid } = useMakeBid(contract);
        const { mutate: buyNow } = useBuyNow(contract);
        const {data: listing, isLoading, error } = useListing(contract, listingId);
        const { mutate: acceptOffer } = useAcceptDirectListingOffer(contract);

        useEffect(() => {
            if (!listingId || !contract || !listing) return;
          
            if (listing.type === ListingType.Auction) {
                fetchMinNextBid();
            }
        }, [listingId, listing, contract]);

        const fetchMinNextBid = async () => {
            if (!listingId || !contract) return;
            const minBidResponse = await contract.auction.getMinimumNextBid(listingId);

            const {displayValue, symbol} = await contract.auction.getMinimumNextBid(listingId);

            setMinimumNextBid({
                displayValue: displayValue,
                symbol: symbol,
            })
        }

        const formatPlaceholder = () => {
            if (!listing) return;

            if (listing.type === ListingType.Direct) {
                return "Enter Offer Amount";
            }
            if (listing.type === ListingType.Auction) {
                return Number(minimumNextBid?.displayValue) === 0 
                ? "Enter Bid Amount"
                : `${minimumNextBid?.displayValue} ${minimumNextBid?.symbol} or more`;
            }
        };

        const buyNft = async () => {
            if (networkMismatch) {
                switchNetwork && switchNetwork(network);
                    return;
            }
            if (!listingId || !contract || !listing) return;

            await buyNow({
                id: listingId,
                buyAmount: 1,
                type: listing.type,
            }, {
                onSuccess(data, variables, context) {
                    alert("NFT bought successfully");
                    console.log("Success: ",data, variables, context);
                    router.replace("/");
                },
                onError(error, variables, context) {
                    alert("ERROR: NFT not bought");
                    console.log("Error: ", error, variables, context);
                },
            })
        }

        const createBidOrOffer = async () => {
                try {
                    if (networkMismatch) {
                        switchNetwork && switchNetwork(network);
                        return;
                    }
                //Direct listing
                    if (listing?.type === ListingType.Direct){
                        if (
                            listing.buyoutPrice.toString() === 
                            ethers.utils.parseEther(bidAmount).toString()
                        ) {
                            alert("Buyout price met, buying NFT...");
                            buyNft();
                            return;
                        }

                        alert("Buyout price not met, making offer...");
                        await makeOffer({
                            quantity: 1,
                            listingId,
                            pricePerToken: bidAmount,
                        }, {
                            onSuccess(data, variables, context) {
                                console.log("Success: ",data, variables, context)
                                alert("Successfully made Offer")
                                setBidAmount("")
                            },
                            onError(error, variables, context) {
                                console.log("Error: ", error, variables, context)
                                alert("Error: Offer could not be made")
                            },
                        })
                    }
                //Auction listing
                    if (listing?.type === ListingType.Auction){
                        alert("Making Bid...")

                        await makeBid(
                            {
                                listingId,
                                bid: bidAmount,
                            },{
                                onSuccess(data, variables, context) {
                                    console.log("Success: ",data, variables, context)
                                    alert("Successfully made Bid")
                                    setBidAmount("")
                                },
                                onError(error, variables, context) {
                                    console.log("Error: ", error, variables, context)
                                    alert("Error: Bid could not be made")
                                },
                                
                            }
                        )
                    }

                } catch (error) {
                    console.log(error)
                }
                
        }

        if (isLoading) return 
        <div>
        <Head>
          <title>NAMKA Marketplace</title>
          <link rel="icon" href="/nk_icon.png" />
        </Head>
      <Header/>
      <div className='text-center animate-pulse text-gray-300'>
        <p>Loading item...</p>
        </div>
        </div>;

        if (!listing) {
            return <div>Listing not found</div>
        }

  return (
    <div>
        <Head>
          <title>NAMKA Marketplace</title>
          <link rel="icon" href="/nk_icon.png" />
        </Head>
      <Header/>

            <main className='max-w-6xl mx-auto p-2 flex flex-col lg:flex-row space-y-10 space-x-5 pr-10'>
                <div className='p-10 border mx-auto lg:mx-0 max-w-md lg:max-w-xl'>
                    <MediaRenderer src={listing.asset.image}/>
                </div>

                <section className='flex-1 space-y-5 pb-20 lg:pb-0'>
                    <div>
                        <h1 className='text-xl font-bold'>{listing.asset.name}</h1>
                        <p className='text-gray-500 text-sm'>{listing.asset.description}</p>
                        <p className='flex items-center text-xs pt-2 sm:text-base text-gray-500 '>
                            <UserCircleIcon className='h-5'/>
                            <span className='font-bold pr-2'>Seller: </span>
                            {listing.sellerAddress}</p>
                    </div>

                    <div className='grid grid-cols-2 items-center py-2'>
                        <p className='font-bold'>Listing Type:</p>
                        <p>
                            {listing.type === ListingType.Direct
                            ? "Direct Listing"
                            : "Auction Listing"
                            }
                        </p>
                        <p className='font-bold'>Buy now price:</p>
                        <p className='text-xl font-bold'>
                            {listing.buyoutCurrencyValuePerToken.displayValue}{" "}
                            {listing.buyoutCurrencyValuePerToken.symbol}
                        </p>

                        <button onClick={buyNft} className='col-start-2 mt-2 bg-black font-bold text-white rounded-lg w-44 py-4 px-10'>
                            Buy Now</button>
                    </div>

                            {listing.type === ListingType.Direct && offers && (
                                <div className='grid grid-cols-2 gap-y-2'>
                                    <p className='font-bold'>Offers: </p>
                                    <p className='font-bold'>
                                        {offers.length > 0 ? offers.length : 0}
                                    </p>

                                    {offers.map((offer) => (
                                        <>
                                        <p>
                                            <UserCircleIcon className='h-3 mr-3'/>
                                            {offer.offeror.slice(0, 5) + 
                                            "..." + offer.offeror.slice(-5)}
                                        </p>
                                        <div>
                                            <p className='text-sm italic'
                                            key={
                                                offer.listingId +
                                                offer.offeror +
                                                offer.totalOfferAmount.toString()
                                            }>
                                                {ethers.utils.formatEther(offer.totalOfferAount)}{" "}
                                                {NATIVE_TOKENS[network].symbol}
                                            </p>

                                            {listing.sellerAddress === address && (
                                                <button onClick={() => 
                                                    acceptOffer({
                                                        listingId,
                                                        addressOfOfferor: offer.offeror,
                                                    }, {
                                                        onSuccess(data, variables, context) {
                                                            alert("Offer Accepted Successfully");
                                                            console.log("Success: ",data, variables, context);
                                                            router.replace("/");
                                                        },
                                                        onError(error, variables, context) {
                                                            alert("ERROR: NFT not bought");
                                                            console.log("Error: ", error, variables, context);
                                                        },
                                                    })}
                                                className="p-2 w-32 bg-black rounded-lg font-bold text-white text-sm cursor-pointer">
                                                    Accetp Offer
                                                </button>
                                            ) }
                                        </div>
                                        </>
                                    ))}
                                </div>
                            )}


                    <div className='grid grid-cols-2 space-y-2 items-center justify-end'>
                        <hr className='col-span-2'/>
                        <p className='col-span-2'>
                            {listing.type === ListingType.Direct
                            ? "Make an Offer"
                            : "Bid on this Auction"
                            }
                        </p>

                        {listing.type === ListingType.Auction && (
                            <>
                                <p>Current Min Bid: </p>
                                <p className='font-bold'>
                                    {minimumNextBid?.displayValue} {minimumNextBid?.symbol}
                                </p>
                                
                                <p>Remaining Time: </p>
                                <p>
                                    <Countdown 
                                    date={Number(listing.endTimeInEpochSeconds.toString()) * 1000}
                                    />
                                </p>

                            </>
                        )}

                        <input className='border border-black p-2 rounded-lg mr-5' type="text" 
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder={formatPlaceholder()}/>
                        <button onClick={createBidOrOffer} className='bg-black font-bold text-white rounded-lg w-44 py-4 px-10'>
                            {listing.type === ListingType.Direct 
                            ? "Offer"
                            : "Bid"
                            }
                        </button>
                    </div>
            
                </section>
            </main>
            <Footer/>

    </div>
  )
}

export default ListingPage
