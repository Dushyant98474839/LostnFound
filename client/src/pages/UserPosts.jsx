import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../utils/AppContext';
import { createClient } from '@supabase/supabase-js';
import { useCustomMessage } from '../utils/feedback';
import Cards from '../components/Cards';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

function UserPosts() {

    const [myPostsList, setMyPostsLists]=useState([]);
    const {notify, contextHolder}=useCustomMessage();
    const {session}=useAuth();

    useEffect(()=>{
        console.log(session)
        const fetchPosts=async()=>{
            const {data,error}=await supabase.from("posts").select("*").eq("user_id",session.user.id);
            if(error){
                return notify.error(error.message);
            }
            console.log(data)
            setMyPostsLists(data);
        }
        fetchPosts()
    },[session])

  return (
    <div className="min-h-screen bg-gray-50">
  {contextHolder}
  <Navbar />

  <div className="md:mx-8 mt-6">
    <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">My Posts</h1>

    <div className="bg-white rounded-lg p-4 shadow-md">
      {myPostsList.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          No posts to display.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myPostsList.map((obj, i) => (
            <Cards
              key={i}
              obj={obj}
              displayOptions={obj.user_id === session?.user?.id} details={true}
            />
          ))}
        </div>
      )}
    </div>
  </div>
</div>

  )
}

export default UserPosts