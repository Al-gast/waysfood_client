import Layout from "../../components/layouts/Layout"
import Card from "../../components/Card"
import Button from "../../components/Button"
import { useRouter } from "next/router";
import Rp from 'rupiah-format'
import { useContext, useEffect, useState } from "react";
import { API } from "../api/api";
import { useMutation } from "react-query";


export default function Menus() {
  const router = useRouter()
  const id = router.query.menu

  const [cart, setCart] = useState([])

  const [data, setData] = useState([])

  useEffect(() => {
    const getData = async (e) => {
      try {
        const response = await API.get(`/user/${id}`);
        setData(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [setData]);

  useEffect(() => {
    const getCart = async (e) => {
      try{
        const response = await API.get("/cart-status")
        setCart(response.data.data)
      } catch (error) {
        console.log(error);
      }
    }
    getCart()
  }, [setCart])

  const addOrder = useMutation(async ({ id, price }) => {
    // return console.log(state);
    try {
      const auth = await API.get("/check-auth", {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      });

      await API.post("/cart", {
        user_id: auth.data.data.id,
        qty: 1,
        sub_total: 0,
        status: "pending",
      });

      const order = {
        product_id: id,
        sub_amount: price,
      };
      await API.post("/order", order);
    } catch (error) {
      console.log(error);
      alert("Failed Create Order");
      console.log(id, price);
    }
  });

  return (
    <>
      <Layout>
        <div className="md:px-40 py-10">
          <p className="font-semibold text-3xl text-secondary mb-7 flex items-center font-header"><img src={data?.image} alt="logo" className="mr-3 h-[70px] w-[70px] object-cover object-center rounded-full" />{data?.fullname}, Menus</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* {addOrder.isLoading && <h1>Tunggu...</h1>} */}
            {data.products?.map ((item)=>(
              <Card className="block p-2 max-w-sm bg-white rounded-lg border border-gray-200 shadow-sm ">
                  <div className="">
                    <img src={`http://localhost:5000/uploads/${item.image}`} alt="logo" className="mb-2 h-[134px] w-[224px] object-cover object-center"/>
                    <p className="font-semibold text-secondary font-header text-lg">{item.title}</p>
                    <p className="font-semibold text-secondary mb-3">{Rp.convert(item.price)}</p>
                    <Button type="button" className='w-full bg-primary rounded hover:bg-secondary hover:text-primary transition duration-300' onClick={() =>
                        addOrder.mutate({ id: item.id, price: item.price })}>Order</Button>
                  </div>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    </>
  )
}