import React, { useEffect, useState } from 'react';
import axios from "axios";

import { somethingError } from '../../Header';

const BookMarks = () => {
    // const [bookName, setbookName] = useState('');
    // const [bookCover, setbookCover] = useState('');
    const [bookDetails, setBookDetails] = useState([]);


    useEffect(() => {
        const fecthBookMarks = async () => {
            try {
                const res = await axios.get('http://localhost:3001/api/bookMarks', {
                    withCredentials: true
                });
                setBookDetails(res.data);
            } catch (error) {
                somethingError('Unable to show bookmarks')
            }
        };

        fecthBookMarks();
    }, []);

    return (
        <div>
            {bookDetails.map((book) => (
                <div key={book.bookMark_ID} className='border-b-2 '>
                    <p>{book.book_name}</p>
                </div>
            ))}
        </div>
    );
}

export default BookMarks;