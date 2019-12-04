import React, { useState, useContext, useEffect, useRef } from 'react';
import Axios from 'axios';
import { Spring } from 'react-spring/renderprops';
import { useSpring, animated, config } from 'react-spring';

import EditOpenForm from 'pages/editprofile/EditOpenForm';

import { CTX } from 'context/Store';

import './EditProfile.scss';

const EditProfile = () => {
  const [appState, updateState] = useContext(CTX);

  const [userInfo, setUserInfo] = useState({});
  const [editProfilePicOpen, setEditProfilePicOpen] = useState(false);
  const [editUsernameOpen, setEditUsernameOpen] = useState(false);
  const [editEmailOpen, setEditEmailOpen] = useState(false);
  const [usernameHover, setUsernameHover] = useState(false);
  const [emailHover, setEmailHover] = useState(false);

  const [profilePicHover, setProfilePicHover] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesBeginningRef = useRef(null);

  useEffect(() => {
    let isSubscribed = true;
    const fetchProfilePic = async () => {
      const foundUser = await Axios.get(`/userinfo/${appState.userId}`);
      if (isSubscribed) {
        setUserInfo(foundUser.data);
      }
    };
    fetchProfilePic();
    return () => {
      isSubscribed = false;
    };
  }, [appState.userId]);

  const close = type => {
    switch (type) {
      case 'profilepic':
        setEditProfilePicOpen(false);
        break;
      case 'username':
        setEditUsernameOpen(false);
        break;
      case 'email':
        setEditEmailOpen(false);
        break;
      default:
        break;
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    if (messagesBeginningRef.current) {
      messagesBeginningRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleProfilePic = () => {
    if (editProfilePicOpen) {
      setEditProfilePicOpen(false);
      setTimeout(() => {
        scrollToTop();
      }, 10);
    } else {
      setEditProfilePicOpen(true);
      setTimeout(() => {
        scrollToBottom();
      }, 10);
    }
  };

  useEffect(() => {
    updateState({
      type: 'CHANGE_TOPIC',
      payload: { currentTopic: 'edit profile' }
    });
    setTimeout(() => {
      scrollToBottom();
    }, 300);
  }, [updateState]);

  const animation1Props = useSpring({
    opacity: 1,
    marginLeft: 0,
    background: usernameHover ? '#eee' : 'rgb(210, 210, 210)',
    transform: usernameHover ? 'translateY(-5px)' : 'translateY(0px)',
    boxShadow: usernameHover ? '1rem 1rem 1rem #222' : '0rem 0rem 0rem #222',
    from: { opacity: 0, marginLeft: -500 },
    config: config.wobbly
  });

  const animation2Props = useSpring({
    opacity: 1,
    marginLeft: 0,
    background: emailHover ? '#eee' : 'rgb(219, 219, 219)',
    transform: emailHover ? 'translateY(-5px)' : 'translateY(0px)',
    boxShadow: emailHover ? '1rem 1rem 1rem #222' : '0rem 0rem 0rem #222',

    from: { opacity: 0, marginLeft: -500 },
    config: config.wobbly
  });

  const animation3Props = useSpring({
    opacity: editProfilePicOpen ? 1 : 0,
    marginLeft: editProfilePicOpen ? 0 : -2000,

    display: editProfilePicOpen ? 'inherit' : 'none',
    from: {
      opacity: 0,
      marginLeft: -500
    },
    config: config.gentle
  });

  return (
    <>
      <div style={{ height: '1px' }} ref={messagesBeginningRef} />
      <Spring
        from={{ opacity: 0 }}
        to={{
          transform: profilePicHover ? 'rotate(180deg)' : 'rotate(0deg)',
          background: profilePicHover
            ? 'rgb(45, 45, 45)'
            : 'rgba(161, 161, 161, 0)',
          opacity: profilePicHover ? '0' : '1'
        }}
        config={{ tension: 280, friction: 140, mass: 30 }}
      >
        {props => (
          <div
            className='editprofile-profilepiccontainer'
            onClick={toggleProfilePic}
          >
            <div className='editprofile-profilepictext'>
              {userInfo.profilePicUrl
                ? 'update profile pic'
                : 'upload profile pic'}
            </div>

            <img
              onMouseOver={() => setProfilePicHover(true)}
              onMouseOut={() => setProfilePicHover(false)}
              style={props}
              src={
                userInfo.profilePicUrl
                  ? userInfo.profilePicUrl
                  : 'https://icon-library.net/images/default-profile-icon/default-profile-icon-24.jpg'
              }
              alt='edit profile pic'
              className='editprofile-profilepic'
            />
          </div>
        )}
      </Spring>
      <div className='editprofile-buttonbox'>
        {editUsernameOpen ? (
          <div className='editprofile-animatedformcontainer'>
            <div className='editprofile-openform'>
              <EditOpenForm
                type='username'
                close={close}
                setUserInfo={setUserInfo}
              />
            </div>
          </div>
        ) : (
          <div className='editprofile-animatedformcontainer'>
            <animated.div
              className='editprofile-animatedform'
              style={animation1Props}
              onClick={() => setEditUsernameOpen(true)}
              onMouseOver={() => {
                setUsernameHover(true);
              }}
              onMouseOut={() => {
                setUsernameHover(false);
              }}
            >
              <div className='editprofileformcontainer'>
                <div className='editprofile-button'>
                  {/* {usernameHover ? 'edit username' : userInfo.username} */}
                  edit username
                </div>
              </div>
            </animated.div>
          </div>
        )}

        {editEmailOpen ? (
          <div className='editprofile-animatedformcontainer'>
            <div className='editprofile-openform'>
              <EditOpenForm
                type='email'
                close={close}
                setUserInfo={setUserInfo}
              />
            </div>
          </div>
        ) : (
          <div className='editprofile-animatedformcontainer'>
            <animated.div
              className='editprofile-animatedform'
              style={animation2Props}
              onClick={() => setEditEmailOpen(true)}
              onMouseOver={() => {
                setEmailHover(true);
              }}
              onMouseOut={() => {
                setEmailHover(false);
              }}
            >
              <div className='editprofileformcontainer'>
                <div className='editprofile-button'>
                  {/* {emailHover ? 'edit email' : userInfo.email} */}
                  edit email
                </div>
              </div>
            </animated.div>
          </div>
        )}

        <animated.div
          className='editprofile-animatedform'
          style={animation3Props}
        >
          <div className='editprofile-animatedformcontainer'>
            <EditOpenForm
              type='profilepic'
              close={close}
              setUserInfo={setUserInfo}
            />
          </div>
        </animated.div>
      </div>
      <div ref={messagesEndRef} />
    </>
  );
};

export default EditProfile;
