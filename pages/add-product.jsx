import Layout from "../components/layouts/Layout"
import Input from "../components/Input"
import Button from "../components/Button"
import { useState } from "react"
import { useMutation } from "react-query"
import { API } from "./api/api"
import { useRouter } from "next/router"
import { Error, Success } from '../helper/toast';

export default function AddProduct() {
  const [previewName, setPreviewName] = useState("")
  const [form, setForm] = useState({})
  const route = useRouter()
  // console.log("add product",form);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
      e.target.type === "file" ? e.target.files : e.target.value,
    })
    if (e.target.type === "file") {
      setPreviewName(e.target.files[0].name)
    }
  }

  const handleSubmit = useMutation(async (e) => {
    try{
      e.preventDefault()

      const formData = new FormData()
      formData.set("image", form.image[0], form.image[0].name);
      formData.set("title", form.title);
      formData.set("price", form.price);

      // insert category data
      await API.post("/product", formData)
      Success({ message: `Add Product Success!` })
      route.push('/list-products')
    }catch (error){
      Error({ message: `Add Product Filed!` })
    }
  })

  return (
    <Layout>
      <div className="md:px-40 py-10">
        <p className="font-bold text-3xl mb-8">Add Product</p>
        <form onSubmit={(e) => handleSubmit.mutate(e)}>
        <div className="grid md:grid-cols-5 gap-3 mb-5">
          <div className="col-span-4">
            <Input 
            type="text" 
            placeholder="Title"
            name="title"
            onChange={handleChange}
            />
          </div>
          <div className="col-span-1">
            <Input 
            type="file"
            hidden
            id="image"
            name="image"
            onChange={handleChange} 
            />
            <label htmlFor="image" 
              className={previewName === "" ? "addProductImage" : "previewName"}>
              {previewName === "" ? "Attach Image" : previewName}
              <img src="/paperClip.svg" alt="paperclip" />
            </label>
          </div>
        </div>
        <div className="mb-5">
          <Input 
          type="number" 
          placeholder="Price"
          name="price"
          onChange={handleChange}
          />
        </div>
          <div className="flex justify-end">
            <Button type="submit" className=' px-20 py-1.5 bg-secondary text-white rounded hover:bg-white hover:text-secondary text-sm font-medium transition duration-300'>Save</Button>
          </div>
          </form> 
      </div>
    </Layout>
  )
}
