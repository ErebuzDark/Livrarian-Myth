import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Admin = () => {
  const navigate = useNavigate();
  const [bookName, setBookName] = useState('');
  const [bookDesc, setBookDesc] = useState('');
  const [bookClass, setBookClass] = useState('');
  const [bookUniqueID, setBookUniqueID] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookCover, setBookCover] = useState(null);
  const [preview, setPreview] = useState('');
  const [isLimit, setIsLimit] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const username = Cookies.get('username');

      if (username === 'Erebus') {
          navigate('/addbook');
      }
      else {
        navigate('/home');
        alert('You are not Authorized to this Page!');
      }
    };

    checkAuth();
  }, [navigate]);

  useEffect (() => {
    if (bookDesc.length >= 1000) {
      setIsLimit(true);
    } else {
      setIsLimit(false);
    }
  }, [bookDesc]);
  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setBookCover(file);

    // Preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setPreview('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('bookName', bookName);
    formData.append('bookDesc', bookDesc);
    formData.append('bookAuthor', bookAuthor);
    formData.append('bookClass', bookClass);
    formData.append('bookUniqueID', bookUniqueID);
    formData.append('bookCover', bookCover);

    try {
      await axios.post('http://localhost:3001/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Book uploaded successfully!');
      setBookName('');
      setBookDesc('');
      setBookAuthor('');
      setBookClass('');
      setBookCover(null);
      setBookUniqueID('');
      setPreview('');
    } catch (error) {
      console.error('Error uploading book:', error);
      alert('Failed to upload book.');
    }
  };

  return (
    <div className="flex justify-center align-middle min-[500px]:p-4">
      <form className="flex flex-col shadow-md p-4 max-[500px]:p-0 max-[500px]:w-full" onSubmit={handleSubmit}>
        <h2>Add Book</h2>
        <div className='flex flex-col gap-4 min-[600px]:flex-row'>
            <div className="flex flex-col w-auto items-center justify-center align-middle">
              <input className='bg-slate-100 border m-2 p-2 w-56' name="bookName" required placeholder="Book name..." value={bookName} onChange={(e) => setBookName(e.target.value)} />
              <input className='bg-slate-100 border m-2 p-2 w-56' name="bookAuthor" required placeholder="Book Author" value={bookAuthor} onChange={(e) => setBookAuthor(e.target.value)} />
              <textarea name="bookDesc" className="bg-slate-100 w-52 p-2 h-50 border max-h-96" required placeholder="Book description..." value={bookDesc} maxLength={1000} onChange={(e) => setBookDesc(e.target.value)}></textarea>
              {isLimit && <p className='text-red-500'>max limit reached</p>}
              <input className='bg-slate-100 border m-2 p-2 w-56' name="bookClass" required placeholder="Book classification..." value={bookClass} onChange={(e) => setBookClass(e.target.value)} />
              <input className='bg-slate-100 border m-2 p-2 w-56' name="bookUniqueID" required placeholder="Book unique ID..." value={bookUniqueID} onChange={(e) => setBookUniqueID(e.target.value)} />
            </div>

            <div className="flex flex-col justify-center align-middle items-center">
              <div className="w-40 h-56 bg-slate-100 flex items-center justify-center border">
                  {preview ? (
                  <img src={preview} alt="Book Cover" className="object-fit w-full h-full" />
                  ) : (
                  <p className='text-center'>Choose a Book Cover</p>
                  )}
              </div>
              <input type="file" name="bookCover" id='preview' required className="hidden" onChange={handleImageChange} />
              <label htmlFor="preview" className="cursor-pointer text-xs bg-slate-800 hover:bg-slate-500 text-white font-bold m-1 py-2 px-4 rounded">Upload Cover</label>
            </div>
        </div>
        
        
        <button type="submit" className="bg-blue-500 text-white p-2 m-4 rounded">Upload Book</button>
      </form>
    </div>
  );
};

export default Admin;
