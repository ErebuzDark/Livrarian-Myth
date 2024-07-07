import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import axios from "axios";
import '../../styles/profile.css';
import { useNavigate } from "react-router-dom";

import { somethingError, somethingNeutral } from '../Header';
import BookMarks from "./dependencies/BookMarks";

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({username: '', email: '', profile_img: ''});
  const [fileName, setFileName] = useState('');
  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [profilePic, setProfilePIc] = useState('');
  const [preview, setPreview] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfilePIc(file);

    // Preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };

    if (file) {
      setFileName(file.name);
    } else {
      setFileName('No file chosen');
    }

    if (file) {
      reader.readAsDataURL(file);
    } else {
      setPreview('');
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/account', {
            withCredentials: true
        });
        setUserDetails(response.data);
      } catch (error) {
        setUserDetails({ userID: '', username: '', email: '' });
      }
    };

    fetchUserDetails();
  }, []);


  useEffect(() => {
    const assignData = () => {
      setUsername(userDetails.username);
      setUserEmail(userDetails.email);
      setPreview(userDetails.profile_img);
      setProfilePIc(userDetails.profile_img);
    }
    assignData();
  }, [userDetails]);
  console.log(profilePic);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('username', username);
    formData.append('email', userEmail);
    formData.append('currentPic', userDetails.profile_img);
    formData.append('profilePic', profilePic);

    try {
      await axios.post('http://localhost:3001/api/upload/profile', formData, {
        withCredentials: true, 
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      somethingNeutral('Profile Successfully updated!')
    } catch (error) {
      somethingError('Error updating profile:');
      console.error('Error updating profile:', error);
    }

  }

  return (
    <div className="flex justify-center">
      <div className="profile flex flex-col bg-white mt-0 p-2 justify-center w-screen sm:w-3/4 md:w-3/4 shadow-sm">
        <div className="flex flex-col justify-center items-center">
          <form className="flex flex-col items-center" onSubmit={handleSubmit}>
            <div className="flex flex-col justify-center items-center">
            {preview ? (
              <img src={`/uploads/profiles/${preview}`} className="rounded-full object-fit m-2 w-32 h-32 shadow sm:w-32 sm:h-32 md:w-44 md:h-44" />
              ) : (
              <img className="rounded-full m-2 bg-slate-500 shadow w-32 h-32 md:w-44 md:h-44 sm:w-32 sm:h-32" src="" alt="" />
            )}
              <input
                type="file"
                name="profile"
                id="profileInput"
                className="hidden"
                onChange={handleImageChange}
              />
              <label htmlFor="profileInput" className="cursor-pointer text-xs bg-slate-800 hover:bg-slate-500 text-white font-bold p-2 w-auto h-auto text-center rounded
              relative -top-36 -right-10
              md:-top-48 md:-right-14
              ">
                <i className="bi bi-pencil-square text-white"></i>
              </label>
            </div>
            
            <p className="text-gray-700 text-xs">{fileName}</p>

            <div className="flex flex-col justify-center align-middle items-center w-screen">
              
              <div className="w-4/5 flex flex-col justify-center items-center">
                <input
                  className="input-field text-black cursor-pointer text-lg bg-white rounded px-2 border border-gray-300 focus:border-4 duration-75
                  w-full
                  sm:w-4/5
                  md:w-3/5
                  max-w-xl
                  "
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <p className="text-slate-500 text-sm p-2">Username</p>
              </div>
             
              <div className="w-4/5 flex flex-col justify-center items-center">
              <input
                  className="input-field text-black cursor-pointer text-lg bg-white rounded px-2 border border-gray-300 focus:border-4 duration-75
                  w-full
                  sm:w-4/5
                  md:w-3/5
                  max-w-xl
                  "
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
                <p className="text-slate-500 text-sm p-2">E-mail</p>
              </div>
              
            </div>
            <button type="submit" className="bg-slate-800 text-white p-2 m-4 rounded hover:bg-slate-500">Save Changes</button>
          </form>
        </div>

        <div className="border rounded-sm max-m:w-96 min-[500px]:w-96 min-[500px]:flex">
            <div className="p-2">
              <h2>Bookmarks</h2>
                <BookMarks />
            </div>
        </div>

      </div>
    </div>
    
  )
}

export default Profile;