import '../styles/globals.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import App from "next/app";
import { UserContextProvider } from "../context/UserContext";
import { CartContextProvider } from '../context/CartContext';
import { QueryClient, QueryClientProvider } from "react-query";
import CheckAuth from '../context/checkAuth';

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    const client = new QueryClient()
    return (
      <UserContextProvider>
        <CheckAuth>
          <QueryClientProvider client={client}>
              <CartContextProvider>
                  <Component {...pageProps} />
                  <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                  />
              </CartContextProvider>
          </QueryClientProvider>
        </CheckAuth>
      </UserContextProvider>
    );
  }
}

export default MyApp;