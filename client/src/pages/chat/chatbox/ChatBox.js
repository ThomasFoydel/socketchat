import React from 'react';
import ChatBoxMessageList from 'pages/chat/chatbox/ChatBoxMessageList';
import EditProfile from 'pages/editprofile/EditProfile';
import UserProfile from 'pages/userprofile/UserProfile';
import Login from 'pages/login/Login';
import Register from 'pages/register/Register';
import PrivateConvo from 'pages/privateconvo/PrivateConvo';
import TypicalBox from 'components/typicalbox/TypicalBox';

import { Switch, Route } from 'react-router-dom';
import IndividualImage from 'pages/individualimage/IndividualImage';

import { CTX } from 'context/Store';

import './ChatBox.scss';

const ChatBox = ({ socket }) => {
  const [appState, updateState] = React.useContext(CTX);

  let { currentTopic } = appState;

  let displayChatBoxMessageList;

  if (
    currentTopic === 'main' ||
    currentTopic === 'topic2' ||
    currentTopic === 'cow'
  ) {
    displayChatBoxMessageList = true;
  }

  return (
    <div className='chatbox-outercontainer'>
      <div className='chatbox-container'>
        <h1 className='chatbox-title'>{currentTopic}</h1>
        <div className='chatbox-messagelist-container'>
          <Switch>
            <Route path='/editprofile' component={EditProfile} />
            <Route path='/user/:id' component={UserProfile} />
            <Route path='/login' component={Login} />
            <Route path='/register' component={Register} />
            <Route path='/image/:id' component={IndividualImage} />
            <Route
              path='/privateconvo/:id'
              render={props => <PrivateConvo {...props} socket={socket} />}
            />
            <>{!currentTopic && <TypicalBox />}</>
          </Switch>
          <Route
            path='/chat'
            render={() => {
              if (displayChatBoxMessageList) {
                return <ChatBoxMessageList socket={socket} />;
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
