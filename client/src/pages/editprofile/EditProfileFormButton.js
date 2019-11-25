import React, { useState } from 'react';
import { useSpring, animated, config } from 'react-spring';

const EditProfileFormButton = ({ buttonText }) => {
  const [hover, setHover] = useState(false);

  const animationProps = useSpring({
    opacity: 1,
    cursor: 'pointer',
    padding: '.2rem .8rem',
    borderRadius: '.1rem',
    marginTop: '.1rem',
    marginRight: '.3rem',
    textAlign: 'center',
    background: hover ? 'rgb(32, 32, 32)' : '#eee',
    color: hover ? '#eee' : 'rgb(32, 32, 32)',
    transform: hover ? 'translateY(-2px)' : 'translateY(0px)',
    boxShadow: hover
      ? '0.7rem 0.7rem 0.7rem rgba(0,0,0,0.3)'
      : '0rem 0rem 0rem #222',
    from: { opacity: 0 },
    config: config.wobbly
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
    >
      {buttonText}
    </animated.div>
  );
};

export default EditProfileFormButton;
