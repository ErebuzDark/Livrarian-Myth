import React, { useEffect, useState } from "react";
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

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
  
    const resultsPerPage = 10; // Set the number of results per page
  
    const searchBooks = async (page = 1) => {
      try {
        const query = `q=${title}${author ? `+author:${author}` : ''}&page=${page}&limit=${resultsPerPage}`;
        const response = await axios.get(`https://openlibrary.org/search.json?${query}`);
        setBooks(response.data.docs);
        setTotalPages(Math.ceil(response.data.num_found / resultsPerPage));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    const handlePageChange = (newPage) => {
      setCurrentPage(newPage);
      searchBooks(newPage);
    };

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

            <div className="flex flex-col items-center">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Search for book title"
        className="border border-gray-300 rounded-md p-2 m-2 w-80"
      />
      <input
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Search for author"
        className="border border-gray-300 rounded-md p-2 m-2 w-80"
      />
      <button
        onClick={() => searchBooks(1)}
        className="bg-blue-500 text-white p-2 rounded-md m-2"
      >
        Search
      </button>
      <ul className="list-disc">
        {books.map((book) => (
          <li key={book.key} className="my-4 flex items-center">
            <img
              src={`http://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg`}
              alt={`${book.title} cover`}
              className="w-20 h-30 mr-4"
            />
            <div>
              <h2 className="text-xl font-bold">{book.title}</h2>
              <p>{book.author_name ? `by ${book.author_name.join(', ')}` : 'Unknown Author'}</p>
              {book.first_publish_year && <p>First published in {book.first_publish_year}</p>}
            </div>
          </li>
        ))}
      </ul>
      <div className="flex justify-between items-center w-80 mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-md ${currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-md ${currentPage === totalPages ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
        >
          Next
        </button>
      </div>
    </div>
        </div>
    );
}

export default Login;
