import React, { useState } from 'react';
import {
  DropdownFilter,
  CityDropdown,
  CountryDropdown,
  StateDropdown,
} from './DropdownFilter';
import { useSearch } from '../utils/SearchContext';

function Filter2({ className = "" }) {
  const {searchQuery,setSearchQuery}=useSearch();

  
  return (
    <>
    <div className={`flex flex-row gap-3 items-center justify-center p-2 bg-gray-800 rounded ${className}`}>
      <DropdownFilter/>
      <input
        placeholder="Search Item"
        className="border border-white p-1 mx-2 rounded min-w-[20%] text-white bg-transparent"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        />
      <div className='hidden md:flex flex-row items-center gap-3'>
  <CountryDropdown type="lost" />
  <StateDropdown type="lost" />
  <CityDropdown type="lost" />
</div>

    </div>
    <div className='md:hidden items-center flex flex-row justify-center gap-2 p-2'>
            <CountryDropdown type="lost" />
            <StateDropdown type="lost" />
            <CityDropdown type="lost" />
          </div>
        </>
  );
}

export default Filter2;
