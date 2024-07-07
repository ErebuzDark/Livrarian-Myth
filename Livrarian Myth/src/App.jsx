import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import SearchBar from './components/Pages/dependencies/SearchBar';
import Login from './components/Pages/Login';
import Home from './components/Pages/Home';
import About from './components/Pages/About';
import Contact from './components/Pages/Contact';
import Searched from './components/Pages/Searched';

//USER
import Profile from './components/Pages/Profile';

//ADMIN
import Admin from './components/Pages/Admin';

function App() {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const RenderSaerchbar = () => {
    const loc = useLocation();
    const isInProfilePage = loc.pathname === '/profile';
    const isInAdminPage = loc.pathname === '/addbook';
  
    return isLoggedin && !isInProfilePage && !isInAdminPage ? <SearchBar /> : null;
  }

  return (
    <div>
      <Router>
        <Header isLoggedin={isLoggedin} setIsLoggedin={setIsLoggedin} isLoginModalOpen={isLoginModalOpen} setIsLoginModalOpen={setIsLoginModalOpen}/>

        <RenderSaerchbar />
        
        <div className='content'>
          <Routes>
            <Route path='/login' element={<Login setIsLoginModalOpen={setIsLoginModalOpen}/>} />
            <Route path='/home' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/searched' element={<Searched />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/addbook' element={<Admin />} />
          </Routes>
        </div>
      </Router>
      <Footer />
    </div>
  )
}

export default App
