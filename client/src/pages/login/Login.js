import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { CTX } from 'context/Store';

import Axios from 'axios';
import './Login.scss';

const Login = () => {
  const [appState, updateState] = React.useContext(CTX);

  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    updateState({ type: 'CHANGE_TOPIC', payload: { currentTopic: 'login' } });

    return () => {
      updateState({ type: 'CHANGE_TOPIC', payload: { currentTopic: '' } });
    };
  }, [updateState]);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    }
  }, [errorMessage]);

  const handleChange = e => {
    e.target.name === 'email'
      ? setEmailValue(e.target.value)
      : setPasswordValue(e.target.value);
  };

  const handleSubmit = async () => {
    const authInfo = await Axios.post('/login', {
      email: emailValue,
      password: passwordValue
    });
    if (!authInfo.data.err) {
      const { token, username, userId, profilePicUrl } = authInfo.data.data;
      updateState({ type: 'LOGIN', payload: authInfo.data.data });
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      localStorage.setItem('userId', userId);
      localStorage.setItem('profilePicUrl', profilePicUrl);
    } else {
      setErrorMessage(authInfo.data.err);
    }
  };

  const handleKeyDown = e => {
    if (e.keyCode === 13) {
      handleSubmit();
    }
  };

  return (
    <div className='login-container'>
      {appState.isLoggedIn && <Redirect to='/chat' />}
      <div className='login-input-container'>
        <input
          type='email'
          className='login-input login-usernameinput'
          value={emailValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          name='email'
          placeholder=' email'
        />
        <input
          type='password'
          className='login-input login-passwordinput'
          value={passwordValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          name='password'
          placeholder=' password'
        />
        <div className='login-submitbutton' onClick={handleSubmit}>
          submit
        </div>
        <p
          style={{
            color: '#eee',
            fontSize: '1rem',
            marginTop: '.8rem',
            marginLeft: '50%',
            transform: 'translateX(-50%)',
            lineHeight: '1.2rem',
            textAlign: 'center',
            minWidth: '22.4rem'
          }}
        >
          for testing: <br />
          email: address@gmail.com, password: password
        </p>
        {errorMessage && <h5 style={{ color: 'red' }}>{errorMessage}</h5>}
      </div>
    </div>
  );
};

export default Login;
