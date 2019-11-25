import React from 'react';
import { Link } from 'react-router-dom';

import './IndividualImage.scss';

const IndividualImage = ({ match }) => {
  const { id } = match.params;

  return (
    <div className='individualimage-container'>
      <Link to={`/chat`}>
        <img
          alt='individual close up of message content'
          src={`/messageimage/${id}`}
          className='individualimage-pic'
        />
      </Link>
    </div>
  );
};

export default IndividualImage;
