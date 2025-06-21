import React from 'react';
import {
  DropdownFilter,
  CityDropdown,
  CountryDropdown,
  StateDropdown,
} from './DropdownFilter';
import { useSearch } from '../utils/SearchContext';

function FilterFound({ className = "" }) {
  const {foundSearchQuery,setFoundSearchQuery}=useSearch();
  return (
    <div className={`flex flex-row gap-3 items-center justify-center p-2 bg-gray-800 rounded ${className}`}>
      <DropdownFilter type="found" />
      <input
        placeholder="Search Item"
        className="border border-white p-1 mx-2 rounded w-[20%] text-white bg-transparent"
        value={foundSearchQuery}
        onChange={e => setFoundSearchQuery(e.target.value)}
      />
      <CountryDropdown type="found" />
      <StateDropdown type="found" />
      <CityDropdown type="found" />
    </div>
  );
}

export default FilterFound;
