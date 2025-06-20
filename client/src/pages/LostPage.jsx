import React from 'react'
import Navbar from '../components/Navbar'

function LostPage() {
  return (
    <div className="h-[95vh] bg-gray-800">
            <Navbar/>
            <div className="bg-gray-800 mt-30 flex flex-col justify-center items-center relative">
                <div className="absolute top-0 backdrop-blur-md bg-white/0 w-1/3 h-[5%]"></div>
                <img src="landingpage.gif" className="w-1/3 h-1/3 block shadow-lg"></img>   
                <h1 className='font-semibold text-4xl mt-8 italic text center text-white'>404</h1>             
            </div>
            
        </div>
  )
}

export default LostPage