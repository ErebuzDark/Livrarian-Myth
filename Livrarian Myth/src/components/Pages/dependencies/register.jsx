import React, { useState } from 'react';
import axios from 'axios';
import '../../../styles/register.css';

const Register = ( {setIsRegister, setIsLoginModalOpen, successLogin, errorLogin} ) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);

  const handleShowPass = () => {
    setShow(!show);
  }

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/api/register', {
        username: username,
        email: email,
        password: password
      });
      successLogin("Successfully Registered");
      setIsRegister(false);
      setIsLoginModalOpen(true);
    } catch (error) {
      console.error('Error during registration:', error);
      // alert('Registration failed: ' + (error.response ? error.response.data : error.message));
      errorLogin(error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="wrapper fadeInDown">
      <div id="formContent">
        <div className="text-end p-3 transition duration-300">
            <i className="bi bi-x-lg hover:text-blue-500" onClick={() => setIsRegister(false)}></i>
        </div>
        <div>
          <h3>Register</h3>
        </div>
        <form className="p-1 pb-5" onSubmit={handleRegister}>
          <input
            type="text"
            id="register"
            className="fadeIn second"
            name="username"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="email"
            id="register"
            className="fadeIn second"
            name="email"
            placeholder="E-mail"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <input
            type= {show ? "text" : "password"}
            id="password"
            className="fadeIn third"
            name="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="show-pass fadeIn fourth " onClick={handleShowPass}>
              <p className="fs-6 text-body-tertiary">Show password</p><i className={`text-body-tertiary bi ${show ? 'bi-eye' : 'bi-eye-slash'}`}></i>
          </div>
          {/* <button className='btn' type='button' onClick={handleShowPass}>show password</button> */}
          <input type="submit" className="fadeIn fourth bg-slate-950 hover:bg-slate-900" value="Register" />
        </form>
      </div>
    </div>
  );
};

export default Register;
