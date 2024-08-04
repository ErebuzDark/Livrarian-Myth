import React, { useEffect, useState } from 'react';
import axios from "axios";
import Cookies from 'js-cookie';

import { somethingError, somethingNeutral } from '../../Header';

const BookMarks = () => {
    const [bookDetails, setBookDetails] = useState([]);
    const [bookID, setBookID] = useState('');
    const [userID, setUserID] = useState(Cookies.get('userID'));
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        const fetchBookMarks = async () => {
            try {
                const res = await axios.get('http://localhost:3001/api/bookMarks', {
                    withCredentials: true
                });
                setBookDetails(res.data);
            } catch (error) {
                // somethingError('No Bookmarks');
            }
        };

        fetchBookMarks();
    }, []);

    const handleRemoveBookMark = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/api/removeBookMark', {
                bookID: bookID,
                userID: userID
            });
            somethingNeutral('Removed from bookmarks');
            // Update the book details after removing a bookmark
            setBookDetails((prevBookDetails) => prevBookDetails.filter(book => book.book_ID !== bookID));
        } catch (error) {
            somethingError('Error removing from bookmarks');
        }
    }

    return (
        <>  
            {bookDetails.length > 0 ? (
                <div>
                    {bookDetails.map((book, index) => (
                        <div key={book.bookMark_ID} className='flex w-full justify-between align-text-top text-center rounded-lg hover:bg-slate-300 transition 0.3s'>
                            <div className='flex w-full'>
                                <p className='pl-2 p-1 leading-10'>{index + 1}. {book.book_name}</p>
                            </div>

                            <form onSubmit={handleRemoveBookMark} className='flex p-2 hover:bg-slate-400 rounded-lg items-center'>
                                <button type='submit' onClick={() => setBookID(book.book_ID)}>
                                    <i className="bi bi-trash-fill text-danger p-0"></i>
                                </button>
                            </form>
                        </div>
                    ))}
                </div>
                ) : (
                    <div>
                        <p>No Bookmarks</p>
                    </div>
                )
            }
            
        </>

        
    );
}

export default BookMarks;