import React, { useState, useContext, useEffect, useRef } from 'react';
import Axios from 'axios';
import IndividualPrivateMessage from 'pages/privateconvo/IndividualPrivateMessage';
import { CTX } from 'context/Store';

const PrivateConvo = ({ match, socket }) => {
  const [appState, updateState] = useContext(CTX);
  const friendId = match.params.id;
  const [foundUser, setFoundUser] = useState({});
  const [foundMessages, setFoundMessages] = useState([]);
  const [newestSocketPrivateMessage, setNewestSocketPrivateMessage] = useState(
    {}
  );
  const messagesEndRef = useRef(null);
  // const [count, setCount] = useState(10);
  const count = 10;
  const [start, setStart] = useState(1);
  const [socketMessageOffset, setSocketMessageOffset] = useState(0);
  const [moreMessagesExist, setMoreMessagesExist] = useState(true);

  const privateLoadMore = async () => {
    if (moreMessagesExist) {
      const loadedMessages = await Axios.get(
        `/privateloadmessages?friendid=${friendId}&count=${count}&start=${start +
          1}&offset=${socketMessageOffset}`,
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      if (loadedMessages.data.length === count) {
        setFoundMessages([...loadedMessages.data, ...foundMessages]);
      } else {
        setFoundMessages([...loadedMessages.data, ...foundMessages]);
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
    const findUser = async () => {
      const returnedUser = await Axios.get(`/user/${friendId}`);
      if (returnedUser) {
        setFoundUser(returnedUser.data);
      }
    };
    findUser();

    const loadPrivateMessages = async () => {
      const foundMessages = await Axios.get(
        `/privateconvo?userid=${appState.userId}&friendid=${friendId}`
      );
      if (foundMessages.data) {
        setFoundMessages(foundMessages.data);
        scrollToBottom();
      }
    };
    loadPrivateMessages();
  }, [friendId, appState.userId]);

  useEffect(() => {
    if (foundUser.username) {
      updateState({
        type: 'CHANGE_TOPIC',
        payload: { currentTopic: `private convo with ${foundUser.username}` }
      });

      updateState({
        type: 'CHANGE_CURRENT_PRIVATE_FRIEND',
        payload: { currentPrivateFriend: foundUser }
      });
    }

    return () => {
      if (foundUser) {
        updateState({
          type: 'CHANGE_CURRENT_PRIVATE_FRIEND',
          payload: { currentPrivateFriend: foundUser._id }
        });
      }
    };
  }, [foundUser, updateState]);

  useEffect(() => {
    if (socket) {
      socket.on('privatemessage', pm => {
        if (pm.authorId === foundUser._id || pm.authorId === appState.userId) {
          setNewestSocketPrivateMessage(pm);
          setTimeout(() => scrollToBottom(), 20);
        }
      });
    }

    return () => {
      if (socket) {
        socket.removeAllListeners();
      }
    };
  }, [socket, foundUser._id, appState.userId]);

  useEffect(() => {
    if (newestSocketPrivateMessage) {
      // setFoundMessages([...foundMessages, newestSocketPrivateMessage]);
      setFoundMessages(existingMessages => [
        ...existingMessages,
        newestSocketPrivateMessage
      ]);
      setSocketMessageOffset(existingOffset => existingOffset + 1);
    }
  }, [newestSocketPrivateMessage]);

  return (
    <div>
      <div className='chatbox-loadmorebutton' onClick={privateLoadMore}>
        load more
      </div>
      {foundMessages.map(message => {
        if (message._id) {
          return (
            <IndividualPrivateMessage key={message._id} message={message} />
          );
        }
        return null;
      })}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default PrivateConvo;
