import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import axios from "axios";
import '../../styles/profile.css';
import '../../styles/inputCode.css';
import { useNavigate } from "react-router-dom";
import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import ReactCodeInput  from 'react-code-input';
import VerificationInput from "react-verification-input";

import { somethingError, somethingNeutral, somethingSuccess } from '../Header';
import BookMarks from "./dependencies/BookMarks";

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({username: '', email: '', profile_img: ''});
  const [fileName, setFileName] = useState('');
  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [profilePic, setProfilePIc] = useState('');
  const [preview, setPreview] = useState('');

  // for changing password
  const [openModalPass, setOpenModalPass] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [email, setEmail] = useState('varongentica05@gmail.com');
  const [verificationCode, setVerificationCode] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  const sendVerificationCode = async () => {
    setCodeSent(true);
    try {
      const response = await axios.post('http://localhost:3001/send-verification-code', { to: userEmail });
      setGeneratedCode(response.data.code);
      setCodeSent(true);
    } catch (error) {
      console.error('Error sending verification code:', error);
    }
  };

  const handlePinChange = (value) => {
    setPinCode(value);
    console.log(value)
  };

  const handleChangePassword = async () => {
    try {
      const response = await axios.post('http://localhost:3001/change-password', {
        email: userEmail,
        currentPassword: currentPass,
        newPassword: newPassword,
        verificationCode: pinCode,
        sentCode: generatedCode,
      });

      if (response.data.message === 'Password changed successfully') {
        somethingSuccess('Password changed')
        setOpenModalPass(false);
      } 
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 401) {
          somethingError('Invalid Verification Code');
        } else if (status === 404) {
          somethingError('User Not found');
        } else if (status === 403) {
          somethingError('Current password is incorrect');
        } else if (status === 500) {
          somethingError('Server error, please try again later');
        }
      } else {
        somethingError('Network error, please try again later');
      }
    }
  };

  function onCloseModal() {
    setOpenModalPass(false);
    currentPass('');
  }

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
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      margin: '20px',
    },
    input: {
      width: '50px',
      height: '50px',
      textAlign: 'center',
      fontSize: '18px',
      borderRadius: '50px',
      border: '1px solid #ccc',
      margin: '5px',
    },
  };

  return (
    <>
    <div className="flex justify-center">
      <div className="profile flex flex-col bg-white mt-0 p-2 justify-center items-center w-screen sm:w-3/4 md:w-3/4 shadow-sm">
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
              <div className="w-full px-5 sm:w-auto">
                <a className="text-right text-blue-400 hover:text-blue-500 cursor-pointer" onClick={() => setOpenModalPass(true)}>Change password</a>
              </div>
            </div>
            
            <button type="submit" className="bg-slate-800 text-white p-2 m-4 rounded hover:bg-slate-500">Save Changes</button>
          </form>
          
        </div>

        <div className="border rounded-sm max-[500px]:w-full w-2/3">
            <div className="p-2 w-full">
              <h2>Bookmarks</h2>
                <BookMarks />
            </div>
        </div>
      </div>
    </div>
    <Modal show={openModalPass} size="lg" onClose={onCloseModal} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="space-y-1">
          <h3 className="text-xl text-center font-medium text-gray-900 dark:text-white">Change Password</h3>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="currentPass" value="Current Password" />
            </div>
            <TextInput
              id="currentPass"
              type="password"
              placeholder=""
              value={currentPass}
              onChange={(event) => setCurrentPass(event.target.value)}
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="newPassword" value="New Password" />
            </div>
            <TextInput
              id="newPassword"
              type="password"
              placeholder=""
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
            />
          </div>
          <div>
            {codeSent === true || currentPass === '' || newPassword === '' ? (
              null
            ) : (
              <Button onClick={sendVerificationCode}>Send Verification Code</Button>
            )
            
            }
            {codeSent && (
              <div>
                <div className="mb-2 block">
                  <p className="text-xs text-gray-400">*Code was sent to your email {userEmail}</p>
                </div>
                {/* <TextInput
                  id="verificationCode"
                  type="text"
                  placeholder="Enter the verification code"
                  value={verificationCode}
                  onChange={(event) => setVerificationCode(event.target.value)}
                  required
                /> */}
                <VerificationInput 
                  placeholder=""
                  value={pinCode}
                  onChange={handlePinChange}
                  classNames={{
                    character: "character",
                  }}
                />
              </div>
            )}
          </div>
          {pinCode !== '' &&
            <div className="w-full md:w-52">
              <Button onClick={handleChangePassword}>Change Password</Button>
            </div>
          }
          
        </div>
      </Modal.Body>
    </Modal>
      

      {/* <Modal show={openModalPass} size="lg" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Change Password</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="currentPass" value="Current Password" />
              </div>
              <TextInput
                id="currentPass"
                placeholder=""
                value={currentPass}
                onChange={(event) => setCurrentPass(event.target.value)}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="newPassword" value="New Password" />
              </div>
              <TextInput id="newPassword" type="password" required />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="emailVal" value="Verification Code" />
                <span><p>code was sent to your email</p></span>
              </div>
              <TextInput id="emailVal" type="text" required />
            </div>
            
            <div className="w-full">
              <Button>Change Password</Button>
            </div>
            
          </div>
        </Modal.Body>
      </Modal> */}
    </>
  )
}

export default Profile;