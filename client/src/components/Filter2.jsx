import React, { useState } from 'react'
import {DropdownFilter,CityDropdown, CountryDropdown} from './DropdownFilter'
import { EnvironmentOutlined } from '@ant-design/icons';

function Filter2({ className = "" }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [city, setCity] = useState(null);
    const [country, setCountry] =useState(null);

    return (
        <>
            <div className={`flex flex-row gap-2 items-center justify-center p-2 bg-gray-800 rounded ${className}`}>
                <DropdownFilter className="w-full"/>
                <input placeholder='Search Item' className='border-1 border-white p-1 mx-2 rounded w-md text-white' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <CityDropdown value={city} onChange={setCity} />
                <CountryDropdown value={country} onChange={setCountry}/>
                <EnvironmentOutlined className='hover:cursor-pointer text-xl'/>
            </div>
        </>
    )
}

export default Filter2