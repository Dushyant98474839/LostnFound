import React, { useState } from 'react';
import {
  DropdownFilter,
  CityDropdown,
  CountryDropdown,
  StateDropdown,
} from './DropdownFilter';

function Filter2({ className = "" }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [country, setCountry] = useState(undefined);
  const [state, setState] = useState(undefined);
  const [city, setCity] = useState(undefined);

  const handleCountryChange = (value) => {
    setCountry(value);
    setState(undefined);
    setCity(undefined);
  };

  
  const handleStateChange = (value) => {
    setState(value);
    setCity(undefined);
  };

  return (
    <div className={`flex flex-row gap-3 items-center justify-center p-2 bg-gray-800 rounded ${className}`}>
      <DropdownFilter />
      <input
        placeholder="Search Item"
        className="border border-white p-1 mx-2 rounded w-[20%] text-white bg-transparent"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <CountryDropdown value={country} onChange={handleCountryChange} />
      <StateDropdown selectedCountryCode={country} value={state} onChange={handleStateChange} />
      <CityDropdown selectedCountryCode={country} selectedStateCode={state} value={city} onChange={setCity} />
    </div>
  );
}

export default Filter2;
