import React from 'react'
import { BrowserRouter, Route, Routes ,} from 'react-router-dom'
import Dashboard from './Components/dashboard/Dashboard'

const App = () => {
  return (
   <>
   <BrowserRouter>
  <Routes>
    <Route path ="/dashboard" element = {<Dashboard/>}/>
    
  </Routes>
   </BrowserRouter>
   </>
  )
}

export default App
