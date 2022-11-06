import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { API } from "./api/api";

//component
import Card from "../components/Card"
import Layout from "../components/layouts/Layout"
import { UserContext } from "../context/UserContext";

export default function Home() {
  const router = useRouter()
  
  const [state, dispatch] = useContext(UserContext)

  // modal login
  const [showLogin, setShowLogin] = useState(false);
  const handleClick = () => setShowLogin(true);

  const [shop, setShop] = useState([])
  console.log("shoppppppppppppppppppppppppppppppp", shop);


  useEffect(() => {
    const getShops = async (e) => {
      try {
        const response = await API.get("/partners");
        setShop(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getShops();
  }, []);

  return (
    <>
    <Layout title={process.env.appName} setShowLogin={setShowLogin} showLogin={showLogin}>
      <div className="flex justify-center items-center bg-primary mb-16">
      <div className='grid md:grid-cols-5 content-center px-1 py-[85px]'>
        <div className="py-20 col-span-3">
          <div className="md:ml-6">
          <h1 className="text-secondary text-5xl font-semibold mb-2 font-header">Are You Hungry?</h1>
          <h1 className="text-secondary text-5xl font-semibold mb-7 font-header">Express Home Delivery</h1>
          <div className="grid md:grid-cols-3">
            <div className="border-t-4 border-secondary mr-2 ml-1 col-span-1"></div>
            <p className="px-3 col-span-2 text-sm w-80">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Explicabo, consequatur impedit accusantium facilis aspernatur architecto nulla ab adipisci
            </p>
          </div>
          </div>
        </div>
        <div className="col-span-2">
          <img src='/pizza.svg' alt="pizza" width={393} height={408}/>
        </div>
      </div>
      </div>

      <div className="md:px-40">
        <div>
          <h1 className="text-secondary font-bold mb-4 text-3xl font-header">Popular Restaurant</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-16">
            {shop?.map((item)=>(
              <div onClick={!state.isLogin ? handleClick : () => router.push(`/menu/${item.id}`)}>  
                  <Card>
                      <div className="flex justify-start items-center">
                        <img src={item.image} alt="logo" className="mr-3 h-[70px] w-[70px] object-cover object-center rounded-full" />
                        <p className="font-bold text-xl text-secondary font-header">{item.fullname}</p>
                      </div>
                  </Card>
              </div>
            ))
            }
          </div>
        </div>
        <div>
          <h1 className="text-secondary font-bold mb-4 text-3xl font-header">Restaurant Near You</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-16">
            {shop?.map((item)=>(
            <div onClick={!state.isLogin ? handleClick : () => router.push(`/menu/${item.id}`)}>
                <Card>
                    <div className="">
                      <img src={item.products[0]?.image} alt="logo" className="mb-2 h-[134px] w-[224px] object-cover object-center"/>
                      <p className="font-semibold text-secondary font-header text-lg">{item.menus?.[0].title}</p>
                      <p className="font-semibold text-secondary">{item.range}{' '}km</p>
                    </div>
                </Card>
            </div>
            ))
            }
          </div>
        </div>
      </div>
    </Layout>
    </>
  )
}
