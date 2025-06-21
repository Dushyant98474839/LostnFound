import React from 'react';
import {
  DropdownFilter,
  CityDropdown,
  CountryDropdown,
  StateDropdown,
} from './DropdownFilter';
import { useSearch } from '../utils/SearchContext';

function FilterFound({ className = "" }) {
  const { foundSearchQuery, setFoundSearchQuery } = useSearch();
  return (
    <>
      <div className={`flex flex-row gap-3 items-center justify-center p-2 bg-gray-800 rounded ${className}`}>
        <DropdownFilter type="found" />
        <input
          placeholder="Search Item"
          className="border border-white p-1 mx-2 rounded min-w-[20%] text-white bg-transparent"
          value={foundSearchQuery}
          onChange={e => setFoundSearchQuery(e.target.value)}
        />
        <div className='hidden md:flex flex-row items-center gap-3'>

          <CountryDropdown type="found" />
          <StateDropdown type="found" />
          <CityDropdown type="found" />
        </div>
      </div>
      <div className='md:hidden items-center flex flex-row justify-center gap-2 p-2'>
        <CountryDropdown type="found" />
        <StateDropdown type="found" />
        <CityDropdown type="found" />
      </div>
    </>
  );
}

export default FilterFound;
