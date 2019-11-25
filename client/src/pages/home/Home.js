import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className='home-container'>
      <h1>home</h1>
      <Link to='/login'>login</Link>
    </div>
  );
};

export default Home;
