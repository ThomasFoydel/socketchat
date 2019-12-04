import React, { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import { useSpring, animated, config } from 'react-spring';

import { CTX } from 'context/Store';
import './UserProfile.scss';

const UserProfile = ({ match }) => {
  const [appState, updateState] = useContext(CTX);
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    let isSubscribed = true;
    const fetchUserInfo = async () => {
      const foundUser = await Axios.get(`/userinfo/${match.params.id}`);
      if (isSubscribed) {
        setUserInfo(foundUser.data);
      }
    };
    fetchUserInfo();
    return () => {
      isSubscribed = false;
    };
  }, [match.params.id]);

  useEffect(() => {
    if (userInfo.username) {
      updateState({
        type: 'CHANGE_TOPIC',
        payload: { currentTopic: userInfo.username }
      });
    }
  }, [userInfo, updateState]);

  const profilePicAnimationProps = useSpring({
    opacity: 1,
    marginRight: 0,
    from: { opacity: 0, marginRight: -500 },
    config: config.wobbly
  });

  const animationProps = useSpring({
    opacity: 1,
    marginLeft: 0,
    from: { opacity: 0, marginLeft: -500 },
    config: config.wobbly
  });

  return (
    <div className='userprofile-container'>
      {userInfo && (
        <>
          <animated.div style={profilePicAnimationProps}>
            <img
              alt={`${userInfo.username}'s profile`}
              className='userprofile-profilepic'
              src={
                userInfo.profilePicUrl
                  ? userInfo.profilePicUrl
                  : 'https://icon-library.net/images/default-profile-icon/default-profile-icon-24.jpg'
              }
            />
          </animated.div>
          <animated.div style={animationProps}>
            <h1 className='userprofile-username'>{userInfo.username}</h1>
          </animated.div>
          <animated.div style={animationProps}>
            <h1 className='userprofile-email'>{userInfo.email}</h1>
          </animated.div>
          {appState.userId === match.params.id ? (
            <animated.div style={profilePicAnimationProps}>
              <Link className='userprofile-editlink' to={`/editprofile`}>
                edit
              </Link>
            </animated.div>
          ) : (
            <animated.div style={animationProps}>
              <Link
                to={`/privateconvo/${match.params.id}`}
                className='userprofile-privateconvolink'
              >
                private message
              </Link>
            </animated.div>
          )}
        </>
      )}
    </div>
  );
};

export default UserProfile;
