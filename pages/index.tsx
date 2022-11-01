import Header from '../components/Header'
import {
  useActiveListings,
  useContract,
  MediaRenderer
} from "@thirdweb-dev/react";
import { ListingType } from '@thirdweb-dev/sdk';
import {ClockIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import Head from 'next/head';
import favicon from "public/nk_icon.png"
import Link from 'next/link';
import Image from 'next/image'
import Footer from '../components/Footer';
import { useRouter } from 'next/router';





const Home = () => {
  const router = useRouter();
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT, "marketplace"
  );

  const { data: listing, isLoading: loadingListings } =
  useActiveListings(contract);



  return (
    <div>
        <Head>
          <title>NAMKA Marketplace</title>
          <link rel="icon" href="/nk_icon.png" />
        </Head>
      <Header />

      <main className='max-w-6xl mx-auto py-2 px-6 pb-10'>
        {loadingListings ? (
        <p className='text-center animate-pulse text-gray-300'>
          Loading listings...</p>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mx-auto'>
            {listing?.map((listing) => (
              <div key={listing.id}
              onClick={() => router.push(`/listing/${listing.id}`)}
              className='flex flex-col card hover:scale-105 transition-all duration-150 ease-out'>
                <div className='flex-1 flex flex-col pb-2 items-center'>
                  <MediaRenderer className='h-44' src={listing.asset.image}/>
                </div>
                <div className='pt-2 space-y-4'>
                  <div>
                    <h2 className='text-md truncate font-semibold'>
                      {listing.asset.name}</h2>
                    <hr />
                    <p className='text-xs truncate text-gray-500 mt-2'>
                      {listing.asset.description}</p>
                  </div>
                  <div>
                    <p className='text-xs'>
                      <span className='font-bold mr-1'>
                        {listing.buyoutCurrencyValuePerToken.displayValue}
                      </span>
                      {listing.buyoutCurrencyValuePerToken.symbol}
                    </p>
                    <div className={`flex items-center space-x-1 justify-end text-xs border w-fit ml-auto p-2 rounded-lg text-white
                    ${listing.type === ListingType.Direct
                      ? "bg-blue-500"
                      : "bg-red-500"}`}>
                      <p>
                        {listing.type === ListingType.Direct
                        ? "Buy Now"
                      : "Auction"}
                      </p>
                      {listing.type === ListingType.Direct ? (
                        <BanknotesIcon className='h-4' />
                      ) : (
                        <ClockIcon className='h-4' />

                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
       )}
      </main>
      <Footer />
    </div>
  )
}

export default Home
