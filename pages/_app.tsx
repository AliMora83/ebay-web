import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThirdwebProvider } from "@thirdweb-dev/react";
import network from '../utils/network';
import { ThemeProvider } from '@thirdweb-dev/react/dist/declarations/src/evm/components/shared/ThemeProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }: AppProps) {


  return (
    <ThirdwebProvider desiredChainId={network}>
      {/* <ThemeProvider> */}
        <Component {...pageProps} />
     {/* </ThemeProvider> */}
     <ToastContainer 
     position="top-center"
     autoClose={5000}
     hideProgressBar={false}
     newestOnTop={false}
     closeOnClick
     rtl={false}
     pauseOnFocusLoss
     draggable
     pauseOnHover={false}
     theme="light"/>
    </ThirdwebProvider>
  
)
}

export default MyApp
