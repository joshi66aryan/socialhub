import React, {useEffect} from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './components/Login'
import Home from './container/Home'
import { fetchUserLS } from './utils/fetchUserLS'


const App = () => {
   const navigate = useNavigate()

  useEffect(() => {
    const user = fetchUserLS()
    if(!user) navigate('/login')
  }, [])
  
  return (
    <Routes>
      <Route path="login" element={<Login/>} />
      <Route path="/*" element={<Home/>} />
    </Routes>
  )
}

export default App