import React, { useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import '../../styles/login.css'
import background from '../../assets/login-page-assets/background-books.jpg';
import booksample from '../../assets/bookCover.jpeg';


//cover pages foy my books
import ph from '../../assets/book-class-covers/ph.jpg';
import ch from '../../assets/book-class-covers/ch.jpg';
import hd from '../../assets/book-class-covers/hd.jpg';
import th from '../../assets/book-class-covers/th.jpg';
import gk from '../../assets/bookCover.jpeg';

const Login = ({ setIsLoginModalOpen }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            const username = Cookies.get('username');
            
            console.log('Checking for username cookie:', username);
            if (username) {
                console.log('User is authenticated via cookie, redirecting to home');
                navigate('/home');
                return;
            } else {
                console.log('No username cookie found, redirecting to login');
                navigate('/login');
            }
        };

        checkAuth();
    }, [navigate]);


    const dummy_data = [
        {id: '1', title: 'Philippine Myth', details: 'These books talk about chachacha and broom broom broom. Some text are defined buy mouth of dinosaurs', img: ph},
        {id: '2', title: 'Greek Myth ', details: 'These books talk about chachacha and broom broom broom. Some text are defined buy mouth of dinosaurs', img: gk},
        {id: '3', title: 'Chinese Myth ', details: 'These books talk about chachacha and broom broom broom. Some text are defined buy mouth of dinosaurs', img: ch},
        {id: '4', title: 'Hindu Myth ', details: 'These books talk about chachacha and broom broom broom. Some text are defined buy mouth of dinosaurs', img: hd},
        {id: '5', title: 'Thai Myth ', details: 'These books talk about chachacha and broom broom broom. Some text are defined buy mouth of dinosaurs', img: th},
    ];

    return (
        <div className="outer-cont d-flex flex-column">
            <div className="backdrop">
                <img className="w-60 h-60 rounded-full" src="src/assets/header-assets/logo-with-name.png" alt="company-logo" />
                <h1 className="text-white fw-bold">Livrarian Myth</h1>
                <p className="tagline fs-4">Immerse yourself in endless stories at our online book haven, anytime, anywhere.</p>
                <button className="read btn bg-dark text-white" onClick={() => setIsLoginModalOpen(true)}><p className="fs-5">Read now</p></button>
            </div>

            <div>
                {dummy_data.map((item) => (
                    <div className="card-container" key={item.id}>
                        <div className="image-cont p-5">
                            <img src={item.img} alt="book-sample" />
                        </div>
                        <div className="text-details">
                            <h3 className="text-bold">{item.title}</h3>
                            <p className="text">{item.details}</p>
                        </div>
                    </div>
                ))}
                
            </div>
        </div>
    );
}

export default Login;
