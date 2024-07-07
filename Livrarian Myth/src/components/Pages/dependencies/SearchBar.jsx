import React, { useState, useEffect} from "react";
import '../../../styles/search.css';

import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
    const navigate = useNavigate();

    // states
    const [search, setSearch] = useState('');


    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };
    
        window.addEventListener('resize', handleResize);
        
        return () => {
        window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (search.trim() !== '') {
            navigate(`/searched?book=${search}`);
        }
    }, [search]);
    
    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim() !== '') {
            navigate(`/searched?book=${search}`);
        }
    };

 return (
    <div className='d-flex justify-content-end' onSubmit={handleSearch}>
        <form action="" className="search-bar">
            <input type="search" name="search" pattern=".*\S.*" required={width > 600} onChange={(e) => setSearch(e.target.value)}/>
            <button className="search-btn" type="submit">
            </button>
        </form>
    </div>
 )
}

export default SearchBar;