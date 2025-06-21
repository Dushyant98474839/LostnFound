import React, { createContext, useContext, useState } from 'react'

const SearchContext=createContext();

export const SearchProvider=({children}) =>{
  const [category, setCategory]=useState("All")
    const [searchQuery, setSearchQuery] = useState("");
    const [country, setCountry] = useState(undefined);
    const [state, setState] = useState(undefined);
    const [city, setCity] = useState(undefined);

    const [foundCategory, setFoundCategory] = useState("All");
  const [foundSearchQuery, setFoundSearchQuery] = useState("");
  const [foundCountry, setFoundCountry] = useState(undefined);
  const [foundState, setFoundState] = useState(undefined);
  const [foundCity, setFoundCity] = useState(undefined);

    return(
        <SearchContext.Provider value={{category, searchQuery, country, state, city, setCategory, setSearchQuery, setCountry, setState, setCity,foundCategory,
        foundSearchQuery,
        foundCountry,
        foundState,
        foundCity,
        setFoundCategory,
        setFoundSearchQuery,
        setFoundCountry,
        setFoundState,
        setFoundCity,}}>

        {children}
        
        </SearchContext.Provider>
    )
    
}

export const useSearch = () => useContext(SearchContext);
