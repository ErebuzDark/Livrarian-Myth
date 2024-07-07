import React, { useEffect }from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import '../../styles/home.css';
import List from './dependencies/BookList';
import Cookies from 'js-cookie';

import bg from '../../assets/bg-home.png';



const Home = () => {
    
    return (
        <div className="home-container">
            <div className="flex justify-center">
                <img src={bg} alt="cover" className="w-90% cover"/>
            </div>
            <h4 className="title-highlights pt-24 text-3xl">Popular Books</h4>
            <div className="main-content min-h-screen">
                <List />
            </div>
        </div>
    )
}

export default Home;