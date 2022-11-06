import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { API, setAuthToken } from '../pages/api/api'
import { UserContext } from './UserContext'

export default function CheckAuth( {children} ) {
    const [state, dispatch] = useContext(UserContext)
    const router = useRouter()

    useEffect(() => {
        if (localStorage.token) {
            setAuthToken(localStorage.token)
        }
    }, [state])

    const checkUser = async () => {
        try{
            const response = await API.get("check-auth")

            let payload = response.data.data
            payload.token = localStorage.token
            dispatch({
                type: "USER_SUCCESS",
                payload,
              });
        }catch (error){
            if(error.response.data.code === 400){
                router.push("/")
            }
        }
    }

    useEffect(() => {
        checkUser()
    }, [])
  return <div>{children}</div>
}
