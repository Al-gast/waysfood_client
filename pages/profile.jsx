import Button from "../components/Button"
import Card from "../components/Card"
import Layout from "../components/layouts/Layout"
import { useRouter } from "next/router"
import Rp from "rupiah-format"
import { API } from "./api/api"
import { useEffect, useState } from "react"
import dateFormat from "dateformat";

export default function profile() {
  const router = useRouter()
  const [profile, setProfile] = useState({})
  const [transaction, setTransaction] = useState()
  console.log("transactionnnnnn", transaction);

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

  useEffect(() => {
    const getTransaction = async (e) => {
      try {
        const response = await API.get("/transactions")
        setTransaction(response.data.data)
      } catch (error) {
        console.log(error);
      }
    }
    getTransaction()
  }, [])

  return (
    <Layout>
      <div className="px-40">
          <div className="grid md:grid-cols-2 pt-12">
              <div className="mb-8">
                <p className="mb-5 font-bold text-4xl text-secondary font-header">My Profile</p>
                <div className="flex items-center mb-5">
                  <img src={`http://localhost:5000/uploads/${profile.image}`} alt="profile" width={180} height={222} className='mr-5 w-[180px] h-[222px] object-cover object-center'/>
                  <div>
                    <div>
                      <p className="font-semibold text-lg text-secondary">Full Name</p>
                      <p>{profile.fullname}</p>
                    </div>
                    <div className="mt-5 mb-5">
                      <p className="font-semibold text-lg text-secondary">Email</p>
                      <p>{profile.email}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-lg text-secondary">Phone</p>
                      <p>{profile.phone}</p>
                    </div>
                  </div>
                </div>
                <Button onClick={()=> router.push("/edit-profile")} className='px-14 py-1.5 bg-secondary text-white rounded hover:bg-white hover:text-secondary text-sm font-medium transition duration-300'>Edit Profile</Button>
              </div>
              <div>
                <p className="mb-5 font-bold text-4xl text-secondary font-header">History Transaction</p>
                {transaction == undefined ? (
                  <img src='/noTransaction.webp' alt='notransaction' />
                ) : (
                <div className='overflow-y-auto scrollbar-hide h-[17.5rem]'>
                  {transaction?.map((item) => (
                      <Card className="block p-3 max-w-sm bg-white rounded-lg border border-gray-200 shadow-sm mb-2 py-4">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-bold">{item?.cart?.order[0]?.product?.user?.fullname}</p>
                            <p><b>{dateFormat(item.created_at, "dddd,   ")}</b>
                              {dateFormat(item.created_at, "d mmmm yyyy,   ")}</p>
                            <p className="text-secondary">Total : {Rp.convert(item.total)}</p>
                          </div>
                          <div>
                            <img src="/logo.svg" alt="logo" className="mb-2" />
                            <h1
                              className={
                                item.status == "success"
                                  ? "w-3/4 rounded-md bg-green-200 text-green-600 text-center my-auto py-1"
                                  : "w-3/4 rounded-md bg-yellow-200 text-yellow-800 text-center my-auto py-1"
                              }>
                              {item.status}
                            </h1>
                          </div>
                        </div>
                      </Card>
                  ))}
                </div>
                )}
              </div>
          </div>
      </div>
    </Layout>
  )
}
