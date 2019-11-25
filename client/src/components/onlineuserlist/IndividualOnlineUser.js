import React, { useEffect, useState } from 'react';
import DefaultPic from 'img/DefaultPic.jpg';

const IndividualOnlineUser = ({ username, profilePicUrl }) => {
  const [pictureLink, setPictureLink] = useState(DefaultPic);

  useEffect(() => {
    if (profilePicUrl !== 'undefined') {
      setPictureLink(profilePicUrl);
    }
  }, [profilePicUrl]);
  return (
    <div className='individualonlineuser'>
      <div className='flip-card'>
        <div className='flip-card-inner'>
          <div className='flip-card-front'>
            <img
              alt={`${username}'s profile`}
              className='individualonlineuser-image'
              src={pictureLink}
            />
          </div>
          <div className='flip-card-back'>
            <h1 className='individualonlineuser-username'>{username}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualOnlineUser;
