import React from 'react'
import Filter2 from './Filter2'

function Filter() {
  return (
    <>
        <div className='flex flex-row w-full justify-between border'>
            <div className='w-1/2 flex flex-col'>
                <h1 className='text-center  font-semibold border-1 border-gray-800 p-2 mb-2'> Lost Items</h1>
                <Filter2 className='w-[98%] mx-auto'/>
            </div>

            <div className='w-1/2'>
                <h1 className='text-center  font-semibold border-1 border-gray-800 p-2 mb-2'>Found Items</h1>
                <Filter2 className='w-[98%] mx-auto'/>
            </div>
            
        </div>
    </>
  )
}

export default Filter