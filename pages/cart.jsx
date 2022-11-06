import { useContext, useEffect, useState } from "react"
import Button from "../components/Button"
import Input from "../components/Input"
import Layout from "../components/layouts/Layout"
import Rp from "rupiah-format"
import { CartContext } from "../context/CartContext"
import { useRouter } from "next/router"
import MapModal from "../components/Modal/mapModal"
import { useMutation } from "react-query"
import { API } from "./api/api"


export default function Cart() {

  const [carts, setCarts] = useContext(CartContext)
  const router = useRouter()
  const [showMap1, setShowMap1] = useState(false)

  const [cart, setCart] = useState()

  useEffect(() => {
    const getCart = async (e) => {
      try{
        const response = await API.get("/cart-status")
        setCart(response.data.data)
      }catch(error){
        console.log(error);
      }
    }
    getCart()
  }, [cart])

  const handleDelete = useMutation(async (id) => {
    try {
      await API.delete(`/order/${id}`);
    } catch (error) {
      console.log(error);
    }
  });

  //Total Payment
  const total = cart?.order?.reduce((a,b) => {
    return a + b.sub_amount
  }, 0)

  const totalQty = cart?.order?.reduce((a, b) => {
    return a + b.qty
  }, 0)

  const ongkir = 10000

  const totalPay = total + ongkir

  const handleAdd = useMutation(async ({id, qty, price}) => {
    const updateQty = qty + 1
    const updateTotal = price * updateQty
    const req = {
      qty: updateQty,
      sub_amount: updateTotal
    }
    await API.patch(`/order/${id}`, req) 
  })

  const handleLess = useMutation(async ({id, qty, price, sub_amount}) => {
    if (qty === 1) {
      return
    }
    const updateQty = qty - 1
    const updateTotal = sub_amount - price
    const req = {
      qty: updateQty,
      sub_amount: updateTotal
    }
    await API.patch(`/order/${id}`, req)
  })

  const handleSubmit = useMutation(async (e) => {
    try {
      const data = {
        seller_id: cart.order[0].product.user.id,
        total: totalPay
      }

      // Insert transaction data
     const response = await API.post("/transaction", data);

      const req = {
        qty: totalQty,
        sub_total: totalPay,
        status: "success",
      };
      await API.patch(`/cartID`, req)

    const token = response.data.data.token;

    window.snap.pay(token, {
      onSuccess: function (result) {
        /* You may add your own implementation here */
        console.log(result);
        history.push("/profile");
      },
      onPending: function (result) {
        /* You may add your own implementation here */
        console.log(result);
        history.push("/profile");
      },
      onError: function (result) {
        /* You may add your own implementation here */
        console.log(result);
      },
      onClose: function () {
        /* You may add your own implementation here */
        alert("you closed the popup without finishing the payment");
      },
    });

    } catch (error) {
      console.log(error);
    }
  })

  

  useEffect(() => {
    //change this to the script source you want to load, for example this is snap.js sandbox env
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    //change this according to your client-key
    const myMidtransClientKey = process.env.REACT_APP_MIDTRANS_CLIENT_KEY;
  
    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    // optional if you want to set script attribute
    // for example snap.js have data-client-key attribute
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);
  
    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  return (
    <Layout counter={totalQty}>
      <div className="md:px-40 py-8">
      {cart == undefined ? (
          <div className='flex justify-center'>
          <img
          className="cursor-pointer"
            src='/noTransaction.webp'
            width={600}
            onClick={() => router.push("/")}
          />
          </div>
        ) : cart?.order == "" ? (
          <div className='flex my-20 justify-center'>
            <img
              src='/empty.png'
              width={500}
              onClick={() => router.push("/")}
            />
          </div>
        ) : (
          <div>
          <p className="mb-5 font-bold text-4xl text-secondary font-header">{cart?.order[0]?.product?.user?.fullname}</p>
          <p className="mb-3 text-secondary">Delivery Location</p>
          <div className="grid md:grid-cols-5 gap-2 mb-3">
            <Input type='text' className='w-full p-1 rounded border-gray-300 shadow-sm focus:ring-primary focus:border-gray-200 transition duration-300 bg-gray-100 md:col-span-4'/>
            <Button
                onClick={() => setShowMap1(true)} 
                className="px-6 py-1.5 bg-secondary text-white rounded mx-1 hover:bg-primary text-sm font-medium transition duration-300">
              <div className="flex items-center">
                <p className="mr-2">Select On Map</p> <img src="/btnMap.svg" alt="map" />
              </div>
            </Button>
            <MapModal isVisible={showMap1} onClose={() => setShowMap1(false)}>
              <h1>Hello</h1>
            </MapModal>
          </div>
          <div>
            <p className="mb-3 text-secondary">Review Your Order</p>
            <div className="grid md:grid-cols-6 gap-10 ">
              <div className="border-y-2 pt-3 border-secondary md:col-span-4 items-center ">
                <div className="overflow-y-scroll scrollbar-hide h-[15rem]">
                    {cart?.order?.map((item, index) => (
                      <div className="flex justify-between items-center w-full mb-3" key={index}>
                        <div className="flex items-center">
                          <img src={item.product?.image} alt="img" className="mr-3" width={80} height={80}/>
                          <div>
                            <p className="mb-2 font-header">{item.product?.title}</p>
                            <div className="flex mt-2">
                              <p className="mr-2 cursor-pointer" onClick={() => handleLess.mutate({id:item.id, qty:item.qty, price:item.product.price, sub_amount:item.sub_amount})}>-</p>
                              <p className="px-2 py-0 rounded bg-orange-200">{item.qty}</p>
                              <p className="ml-2 cursor-pointer" onClick={() => handleAdd.mutate({id:item.id, qty:item.qty, price:item.product.price})}>+</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col justify-center">
                          <p className="mb-2 text-red-600">{Rp.convert(item.product?.price)}</p>
                          <img  onClick={() => handleDelete.mutate(item.id)} src="/bin.svg" alt="bin" width={20} className="mt-2 ml-12 cursor-pointer"/>
                        </div>
                        {/* <div className='border-t-2 border-black mt-2 col-span-2'></div> */}
                      </div>
                    ))} 
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="border-y-2 border-secondary py-3 mb-2">
                  <div className="flex justify-between">
                    <p>Subtotal</p>
                    <p className="text-red-600">{Rp.convert(total)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Qty</p>
                    <p>{totalQty}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Ongkir</p>
                    <p className="text-red-600">{Rp.convert(ongkir)}</p>
                  </div>
                </div>
                  <div className="flex justify-between">
                    <p className="text-red-600 font-semibold">Total</p>
                    <p className="text-red-600 font-semibold">{Rp.convert(totalPay)}</p>
                  </div>
              </div>
            </div>
            <div className="flex md:justify-end">
              <Button
              onClick={() => handleSubmit.mutate()}
              className=' px-20 py-1.5 bg-secondary text-white rounded hover:bg-primary text-sm font-medium transition duration-300'>Order</Button>
            </div>
          </div>
        </div>
        )}
      </div>
    </Layout>
  )
}
