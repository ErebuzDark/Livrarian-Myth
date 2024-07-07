import React, { useState, useEffect } from "react";
import axios from 'axios';
import Cookies from 'js-cookie';
import logo from '../assets/header-assets/logo.png';
import '../styles/header.css';

import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-bootstrap';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { useNavigate } from 'react-router-dom';

import Register from './Pages/dependencies/register';

export const toggleLoginForm = () => {
    setIsLoginModalOpen(true);
};

export const successLogin = (msg) =>toast.success(msg);
export const successLogout = (msg) => toast(msg);
export const errorLogin = (msg) => toast.error(msg);

export const somethingSuccess = (msg) => toast(msg);
export const somethingError = (msg) => toast(msg);
export const somethingNeutral = (msg) => toast(msg);

const Header = ({ isLoggedin, setIsLoggedin, isLoginModalOpen, setIsLoginModalOpen }) => {
    const [width, setWidth] = useState(window.innerWidth);
    const [isOpen, setIsOpen] = useState(false);
    const [isRegister, setIsRegister] = useState(false);

    //for login
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');

    //toast
    

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
          const response = await axios.post('http://localhost:3001/api/login', {
            username,
            password
          }, { withCredentials: true });
          setMessage('');
          setPassword('');
          console.log('Response from server:', response);
          setIsLoginModalOpen(false);
          successLogin(`Welcome, ${Cookies.get('username')}`);
          navigate('/home');
          
        } catch (error) {
            if (error.response && error.response.status === 401) {
                errorLogin("Incorrect Username or Password")
            } else {
                errorLogin('Login failed: ' + (error.response ? error.response.data : error.message))
            }
        }
    };
    
    const handleLogout = async () => {
        try {
          await axios.post('http://localhost:3001/api/logout');
          Cookies.remove('username');
          Cookies.remove('userID');
          toggleIsLoggedOut();
          successLogout('Come back soon <3');
          navigate('/login');
        } catch (error) {
          console.error('Error logging out:', error);
        }
      };

    //WIDTH
    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
            if (window.innerWidth >= 550) {
              setIsOpen(false);
            }
          };
      
        window.addEventListener('resize', handleResize);
        
        return () => {
        window.removeEventListener('resize', handleResize);
        };
    }, []);


    //States for modal control
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        console.log('dropdown');
    };

    const toggleIsLoggedIn = () => {
        setIsLoggedin(true);
        setIsOpen(false);
        setIsLoginModalOpen(false);
    }

    const toggleIsLoggedOut = () => {
        setIsLoggedin(false);
    }

    const toggleShowLoginModal = () => {
        setIsLoginModalOpen(true);
        setIsRegister(false);
    }

    const toggleRegister = () => {
        setIsOpen(false);
        setIsLoginModalOpen(false);
        setIsRegister(true);
    }

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    useEffect(() => {
        const checkAuth = () => {
          try {
            const username = Cookies.get('username');
            if (username) {
              console.log('User is authenticated via cookie, redirecting to home');
              setIsLoggedin(true);
              return;
            } else {
              console.log('No user is authenticated');
              setIsLoggedin(false);
              navigate('/login');
            }
          } catch (error) {
            console.error('Error checking auth:', error);
            setIsLoggedin(false);
            navigate('/login');
          }
        };
      
        checkAuth();
      }, [navigate]);
      
      
    
    return (
        <>
        <div className="head-container border-bottom">
            <div className="header-inner-container">
                <div className="web-info-cont">
                    {width > 600 && 
                        <div className="web-info-cont">
                            <img className="logo" src={logo} alt="website-logo" />
                        </div>
                    }
                    <div className="web-name"><h3>Livrarian Myth</h3></div>
                </div>
                {!isLoggedin && (
                    <>
                        <div>
                            <button type="button" className="btn btn-primary m-2 bg-dark bg-gradient border-0" onClick={toggleShowLoginModal}>Login</button>
                        </div>
                        
                        {isLoginModalOpen && (
                        <div className="wrapper fadeInDown">
                            <div id="formContent">
                                <div className="text-end p-3 transition duration-300">
                                    <i className="bi bi-x-lg hover:text-blue-500" onClick={() => setIsLoginModalOpen(false)}></i>
                                </div>
                                <div>
                                    <h3>Login</h3>
                                </div>
                                <form className="p-1" onSubmit={handleLogin}>
                                    <input type="text" id="login" className="fadeIn second" name="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                                    <input type={showPassword ? 'text' : 'password'}  id="password" className="fadeIn third" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                    <div className="show-pass fadeIn fourth " onClick={togglePasswordVisibility}>
                                        <p className="fs-6 text-body-tertiary">Show password</p><i className={`text-body-tertiary bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'}`}></i>
                                    </div>
                                    <input type="submit" className="fadeIn fourth bg-slate-950 hover:bg-slate-800" value="Log In" />
                                </form>
                                <div id="formFooter" onClick={toggleRegister}>
                                    <a className="underlineHover">Register</a>
                                </div>
                                {message && <div className="message">{message}</div>}
                            </div>
                        </div>
                        )}
                    </>
                    )}

                    {width >= 550 && isLoggedin &&
                        <div className="navs">
                            <div className="nav-item" onClick={() => navigate('/home')}>Home</div>
                            <div className="nav-item" onClick={() => navigate('/about')}>About</div>
                            <div className="nav-item" onClick={() => navigate('/contact')}>Contact</div>
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle bg-white border-0" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="bi bi-person-circle"></i>
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <li><a className="dropdown-item" onClick={() => navigate('/profile')}>Profile</a></li>
                                    <li><a className="dropdown-item">Settings</a></li>
                                    <li><a className="dropdown-item" onClick={handleLogout}>Logout</a></li>
                                </ul>
                            </div>
                        </div>
                    }
                    {width < 549 && isLoggedin &&
                        <div className="dropdown">
                            <button className="dropdown-button" type="button" onClick={toggleDropdown}>
                                <i onClick={() => setIsOpen(true)} className="bi bi-list"></i>
                            </button>
                        </div>
                    }
                    {isRegister && <Register setIsRegister={setIsRegister} setIsLoginModalOpen={setIsLoginModalOpen} successLogin={successLogin} errorLogin={errorLogin}/>}
                    {isOpen &&
                        <ul className="mydropdrop bg-zinc-200">
                            <button className="close-button" onClick={toggleDropdown}><i className="bi bi-x-lg"></i></button>
                            <li onClick={toggleDropdown}><a className="dropdown-item" onClick={() => navigate('/home')}>Home</a></li>
                            <li onClick={toggleDropdown}><a className="dropdown-item" onClick={() => navigate('/about')}>About</a></li>
                            <li onClick={toggleDropdown}><a className="dropdown-item" onClick={() => navigate('/contact')}>Contact</a></li>
                            <li onClick={toggleDropdown}><a className="dropdown-item" onClick={() => navigate('/profile')}>Profile</a></li>
                            <li onClick={toggleDropdown}><a className="dropdown-item" onClick={handleLogout}>Logout</a></li>
                        </ul>
                    }
                    
            </div>
            
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition: Bounce
        />
        </>
    );
}

export default Header;