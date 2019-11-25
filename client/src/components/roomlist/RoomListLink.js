import React, { useState, useContext } from 'react';
import { useSpring, animated, config } from 'react-spring';
import { CTX } from 'context/Store';

const RoomListLink = ({ linkName, isCurrentRoom }) => {
  const [appState, updateState] = useContext(CTX);
  const [hover, setHover] = useState(false);

  const linkBackgroundColor = isCurrentRoom ? 'rgb(194, 31, 31)' : '#ccc';
  const linkBackgroundColorHover = isCurrentRoom ? 'rgb(82, 0, 0)' : '#222';

  const animationProps = useSpring({
    opacity: 1,
    marginLeft: 0,
    background: hover ? linkBackgroundColorHover : linkBackgroundColor,
    color: hover ? '#eee' : 'rgb(8, 8, 8)',
    transform: hover
      ? 'translateY(-4px) scale(1.1)'
      : 'translateY(0px) scale(1)',
    boxShadow: hover
      ? '1rem 1rem 2rem rgba(0, 0, 0, 0.411)'
      : '0.1rem 0.1rem 0.1rem rgba(0, 0, 0, 0.451)',
    from: { opacity: 0, marginLeft: -500 },
    config: config.gentle
  });
  return (
    <animated.div
      style={animationProps}
      onMouseOver={() => {
        setHover(true);
      }}
      onMouseOut={() => {
        setHover(false);
      }}
      onClick={() =>
        updateState({
          type: 'CHANGE_TOPIC',
          payload: { currentTopic: linkName }
        })
      }
    >
      <div className='roomlist-link'>{linkName}</div>
    </animated.div>
  );
};

export default RoomListLink;
