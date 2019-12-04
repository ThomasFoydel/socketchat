import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import { CTX } from 'context/Store';
import { config, animated, useSpring } from 'react-spring';

const IndividualPrivateMessage = ({ message }) => {
  const { content, author, authorId, imageFile } = message;

  const [appState, updateState] = React.useContext(CTX);
  const [authorProfilePic, setAuthorProfilePic] = useState(
    'https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png'
  );

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
        // style={props}
        className={`individualmessage-container individualmessage-container-${
          currentUserIsAuthor ? 'ownmessage' : 'friendmessage'
        }`}
      >
        <div className={`individualmessage-flex`}>
          {!currentUserIsAuthor && (
            <Link to={`/user/${authorId}`}>
              <img
                alt={`${author}'s profile`}
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
            {!currentUserIsAuthor && <h6>{author}</h6>}
            {content && (
              <div className='individualmessage-content'>{content}</div>
            )}
            {imageFile && (
              <Link to={`/image/${imageFile}`}>
                <img
                  alt='individual private message'
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

export default IndividualPrivateMessage;
