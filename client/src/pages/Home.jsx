import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Cards from '../components/Cards'
import Filter2 from '../components/Filter2'
import { createClient } from "@supabase/supabase-js";
import useNotification from 'antd/es/notification/useNotification';
import { useCustomMessage } from '../utils/feedback';
import { useAuth } from '../utils/AppContext';
import { useSearch } from '../utils/SearchContext';
import FilterFound from '../components/FilterFound';
import { Radio } from 'antd';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);


function Home() {
  const [postsList, setPostsList] = useState([{}]);
  const { notify, contextHolder } = useCustomMessage();
  const { session } = useAuth();
  const { category, searchQuery, country, state, city, foundCategory,
    foundSearchQuery,
    foundCountry,
    foundState,
    foundCity } = useSearch();

  const [showOp, setShowOp] = useState()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase.from('posts').select('*');
        if (error) throw error;
        const sorted = data?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setPostsList(sorted || []);
        // console.log(data)
      } catch (error) {
        console.error('Error fetching posts:', error.message);
        notify.error('Error fetching Posts');
      }
    };
    fetchPosts();
  }, []);

  const [size, setSize] = useState('lost');
  const handleSizeChange = e => {
    setSize(e.target.value);
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-col md:flex-row w-full justify-between gap-4 p-4 flex-grow overflow-y-auto md:overflow-hidden">
        <div className='md:hidden flex flex-row justify-center items-center'>

          <Radio.Group value={size} onChange={handleSizeChange} >
            <Radio.Button value="lost">Lost</Radio.Button>
            <Radio.Button value="found">Found</Radio.Button>
          </Radio.Group>
        </div>
        {/* lost items */}
        <div
          className={`w-full md:w-1/2 flex flex-col h-full ${size !== 'lost' ? 'hidden md:flex' : 'flex'}`}
        >
          <h1 className="hidden md:block text-center font-semibold border border-gray-800 p-2 mb-2">
            Lost Items
          </h1>
          <Filter2 className="w-full mb-2" />
          <div className="flex-grow md:overflow-y-auto bg-white rounded p-2 shadow h-0">
            <div className='md:grid grid-cols-2 gap-2'>

              {postsList
                .filter((obj) =>
                  obj.type === 'lost' &&
                  !obj.resolved &&
                  (category === 'All' || obj.category?.toLowerCase() === category.toLowerCase()) &&
                  (searchQuery === '' || obj.title?.toLowerCase().includes(searchQuery.toLowerCase()) || obj.description?.toLowerCase().includes(searchQuery.toLowerCase())) &&
                  (country === undefined || obj.country === country) &&
                  (state === undefined || obj.state === state) &&
                  (city === undefined || obj.city === city)
                )
                .map((obj, i) => (
                  <Cards key={i} obj={obj} details={obj.user_id === session?.user?.id} />
                ))}

            </div>
          </div>
        </div>

        {/* found items */}
        <div
          className={`w-full md:w-1/2 flex flex-col h-full ${size !== 'found' ? 'hidden md:flex' : 'flex'}`}
        >
          <h1 className="hidden md:block  text-center font-semibold border border-gray-800 p-2 mb-2">
            Found Items
          </h1>
          <FilterFound className="w-full mb-2 " />
          {/* <div className="flex-grow overflow-y-auto bg-white rounded p-2 shadow h-0"> */}
          <div className="flex-grow md:overflow-y-auto bg-white rounded p-2 shadow h-0">
            <div className='md:grid grid-cols-2 gap-2'>
              {postsList
                .filter((obj) =>
                  obj.type === 'found' &&
                  !obj.resolved &&
                  (foundCategory === 'All' || obj.category?.toLowerCase() === foundCategory.toLowerCase()) &&
                  (foundSearchQuery === '' || obj.title?.toLowerCase().includes(foundSearchQuery.toLowerCase()) || obj.description?.toLowerCase().includes(foundSearchQuery.toLowerCase())) &&
                  (foundCountry === undefined || obj.country === foundCountry) &&
                  (foundState === undefined || obj.state === foundState) &&
                  (foundCity === undefined || obj.city === foundCity)
                )
                .map((obj, i) => (
                  <Cards key={obj.id || i} obj={obj} details={obj.user_id === session?.user?.id} />
                ))}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
