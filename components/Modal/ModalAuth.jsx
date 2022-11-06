import { useContext, useState } from "react"
import Button from "../Button"
import Input from "../Input"
import Modal from './modal'
import { UserContext } from "../../context/UserContext";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { API } from "../../pages/api/api";
import { Error, Success } from '../../helper/toast';

export default function ModalAuth({showLogin, setShowLogin}) {    
  
  //show modal
  const [showRegister, setShowRegister] = useState(false);
  const notify = () => toast("Wow so easy!");

  //switch modal
  const handleSwitchRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  }

  const handleSwitchLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
  }

  //functional
  const [login, setLogin] = useState({})
  const router = useRouter()
  const [state, dispatch] = useContext(UserContext)

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault()

      const config = {
        headers: {
          "Content-Type": "aplication/json"
        }
      }
      const body = JSON.stringify(form)

      const response = await API.post("/login", body, config)

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: response.data.data
      })
      setShowLogin(false)
      Success({ message: `Login Success!` })
      if(response.data.data?.role === "partner"){
        router.push("/income-transaction")
      }else{
        router.push("/")
      }
    }catch (error) {
      Error({ message: `Login Filed!` })
    }
  }) 

  const [register, setRegister] = useState({
    email: "",
    password: "",
    fullname: "",
    phone: "",
    gender: "",
    role: "",
  });

  
  const handleChangeRegister = (e) => {
    setRegister({
      ...register,
      [e.target.name]: e.target.value,
    });
  }
  const handleSubmitRegister = useMutation(async (e) => {
    try {
      e.preventDefault();
      const config = {
        Headers: {
          "Content-type": "aplication/json",
        },
      };
      const body = JSON.stringify(register);

      const response = await API.post("/register", body, config);

      Success({ message: `Register Successs!` })

      setShowLogin(true);
      setShowRegister(false);

    } catch (error) {
      Error({ message: `Register Filed!` })
    }
    setShowRegister(false)
  })
 
  return (
    <>
        <>
            <Button onClick={() => setShowRegister(true)}>Register</Button>
            <Modal isVisible={showRegister} onClose={() => setShowRegister(false)}>
            <h1 className="font-semibold text-4xl text-primary mb-7">Register</h1>
              <form onSubmit={(e) => handleSubmitRegister.mutate(e)}>
                <div className="mb-5">
                  <Input 
                  type='email' 
                  placeholder="Email"
                  onChange={handleChangeRegister}
                  name="email"
                  />
                </div>
                <div className="mb-5">
                  <Input 
                  type='password' 
                  placeholder="Password"
                  onChange={handleChangeRegister}
                  name="password"
                  />
                </div>
                <div className="mb-5">
                  <Input 
                  type='text' 
                  placeholder="Full Name"
                  onChange={handleChangeRegister}
                  name="fullname"
                  />
                </div>
                <div className="mb-5">
                  <Input 
                  type='text' 
                  placeholder="Gender"
                  onChange={handleChangeRegister}
                  name="gender"
                  />
                </div>
                <div className="mb-5">
                  <Input 
                  type='number' 
                  placeholder="Phone"
                  onChange={handleChangeRegister}
                  name="phone"
                  />
                </div>
                <div className="mb-6">
                  <select
                  name="role" 
                  onChange={handleChangeRegister}
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:ring-primary focus:border-gray-200 transition duration-300 bg-gray-100">
                    <option selected className="hidden">As User</option>
                    <option value="customer">Customer</option>
                    <option value="partner">Partner</option>
                  </select>
                </div>
                <div className="mb-3">
                  <Button type="submit" className="w-full bg-secondary text-white rounded-xl hover:bg-primary hover:text-white hover:border-primary  text-sm font-medium transition duration-300 py-2.5">Register</Button>
                </div>
                <div className="text-sm font-medium text-gray-500 text-center">
                Already have an account ? <a onClick={handleSwitchLogin} className="text-gray-600 font-bold hover:underline">Klik Here</a>
                </div>
              </form>
            </Modal>
        </>

        <>
            <Button onClick={() => setShowLogin(true)}>Login</Button>
            <Modal isVisible={showLogin} onClose={() => setShowLogin(false)}>
              <h1 className="font-semibold text-4xl text-primary mb-10">Login</h1>
              <form onSubmit={(e) => handleSubmit.mutate(e)}>
                <div className="mb-5">
                  <Input 
                  type='email' 
                  placeholder="Email"
                  name="email"
                  id="email"
                  onChange={handleChange}/>
                </div>
                <div className="mb-8">
                  <Input 
                  type='password' 
                  placeholder="Password"
                  name="password"
                  id="password"
                  onChange={handleChange}
                  />
                </div>
                <div className="mb-5">
                  <Button type="submit" className="w-full bg-secondary text-white rounded-xl hover:bg-primary hover:text-white hover:border-primary  text-sm font-medium transition duration-300 py-2.5">Login</Button>
                </div>
                <div className="text-sm font-medium text-gray-500 text-center">
                Don't have an account ? <a onClick={handleSwitchRegister} className="text-gray-600 font-bold hover:underline">Klik Here</a>
                </div>
              </form>
            </Modal>
        </>

    </>
  )
}
