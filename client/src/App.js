import React from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';

import Chat from 'pages/chat/Chat';

import Store from 'context/Store';

import './App.scss';

const App = () => {
  return (
    <Store>
      <div className='App'>
        <Router>
          <Switch>
            <Route path='/' component={Chat} />
          </Switch>
        </Router>
      </div>
    </Store>
  );
};

export default App;
