import Image from "next/image";
import Link from "next/link";

import ModalAuth from "../Modal/ModalAuth";
import Dropdown from "./dropdown/dropdown";

import { UserContext } from "../../context/UserContext";
import { CartContext } from "../../context/CartContext";
import { useContext, useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import { Error, Success } from '../../helper/toast';
import { API } from "../../pages/api/api";


export default function Navbar({showLogin, setShowLogin, counter}) {
  const [state, dispatch] = useContext(UserContext)
  console.log(state);
  // const [carts, setCarts] = useContext(CartContext)
  const isLogin = state.isLogin
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter()
  const [profile, setProfile] = useState({})
  // const [count, setCount] = useState();

  // useEffect(() => {
  //   if (isLogin) {
  //     try {
  //       const getCount = async (e) => {
  //         const response = await API.get("/cart-status");
  //         setCount(response.data.data);
  //       };
  //       getCount();
  //     } catch (error) {}
  //   }
  // }, []);

  // const counters = count?.order?.reduce((a, b) => {
  //   return a + b.qty;
  // }, 0);

  useEffect(() => {
    const getProfile = async (e) => {
      try {
        const response = await API.get("/check-auth");
        setProfile(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getProfile();
  }, []);

  const logout = () => {
    dispatch({
      type:"LOGOUT"
    })
    router.push("/")
    Success({ message: `Logout Success!` })
  }

  return (
    <nav className="bg-primary sticky top-0">
      <div className="container">
        <div className="flex justify-between items-center p-1">
            <div>
              <Link href={state.user?.role === "partner" ? "/income-transaction" : "/"}>
                <Image src='/logo.svg' alt="logo" width={124} height={40} className='cursor-pointer'/>
              </Link>
            </div>
            {isLogin ? (
              <div className="flex items-center">
              <div>
                <div className={
                  state.user.role === "partner"
                  ? "hidden" 
                  : counter === undefined
                  ? "hidden"
                  : counter === 0
                  ? "hidden"
                  : counter === null
                  ? "hidden"
                  : "circle"
                }>
                  {counter}
                </div>
                <Link href="/cart">
                  <img src='/cart.svg' alt="cart" width={35} height={32.26} 
                  className={state.user?.role === "partner" ? "hidden" : "cursor-pointer"}/>
                </Link>
              </div>
              <div className="ml-3">
                <img src={profile?.image == ""
                    ? "/noProfile.png"
                    : "http://localhost:5000/uploads/" + profile?.image} alt="profile" onClick={() => setShowDropdown(true)} className="cursor-pointer h-[60px] w-[60px] object-cover object-center rounded-full"/>
                <Dropdown isVisible={showDropdown} onClose={() => setShowDropdown(false)}>
                  <div className={state.user?.role === "partner" ? "hidden" : ""}>
                    <Link href='/profile'>
                      <div className="flex items-center mb-1 mr-[76px] ml-4 cursor-pointer">
                        <Image src="/dropProfile.svg" alt='profile' width={33.37} height={39.95}/>
                        <p className="ml-2">Profile</p>
                      </div>
                    </Link>
                  </div>
                  <div className={state.user?.role === "customer" ? "hidden" : ""}>
                    <Link href='/profile-partner'>
                      <div className="flex items-center mb-1 mr-[25px] ml-[15px] cursor-pointer">
                        <Image src='/dropProfile.svg' alt='profile' width={33.37} height={39.95}/>
                        <p className="ml-2">Profile Partner</p>
                      </div>
                    </Link>
                  </div>
                  <div className={state.user?.role === "customer" ? "hidden" : ""}>
                    <Link href='/add-product'>
                      <div className="flex items-center mb-1 mr-[25px] ml-[15px] cursor-pointer">
                        <Image src='/addProductDrop.svg' alt='profile' width={33.37} height={39.95}/>
                        <p className="ml-2">Add Product</p>
                      </div>
                    </Link>
                  </div>
                  <div className={state.user?.role === "customer" ? "hidden" : ""}>
                    <Link href='/list-products'>
                      <div className="flex items-center mb-1 mr-[25px] ml-[15px] cursor-pointer">
                        <Image src='/addProductDrop.svg' alt='profile' width={33.37} height={39.95}/>
                        <p className="ml-2">List Products</p>
                      </div>
                    </Link>
                  </div>
                  <hr />
                  <div className="flex items-center mt-1  mr-10 ml-4 cursor-pointer" onClick={logout}>
                    <Image src='/logoutDropdown.svg' alt='profile' width={33.37} height={39.95}/>
                    <p className="ml-2">Logout</p>
                  </div>
                </Dropdown>
              </div>
            </div>
            ) : (
              <div>
              <ModalAuth showLogin={showLogin} setShowLogin={setShowLogin}/>
            </div>
            )}
        </div>
      </div>
    </nav>
  )
}
