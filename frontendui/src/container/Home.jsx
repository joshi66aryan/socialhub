import React, {useState, useRef, useEffect} from 'react'
import { HiMenu } from 'react-icons/hi'
import { AiFillCloseCircle } from 'react-icons/ai'
import { Link, Route, Routes } from 'react-router-dom'

import Sidebar from '../components/Sidebar'
import UserProfile from '../components/UserProfile'
import HomeImage from './HomeImage'
import { userQuery } from '../utils/sanitydatafetching'

import { client } from '../client'
import socialhub from '../assests/socialhub.jpeg'
import { fetchUserLS } from '../utils/fetchUserLS'


const Home = () => {

  const [toggleSidebar, setToggleSidebar] = useState(false)
  const [user, setUser] = useState(null)
  const scrollRef =useRef(null);

  const userInfo = fetchUserLS(); // from local storage, file in utils

  useEffect(() => {
    const query = userQuery(userInfo?.sub)
    client.fetch(query)
      .then((data) => {   // return id, name, picture link as it was store during login process in login.js
        setUser(data[0]);
      })
  }, [])
  
  useEffect(() => {
    scrollRef.current.scrollTo(0,0)
  }, [])
  

  return (
    // md: flex-col -> for medium size screen
    // h-screen -> height : 100vh;
    //first sidebar is for large screen and remain hidden for small devices
    <div className='flex bg-gray-50 md:flex-row flex-col h-screen transaction-height duration-75 ease-out'> 
      <div className='hidden md:flex h-screen flex-initial'>
          <Sidebar user={user && user}/>    
      </div>

      {/* nav bar for small devices */}
      <div className='flex md:hidden flex-row'> 
        <div className='p-2 w-full flex flex-row justify-between items-center shadow-md'>
          <HiMenu fontSize = {32} className = "cursor-pointer" onClick = {() => setToggleSidebar(true)}/>
          <Link to = "/">
            <img src = {socialhub} alt="logo" className='w-28 rounded-lg'/>
          </Link>
          <Link to = {`user-profile/${user?._id}`}>
            <img src = {user?.image} alt="logo" className='w-8 rounded-full'/>
          </Link>
        </div>

          { // to toggle the side bar after clicking the hambar menu in small device 
            toggleSidebar && ( 
              <div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in '>
                <div className='absolute w-full flex justify-end items-center p-2'>
                  <AiFillCloseCircle fontSize={28} className='cursor-pointer' onClick ={() => setToggleSidebar(false)} />
                </div>
                <Sidebar user={user && user} closeToggle = {setToggleSidebar}/>
              </div>
            )  
          }
      </div>

      {/* if it is home route then HomeImage is displayed, if it is in user-profile route, then UserProfile will displayed */}        
      <div className='pb-2 flex-1 h-screen overflow-y-scroll' ref = {scrollRef}>
        <Routes>
          <Route path = "/user-profile/:userId" element={<UserProfile/>}/>
          <Route path = "/*" element={<HomeImage user = {user && user }/>}/>
        </Routes>
      </div>
    </div>
  )
}

export default Home