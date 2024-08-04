import React, { useState, useEffect } from 'react';
import axios from 'axios';

import '../../../styles/booklist.css';
import cover from '../../../assets/bookCover.jpeg';

const BookList = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      axios.get('http://localhost:3001/api/data')
      .then(response => {
          setData(response.data);
          setLoading(false);
      })
      .catch(error => {
          console.error('There was an error fetching the data!', error);
      });
  }, []);

  if (loading) {
      return (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
    )
  }

  return (
    <>
    <div className="list-container">
      {data.map((item) => (
        <div className="card" key={item.bookID}>
          <h3 className='book-name'>{item.book_name}</h3>
          <img className='book-cover rounded-md' src={`/uploads/${item.book_cover}`} alt="Book Cover" />
        </div>
      ))}
    </div>
  </>
  );
};


export default BookList;