import React from 'react'
import {GoogleLogin} from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import shareVideo from '../assests/share.mp4'
import socialhubwhite from'../assests/socialhubwhite.png'
import jwt_decode from "jwt-decode"
import { client } from '../client'

const Login = () => {
  const navigate = useNavigate();
  const googleSuccess = (res) => {
    
    var userObject = jwt_decode(res.credential); // jwt_decode decode the encoded signature recived from signedin user
    localStorage.setItem('user', JSON.stringify(userObject))
    const {name, picture, sub} = userObject // destructuring the decoded objects
    
    const doc = { // creating the fields for backend like sanity to populate these data in backend
      _id: sub,
      _type: 'user',
      userName: name,
      image: picture
    }

    client.createIfNotExists(doc) // only create doc if it is not exists in sanity's database
      .then(() => {                 //cont...  it is used from @sanity client 
          navigate('/', { replace : true })
      })                    
  }
  
  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src = {shareVideo}
          type = "video/mp4"
          loop
          controls = {false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />
        <div className="absolute w-full h-full flex flex-col justify-center items-center top-0 left-0 bottom-0 bg-blackOverlay ">
          <div className='p-5 '>
           <img src={socialhubwhite} width={"130px"} alt="logo"/>
          </div>
          <div className='shadow-2xl'>
            <GoogleLogin
              onSuccess = {googleSuccess}
              onError = {googleFailuer}
              state_cookie_domain = "single_host_origin"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login