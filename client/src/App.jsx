import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import './App.css'
import Layout from './components/Layout'
import Auth from './pages/Auth'

function App() {

  return (
    <>
      <BrowserRouter>
        <Layout>

          <Routes>
            <Route path="/" element={<LandingPage />}/>
              <Route path="login" element={<Auth />} />
              <Route path="signup" element={<Auth />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </>
  )
}

export default App
