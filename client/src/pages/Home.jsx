import React from 'react'
import Navbar from '../components/Navbar'
import Cards from '../components/Cards'
import Filter2 from '../components/Filter2'

function Home() {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-col md:flex-row w-full justify-between gap-4 p-4 flex-grow">
        
        {/* Lost Items Column */}
        <div className="w-full md:w-1/2 flex flex-col h-full">
          <h1 className="text-center font-semibold border border-gray-800 p-2 mb-2">
            Lost Items
          </h1>
          <Filter2 className="w-full mb-2" />
          <div className="flex-grow overflow-y-auto bg-white rounded p-2 shadow h-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <Cards key={i} />
            ))}
          </div>
        </div>

        {/* Found Items Column */}
        <div className="w-full md:w-1/2 flex flex-col h-full">
          <h1 className="text-center font-semibold border border-gray-800 p-2 mb-2">
            Found Items
          </h1>
          <Filter2 className="w-full mb-2" />
          <div className="flex-grow overflow-y-auto bg-white rounded p-2 shadow h-0">
            {Array.from({ length: 10 }).map((_, i) => (
              <Cards key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
