import React from 'react'
import {  Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Cart from '../pages/Cart'
import Orders from '../pages/Orders'


function Routers() {
  return (
    <Routes>
        
            <Route path='/' element={<Home/>}/>
            <Route path='/cart' element={<Cart/>}/>
            <Route path='/orders' element={<Orders/>}/>
        
    </Routes>
  )
}

export default Routers