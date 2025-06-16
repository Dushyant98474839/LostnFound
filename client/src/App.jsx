import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import './App.css'
import Layout from './components/Layout'
import AuthPage from './pages/AuthPage'
import { useEffect} from "react";
import { createClient } from "@supabase/supabase-js";
import Home from './pages/Home'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

function App() {
  const [instruments, setInstruments] = useState([]);  
  useEffect(() => {    getInstruments();  }, []);  
  async function getInstruments() {    
    const { data } = await supabase.from("users").select();    
    setInstruments(data);  
    console.log(instruments);
  }

  return (
    <>
      <BrowserRouter>
        <Layout>

          <Routes>
            <Route path="/" element={<LandingPage />}/>
              <Route path="login" element={<AuthPage />} />
              <Route path="signup" element={<AuthPage />} />
              <Route path="home" element ={<Home/>}/>
          </Routes>
        </Layout>
      </BrowserRouter>
    </>
  )
}

export default App
