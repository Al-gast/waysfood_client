import { useContext, useEffect, useState } from "react";
import Layout from "../components/layouts/Layout"
import { UserContext } from "../context/UserContext";
import { API } from "./api/api";
import Rp from "rupiah-format"
import { useRouter } from "next/router";
import { Error, Success } from '../helper/toast';

export default function ListProduct() {

    const [state, dispatch] = useContext(UserContext)
    const id = state.user.id
    // console.log("list id",state);
    const [data, setData] = useState([])
    const router = useRouter()

    useEffect(() => {
        const getData = async (e) => {
        try {
            const response = await API.get(`/user/${id}`);
            setData(response.data.data.products);
            // console.log("response",response);
        } catch (error) {
            console.log(error);
        }
        };
        getData();
    }, [data]);

    let handleDelete = async (e) => {
        let person = prompt("Input 'DELETE' for Delete Product", "DELETE");
        if (person == "DELETE") {
          await API.delete(`product/${e}`);
          Success({ message: `Delete Product Success!` })
        }
      };

  return (
    <Layout>
      <div className="px-40 py-10">
        <p className="font-bold text-4xl mb-10 font-header">List Product</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-md text-gray-700 bg-gray-50">
              <tr className="">
                <th scope="col" className="py-3 px-6">No</th>
                <th scope="col" className="py-3 px-6">Image</th>
                <th scope="col" className="py-3 px-6">Name</th>
                <th scope="col" className="py-3 px-6">Price</th>
                <th scope="col" className="py-3 px-6 text-center">Action</th>
              </tr>
            </thead>
            {data.map ((item, index) => (
              <tbody>
                <tr className="border-b bg-white">
                  <td className="py-4 px-6">{index + 1}</td>
                  <td className="py-4 px-6"><img src={`http://localhost:5000/uploads/${item.image}`} alt="" className="m-0 h-[134px] w-[224px] object-cover object-center"/></td>
                  <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">{item.title}</th>
                  <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">{Rp.convert(item.price)}</td>
                  <td className='pt-16 mt-2 px-6 flex justify-center'>
                    <button 
                    onClick={() => router.push(`/update/${item.id}`)}
                    className='bg-green-500 rounded-md mr-2 text-white px-4 py-2 hover:bg-green-400 active:bg-green-600'>
                      Edit
                    </button>
                    <button 
                    onClick={() => handleDelete(item.id)}
                    className='bg-red-500 rounded-md  text-white px-4 py-2 hover:bg-red-400 active:bg-red-600'>
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      </div>
    </Layout>
  )
}
