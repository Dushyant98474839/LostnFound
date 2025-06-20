import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import './App.css'
import Layout from './components/Layout'
import AuthPage from './pages/AuthPage'
import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Home from './pages/Home'
import CreatePost from './pages/CreatePost'
import { AuthProvider } from './utils/AppContext'
import ProfilePage from './pages/ProfilePage'
import UserPosts from './pages/UserPosts'
import PostPage from './pages/PostPage'
import LostPage from './pages/LostPage'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

function App() {
  const [instruments, setInstruments] = useState([]);
  useEffect(() => { getInstruments(); }, []);
  async function getInstruments() {
    const { data } = await supabase.from("users").select();
    setInstruments(data);
    console.log(instruments);
  }

  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="login" element={<AuthPage />} />
              <Route path="signup" element={<AuthPage />} />
              <Route path="home" element={<Home />} />
              <Route path="createpost" element={<CreatePost />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="my-posts" element={<UserPosts />} />
              <Route path="my-posts/:postId" element={<PostPage />} />
              <Route path="*" element={<LostPage/>}/>
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
