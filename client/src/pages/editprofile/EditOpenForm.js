import React, { useState } from 'react';
import Axios from 'axios';
import EditProfileFormButton from 'pages/editprofile/EditProfileFormButton';

const EditOpenForm = ({ type, close, setUserInfo }) => {
  const [value, setValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  const handleChange = e => {
    if (e.target.type === 'text') {
      setValue(e.target.value);
    } else {
      setPasswordValue(e.target.value);
    }
  };

  const handleSubmit = async () => {
    const updatedUserInfo = await Axios.post(
      `/editprofile/${type}`,
      { value: value, password: passwordValue },
      { headers: { 'x-auth-token': localStorage.getItem('token') } }
    );
    if (updatedUserInfo) {
      setUserInfo(updatedUserInfo.data);
      close(type);
    }
  };

  let placeholderText;
  switch (type) {
    case 'username':
      placeholderText = 'new name';
      break;
    case 'email':
      placeholderText = 'new email';
      break;
    case 'profilepic':
      placeholderText = 'url';
      break;
    default:
      break;
  }
  return (
    <div className={`editopenform `}>
      <input
        type='text'
        placeholder={placeholderText}
        onChange={handleChange}
      />
      <input type='password' placeholder='password' onChange={handleChange} />
      <div onClick={() => close(type)}>
        <EditProfileFormButton buttonText='cancel' />
      </div>
      <div onClick={handleSubmit}>
        <EditProfileFormButton buttonText='submit' />
      </div>
    </div>
  );
};

export default EditOpenForm;
