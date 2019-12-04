import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import { config, animated, useSpring } from 'react-spring';
import DefaultPic from 'img/DefaultPic.jpg';

import { CTX } from 'context/Store';

const IndividualMessage = ({ content, author, authorId, imageFile }) => {
  const [appState, updateState] = useContext(CTX);
  const [authorProfilePic, setAuthorProfilePic] = useState(DefaultPic);

  const currentUserIsAuthor = authorId === appState.userId;

  useEffect(() => {
    let isSubscribed = true;
    const fetchProfilePic = async () => {
      const foundAuthor = await Axios.get(`/userinfo/${authorId}`);
      if (isSubscribed && foundAuthor.data.profilePicUrl) {
        setAuthorProfilePic(foundAuthor.data.profilePicUrl);
      }
    };
    fetchProfilePic();
    return () => {
      isSubscribed = false;
    };
  }, [authorId]);

  const animationProps = useSpring({
    opacity: 1,
    marginLeft: 0,
    from: { opacity: 0, marginLeft: -500 },
    config: config.wobbly
  });

  return (
    <animated.div style={animationProps}>
      <div
        className={`individualmessage-container individualmessage-container-${
          currentUserIsAuthor ? 'ownmessage' : 'friendmessage'
        }`}
      >
        <div className={`individualmessage-flex`}>
          {!currentUserIsAuthor && (
            <Link to={`/user/${authorId}`}>
              <img
                alt='post author profile'
                className='individualmessage-authorprofilepic'
                src={authorProfilePic}
              />
            </Link>
          )}

          <div
            className={`individualmessage individualmessage-hasimage${
              imageFile ? 'true' : 'false'
            } individualmessage-${
              currentUserIsAuthor ? 'ownmessage' : 'friendmessage'
            }`}
          >
            {!currentUserIsAuthor && (
              <h6 className='individualmessage-authorname'>{author}</h6>
            )}
            {content && (
              <div className='individualmessage-content'>{content}</div>
            )}
            {imageFile && (
              <Link to={`/image/${imageFile}`}>
                <img
                  alt={`post from ${author}`}
                  src={`/messageimage/${imageFile}`}
                  className='individualmessage-image'
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    </animated.div>
  );
};

export default IndividualMessage;
