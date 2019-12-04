import React, { useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';

import { CTX } from 'context/Store';

import Axios from 'axios';

import './Register.scss';

const Register = () => {
  const [appState, updateState] = useContext(CTX);
  const [emailValue, setEmailValue] = useState('');
  const [usernameValue, setUsernameValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
  const [successfulRegister, setSuccessfulRegister] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    updateState({
      type: 'CHANGE_TOPIC',
      payload: { currentTopic: 'register' }
    });

    return () => {
      updateState({ type: 'CHANGE_TOPIC', payload: { currentTopic: '' } });
    };
  }, [updateState]);

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage('');
    }, 5000);
  }, [errorMessage]);

  const handleChange = e => {
    const { value } = e.target;
    switch (e.target.name) {
      case 'email':
        setEmailValue(value);
        break;
      case 'username':
        setUsernameValue(value);
        break;
      case 'password':
        setPasswordValue(value);
        break;
      case 'confirmpassword':
        setConfirmPasswordValue(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async () => {
    Axios.post('/register', {
      email: emailValue,
      username: usernameValue,
      password: passwordValue,
      confirmPassword: confirmPasswordValue
    })
      .then(registeredUser => {
        if (!registeredUser.data.err) {
          setSuccessfulRegister(true);
        } else {
          setErrorMessage(registeredUser.data.err);
        }
      })
      .catch(err => {
        console.log('register user error: ', err);
      });
  };

  const handleKeyDown = e => {
    if (e.keyCode === 13) {
      handleSubmit();
    }
  };

  return (
    <div className='register-container'>
      {successfulRegister && <Redirect to='/login' />}
      <div className='register-input-container'>
        <div className='register-input-item'>
          <input
            type='email'
            className='register-input register-emailinput'
            value={emailValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder=' email'
            name='email'
          />
        </div>
        <div className='register-input-item'>
          <input
            type='text'
            className='register-input register-usernameinput'
            value={usernameValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder=' username'
            name='username'
          />
        </div>

        <div className='register-input-item'>
          <input
            type='password'
            className={`register-input register-passwordinput ${passwordValue !==
              confirmPasswordValue && 'register-passwordsnotmatch'}`}
            value={passwordValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder=' password'
            name='password'
          />
        </div>
        <div className='register-input-item'>
          <input
            type='password'
            className={`register-input register-confirmpasswordinput ${passwordValue !==
              confirmPasswordValue && 'register-passwordsnotmatch'}`}
            value={confirmPasswordValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder=' confirm password'
            name='confirmpassword'
          />
        </div>

        <div className='register-submitbutton' onClick={handleSubmit}>
          submit
        </div>
        {errorMessage && (
          <h5 className='register-errormessage'>{errorMessage}</h5>
        )}
      </div>
    </div>
  );
};

export default Register;
