import Layout from "../components/layouts/Layout"
import Input from "../components/Input"
import Button from "../components/Button"
import { useEffect, useState } from "react"
import MapModal from "../components/Modal/mapModal"
import Image from "next/image"
import { useRouter } from "next/router"
import { API } from "./api/api"
import { useMutation } from "react-query"
import { Error, Success } from '../helper/toast';

export default function EditProfilePartner() {
  const [previewName, setPreviewName] = useState("")
  const [profile, setProfile] = useState({
    fullname:"",
    image:"",
    email:"",
    phone:"",
    location:""
  })
  const [data, setData] = useState([]);
  const [showMap, setShowMap] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]:
      e.target.type === "file" ? e.target.files : e.target.value,
    })
    if (e.target.type === "file") {
      setPreviewName(e.target.files[0].name)
    }
  }

  useEffect(() => {
    const getData = async (e) => {
      try {
        const response = await API.get(`/check-auth`)

        setProfile({
          fullname: response.data.data.fullname,
          email: response.data.data.email,
          phone: response.data.data.phone,
          image: response.data.data.image,
          location: response.data.data.location
        })
        console.log(response);
      }catch (error){
        console.log(error);
      }
    }
    getData()
  }, [setData])

  const handleSubmit = useMutation(async (e) =>{
    try {
      e.preventDefault()

      const formData = new FormData()
      formData.set("fullname", profile.fullname)
      formData.set("email", profile.email)
      formData.set("phone", profile.phone)
      formData.set("location", profile.location)
      if (previewName) {
        formData.set("image", profile?.image[0], profile?.image[0]?.name)
      }
      const response = await API.patch("/user", formData)
      // console.log(response);
      router.push('/profile-partner')
      Success({ message: `Update Profile Success!` })
    }catch (error){
      console.log(error);
    }
  })
  return (
    <Layout>
      <div className="md:px-40 py-10">
        <p className="font-bold text-4xl mb-8 font-header text-secondary">Edit Profile Partner</p>
        <form onSubmit={(e) => handleSubmit.mutate(e)}>
        <div className="grid md:grid-cols-5 gap-3 mb-5">
          <div className="col-span-4">
            <Input 
            type="text" 
            placeholder="Name Partner"
            name="fullname"
            value={profile.fullname}
            onChange={handleChange}
            />
          </div>
          <div className="col-span-1">
            <Input 
            hidden
            type="file"
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
          type="email" 
          placeholder="Email"
          name="email"
          value={profile.email}
          handleChange={handleChange}/>
        </div>
        <div className="mb-5">
          <Input 
          type="number" 
          placeholder="Phone"
          name="phone"
          value={profile.phone}
          onChange={handleChange}/>
        </div>
        <div className="grid md:grid-cols-5 gap-3 mb-16">
          <div className="col-span-4">
            <Input 
            type="text"
            name="location" 
            placeholder="Location"
            value={profile.location}
            onChange={handleChange}
            />
          </div>
          <div className="col-span-1">
          <Button
          onClick={() => setShowMap(true)} 
          className="px-6 py-1.5 bg-secondary text-white rounded hover:bg-primary text-sm font-medium transition duration-300">
            <div className="flex items-center my-[5px]">
              <p className="mr-2">Select On Map</p> <img src="/btnMap.svg" alt="map" />
            </div>
          </Button>
          <MapModal isVisible={showMap} onClose={() => setShowMap(false)}>
          <iframe
                width='100%'
                height='400px'
                id='gmap_canvas'
                src='https://maps.google.com/maps?q=Dumbways%20&t=&z=17&ie=UTF8&iwloc=&output=embed'
                frameborder='0'
                scrolling='no'
                marginheight='0'
                marginwidth='0'
                title='myFrame'></iframe>
          </MapModal>
          </div>
        </div>
          <div className="flex justify-end">
            <Button type="submit" className=' px-20 py-1.5 bg-secondary text-white rounded hover:bg-white hover:text-secondary text-sm font-medium transition duration-300'>Save</Button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
