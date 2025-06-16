import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import Footer from "../components/Footer";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/home");
      }
    };

    checkSession();
  }, [navigate]);
    return(
        <>  
        <div className="h-[95vh] bg-gray-800">
            <div className="bg-black w-full top-0">
                <div className="flex flex-row justify-between px-4 py-4">
                    <h1 className="text-white text-4xl font-semibold italic">LostNFound</h1>
                    <div className="flex flex-row gap-4">
                        <button className="bg-white text-black px-4  rounded hover:bg-gray-800 hover:text-white hover:cursor-pointer" onClick={()=>navigate("/login")}>Login</button>
                        <button className="bg-white text-black px-4 rounded hover:bg-gray-800 hover:text-white hover:cursor-pointer" onClick={()=>navigate("/signup")}>Signup</button>
                    </div>
                </div>
            </div>
            <div className="bg-gray-800 mt-30 flex justify-center items-center relative">
                <div className="absolute top-0 backdrop-blur-md bg-white/0 w-1/3 h-[5%]"></div>
                <img src="landingpage.gif" className="w-1/3 h-1/3 block"></img>                
            </div>
            
        </div>
        </>
    )
}

export default LandingPage