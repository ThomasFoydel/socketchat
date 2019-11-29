import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { CTX } from 'context/Store';

import './IndividualImage.scss';

const IndividualImage = ({ match }) => {
  const [appState] = useContext(CTX);
  const { id } = match.params;
  const { currentPrivateFriend } = appState;

  return (
    <div className='individualimage-container'>
      <Link
        to={
          currentPrivateFriend
            ? `/privateconvo/${currentPrivateFriend}`
            : `/chat`
        }
      >
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
