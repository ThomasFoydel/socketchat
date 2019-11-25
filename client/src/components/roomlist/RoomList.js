import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import RoomListLink from 'components/roomlist/RoomListLink';
import ChatIcon from 'img/chaticon.png';
import OnlineUserList from 'components/onlineuserlist/OnlineUserList';

import { CTX } from 'context/Store';

import './RoomList.scss';

const RoomList = () => {
  const [appState, updateState] = useContext(CTX);

  const logout = () => {
    updateState({ type: 'LOGOUT', payload: {} });
    localStorage.clear();
  };

  const { currentTopic } = appState;

  return (
    <div className='roomlist-container'>
      <div className='roomlist-title'>
        <img src={ChatIcon} alt='chat logo' className='roomlist-chatlogo' />
        CHAT
      </div>
      <ul className='roomlist-linklist'>
        {appState.isLoggedIn ? (
          <>
            <Link to='/chat'>
              <RoomListLink
                isCurrentRoom={currentTopic === 'main'}
                linkName='main'
              />
            </Link>
            <Link to='/chat'>
              <RoomListLink
                isCurrentRoom={currentTopic === 'topic2'}
                linkName='topic2'
              />
            </Link>
            <Link to='/chat'>
              <RoomListLink
                isCurrentRoom={currentTopic === 'cow'}
                linkName='cow'
              />
            </Link>

            <Link to='/editprofile'>
              <RoomListLink
                linkName='edit profile'
                isCurrentRoom={currentTopic === 'edit profile'}
              />
            </Link>
            <Link to='/login' onClick={logout}>
              <RoomListLink linkName='logout' />
            </Link>
            {appState.onlineUserList && <OnlineUserList />}
          </>
        ) : (
          <>
            <Link to='/login'>
              <RoomListLink
                linkName='login'
                isCurrentRoom={currentTopic === 'login'}
              />
            </Link>

            <Link to='/register'>
              <RoomListLink
                linkName='register'
                isCurrentRoom={currentTopic === 'register'}
              />
            </Link>
          </>
        )}
      </ul>
    </div>
  );
};

export default RoomList;
