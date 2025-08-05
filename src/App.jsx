import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from './Components/dashboard/Dashboard'

const App = () => {
  return (
   <>
   <BrowserRouter>
   <Router>
    <Routes path ="/dashboard" element = {<Dashboard/>}>
            
    </Routes>
   </Router>
   </BrowserRouter>
   </>
  )
}

export default App
