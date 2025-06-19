import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Cards from '../components/Cards'
import Filter2 from '../components/Filter2'
import { createClient } from "@supabase/supabase-js";
import useNotification from 'antd/es/notification/useNotification';
import { useCustomMessage } from '../utils/feedback';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);




function Home() {
  const [postsList, setPostsList]=useState([{}]);
  const { notify, contextHolder } = useCustomMessage();

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

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-col md:flex-row w-full justify-between gap-4 p-4 flex-grow">
        
        {/* lost items */}
        <div className="w-full md:w-1/2 flex flex-col h-full">
          <h1 className="text-center font-semibold border border-gray-800 p-2 mb-2">
            Lost Items
          </h1>
          <Filter2 className="w-full mb-2" />
          <div className="flex-grow overflow-y-auto bg-white rounded p-2 shadow h-0">
            <div className='grid grid-cols-2'>

            {postsList.map((obj, i)=>{
              if(obj.type=='lost')
                return <Cards key={i} obj={obj} />
            })}
            </div>
          </div>
        </div>
        
        {/* found items */}
        <div className="w-full md:w-1/2 flex flex-col h-full">
          <h1 className="text-center font-semibold border border-gray-800 p-2 mb-2">
            Found Items
          </h1>
          <Filter2 className="w-full mb-2 " />
          {/* <div className="flex-grow overflow-y-auto bg-white rounded p-2 shadow h-0"> */}
            <div className="flex-grow overflow-y-auto bg-white rounded p-2 shadow h-0">
              <div className='grid grid-cols-2 gap-2'>

            {postsList.map((obj, i)=>{
              if(obj.type=='found'){
                // console.log("ffffffff",obj)
                return <Cards key={i} obj={obj} />
              }
              
            })}
            </div>
          {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
