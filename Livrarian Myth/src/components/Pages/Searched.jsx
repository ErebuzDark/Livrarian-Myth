import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

import { somethingSuccess, somethingNeutral, somethingError } from '../Header';

import { Button, Modal } from "flowbite-react";

const Searched = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [selectedBook, setSelectedBook] = useState(null);

  //bookmarking
  const [bookID, setBookID] = useState('');
  const [bookName, setBookName] = useState('');
  const [username, setUsername] = useState('');
  const [userID, setUserID] = useState('');
  const [isMarked, setISMarked] = useState(false);
  const [check, setCheck] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('book');
    const bookName = searchParams.get('selectedBook');
    const bookID = searchParams.get('bookID');
    setSearch(query);

    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3001/api/search`, {
          params: { query }
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchBookDetails = async (bookName) => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3001/api/bookDetails`, {
          params: { bookName }
        });
        setSelectedBook(response.data);
      } catch (error) {
        console.error('Error fetching book details:', error);
      } finally {
        setLoading(false);
      }
    };


    const checkIfBooked = async (bookID) => {
      try {
        const response = await axios.get('http://localhost:3001/api/bookings', {
          params: { bookID },
          withCredentials: true // Ensure cookies are sent with the request
        });

        if (response.data) {
          setCheck(response.data);
          setISMarked(true);
        } else {
          console.error('No data returned');
        }
      } catch (error) {
        if (error.response) {
          console.error('Error checking booking:', error.response.data);
          setISMarked(false);
        } else if (error.request) {
          console.error('Request error:', error.request);
          setISMarked(false);
        } else {
          console.error('Error:', error.message);
          setISMarked(false);
        }
      }
    };



    if (query) {
      fetchSearchResults();
    }

    if (bookName) {
      fetchBookDetails(bookName);
      checkIfBooked(bookID);
      setOpenModal(true);
    }
  }, [location.search]);

  useEffect(() => {
    if (selectedBook) {
      setBookID(selectedBook.bookID);
      setBookName(selectedBook.book_name);
    }
    setUserID(Cookies.get('userID') || '');
    setUsername(Cookies.get('username') || '');
  }, [selectedBook]);

  const handleBookClick = (bookName, bookID) => {
    navigate(`${location.pathname}?book=${new URLSearchParams(location.search).get('book')}&selectedBook=${bookName}&bookID=${bookID}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-1 w-screen spinner-border justify-center items-center" role="status">
        <p className="visually-hidden justify-center align-middle">Loading...</p>
      </div>
    )
  }

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  const handleBookMark = async (e) => {
    e.preventDefault();
    console.log(bookID, bookName)
    try {
      const response = await axios.post('http://localhost:3001/api/bookMark', {
        bookID: bookID,
        bookName: bookName,
        userID: userID,
        username: username
      });
      somethingSuccess('Added to Bookmarks!')
      setISMarked(true);
    } catch (error) {
      somethingError('Error adding in to bookmarks')
    }
  }

  const handleRemoveBookMark = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/removeBookMark', {
        bookID: bookID,
        userID: userID
      });
      somethingNeutral('Removed from bookmarks')
      setISMarked(false);
    } catch (error) {
      somethingError('Error removing in bookmarks')
    }
  }

  return (
    <div>
      <h3 className='flex w-screen align-middle justify-center pb-5'>Search results for "{search}"</h3>
        {searchResults.length > 0 ? (
          <div className='flex flex-wrap h-auto justify-center gap-2 align-middle'>
            {searchResults.map(book => (
                <div onClick={() => handleBookClick(book.book_name, book.bookID)} key={book.bookID} className='bg-white p-3 rounded shadow-md hover:scale-105 ease-in duration-200 hover:font-semibold max-[420px]:w-44'>
                  <p className='text-center p-2 mb-3'>{truncateText(book.book_name, 15)}</p>
                  <div>
                    <img className='w-44 h-56' src={`/uploads/${book.book_cover}`} alt="cover" />
                  </div>
                </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col min-h-40 w-screen gap-1 justify-center items-center">
              <p><i className="bi bi-book fs-1"></i></p>
              <p className="text-slate-300 text-5xl">No books found</p>
          </div>
      
        )}
      <Modal show={openModal} onClose={() => navigate(`${location.pathname}?book=${new URLSearchParams(location.search).get('book')}`, setOpenModal(false))}>
        <Modal.Header className='p-8'>{selectedBook?.book_name || "Book Details"}</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            {selectedBook ? (
              <>
                <div className='flex w-full justify-center max-[500px]:flex-col max-[500px]:items-center '>
                  <img className="w-44 max-h-56 rounded-xl" src={`/uploads/${selectedBook.book_cover}`} alt="cover" />
                  <p className="text-gray-500 text-pretty dark:text-gray-400 px-3">
                    {selectedBook.book_desc}
                  </p>
                </div>
                <div> {!isMarked &&
                  <form onSubmit={handleBookMark}>
                    
                   
                      <div>
                        <input type="hidden" name="bookID" value={selectedBook.bookID}/>
                        <input type="hidden" name="bookName" value={selectedBook.book_name}/>

                        <input type="hidden" name="userID" value={Cookies.get('userID')}/>
                        <input type="hidden" name="username" value={Cookies.get('username')}/>
                      <button
                        type="submit"
                        className="btn"
                      > <i class="bi bi-bookmark"></i></button>
                      </div>
                    
                    
                  </form>
                  }
                  {isMarked &&
                    <form onSubmit={handleRemoveBookMark}>
                      <button type="submit"><i class="bi bi-bookmark-check"></i>BookMarked</button>
                    </form>
                  }
                  
                </div>
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  Author: {selectedBook.bookAuthor}
                </p>
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  Classification: {selectedBook.book_class}
                </p>
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  Published: {selectedBook.book_date_uploaded}
                </p>
               
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => navigate(`${location.pathname}?book=${new URLSearchParams(location.search).get('book')}`, setOpenModal(false))}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Searched;
