import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThirdwebProvider } from "@thirdweb-dev/react";
import network from '../utils/network';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@thirdweb-dev/react/dist/declarations/src/evm/components/shared/ThemeProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider desiredChainId={network}>
      {/* <ThemeProvider> */}
        <Component {...pageProps} />
        <Toaster position="top-center" reverseOrder={false}/>
     {/* </ThemeProvider> */}
    </ThirdwebProvider>
  
)
}

export default MyApp
