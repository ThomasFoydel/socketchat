import React, { useState, useEffect, useContext, useRef } from 'react';
import IndividualMessage from './IndividualMessage';
import Axios from 'axios';

import { CTX } from 'context/Store';

const ChatBoxMessageList = ({ socket }) => {
  const [appState, updateState] = useContext(CTX);
  const [messagesArray, setMessagesArray] = useState([]);
  const [newestSocketMessage, setNewestSocketMessage] = useState('');
  const [count, setCount] = useState(10);
  const [start, setStart] = useState(1);
  const [socketMessageOffset, setSocketMessageOffset] = useState(0);
  const [moreMessagesExist, setMoreMessagesExist] = useState(true);
  const [initialMessagesLoaded, setInitialMessagesLoaded] = useState(false);
  const messagesEndRef = useRef(null);

  let { currentTopic } = appState;

  const loadMore = async () => {
    if (moreMessagesExist) {
      const loadedMessages = await Axios.get(
        `/loadmessages?topic=${currentTopic}&count=${count}&start=${start +
          1}&offset=${socketMessageOffset}`,
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      if (loadedMessages.data.length === count) {
        setMessagesArray([...loadedMessages.data, ...messagesArray]);
      } else {
        setMessagesArray([...loadedMessages.data, ...messagesArray]);
        setMoreMessagesExist(false);
      }
      setStart(start + 1);
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    socket.on('onlineUsers', onlineUserList => {
      updateState({
        type: 'UPDATE_ONLINE_USER_LIST',
        payload: { onlineUserList: onlineUserList }
      });
    });
    socket.emit('reqOnlineUsers');

    return () => {
      socket.removeAllListeners();
    };
  }, [updateState]);

  useEffect(() => {
    socket.on('message', message => {
      if (message.topic === appState.currentTopic) {
        setNewestSocketMessage(message);
      }
    });

    socket.on('onlineUsersUpdate', onlineUserList => {
      updateState({
        type: 'UPDATE_ONLINE_USER_LIST',
        payload: { onlineUserList: onlineUserList }
      });
    });

    if (socket) {
      socket.emit('updateAndSendOnlineUsers');
    }

    return () => {
      socket.removeAllListeners();
    };
  }, [socket, appState.currentTopic, updateState]);

  useEffect(() => {
    if (newestSocketMessage) {
      scrollToBottom();
      setMessagesArray(existingMessages => [
        ...existingMessages,
        newestSocketMessage
      ]);

      setSocketMessageOffset(existingOffset => existingOffset + 1);
      setTimeout(() => {
        scrollToBottom();
      }, 1000);
    }
  }, [newestSocketMessage]);

  useEffect(() => {
    let isSubscribed = true;
    setMoreMessagesExist(true);
    if (currentTopic && currentTopic !== 'edit profile') {
      setCount(10);
      setStart(1);

      const loadInitialMessages = async () => {
        const foundMessages = await Axios.get(
          `/loadmessages?topic=${currentTopic}&count=${10}&start=${1}&offset=${0}`
        );
        if (isSubscribed) {
          setMessagesArray(foundMessages.data);
          setInitialMessagesLoaded(true);
        }
      };
      loadInitialMessages();
    }
    setTimeout(() => {
      scrollToBottom();
    }, 1000);

    return () => {
      isSubscribed = false;
    };
  }, [currentTopic]);

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  }, [initialMessagesLoaded]);

  useEffect(() => {
    updateState({
      type: 'CHANGE_CURRENT_PRIVATE_FRIEND',
      payload: { currentPrivateFriend: '' }
    });
  }, [updateState]);

  return (
    <div>
      <div className='chatbox-messagearea'>
        {currentTopic && moreMessagesExist && messagesArray && (
          <div className='chatbox-loadmorebutton' onClick={loadMore}>
            load more
          </div>
        )}

        {messagesArray &&
          messagesArray.map(message => {
            if (message._id) {
              return (
                <IndividualMessage
                  key={message._id}
                  author={message.author}
                  content={message.content}
                  authorId={message.authorId}
                  imageFile={message.imageFile}
                  hasMore={true}
                  loader={
                    <div className='loader' key={0}>
                      Loading ...
                    </div>
                  }
                />
              );
            }
            return null;
          })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatBoxMessageList;
