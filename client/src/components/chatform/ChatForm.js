import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { CTX } from 'context/Store';
import './ChatForm.scss';

const ChatForm = ({ socket }) => {
  const [appState, updateState] = React.useContext(CTX);

  const [messageValue, setMessageValue] = useState('');
  const [fileUploadOpen, setFileUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(false);
  const [messagePrivate, setMessagePrivate] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  useEffect(() => {
    if (appState.currentTopic.substr(0, 7) === 'private') {
      setMessagePrivate(true);
    }
  }, [appState.currentTopic]);

  const handleChange = e => {
    setMessageValue(e.target.value);
  };

  const fileSelectedHandler = event => {
    setSelectedFile(event.target.files[0]);
  };

  const handleImageSubmit = async () => {
    if (selectedFile) {
      const fd = new FormData();
      fd.append('imagefile', selectedFile, selectedFile.name);
      fd.append('username', appState.username);
      fd.append('userId', appState.userId);

      if (messagePrivate) {
        fd.append('receiver', appState.currentPrivateFriend._id);
      } else {
        fd.append('topic', appState.currentTopic);
      }
      setLoadingImage(true);
      const createdMessage = await Axios.post(
        `/${messagePrivate ? 'privateimagemessage' : 'imagemessage'}`,
        fd,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': appState.token
          }
        }
      );
      if (createdMessage.status === 200) {
        setSelectedFile(false);
        setLoadingImage(false);
      }
    }
  };

  const handleSubmit = () => {
    if (messageValue.length > 0) {
      if (messagePrivate) {
        socket.emit('privatemessage', {
          content: messageValue,
          username: appState.username,
          userId: appState.userId,
          receiver: appState.currentPrivateFriend._id
        });
      } else {
        socket.emit('message', {
          content: messageValue,
          username: appState.username,
          userId: appState.userId,
          topic: appState.currentTopic
        });
      }

      setMessageValue('');
    }
  };

  const handleKeyDown = e => {
    if (e.keyCode === 13) {
      handleSubmit();
    }
  };

  let display = false;

  if (
    appState.currentTopic === 'main' ||
    appState.currentTopic === 'topic2' ||
    appState.currentTopic === 'cow' ||
    appState.currentTopic.substr(0, 7) === 'private'
  ) {
    display = true;
  }

  return (
    <div className='chatform-container'>
      <div className='chatform-innercontainer'>
        {display && (
          <>
            {fileUploadOpen ? (
              <>
                <input
                  className='chatform-fileinput'
                  onChange={fileSelectedHandler}
                  type='file'
                  name='file'
                  id='file'
                />
                <label
                  className={`chatform-fileinputlabel chatform-selectedfile${selectedFile &&
                    'true'}`}
                  htmlFor='file'
                >
                  <>select image file</>
                </label>
                <div
                  className='chatform-submitbutton'
                  onClick={!loadingImage && handleImageSubmit}
                >
                  send
                </div>
                <div
                  className='chatform-submitbutton'
                  onClick={() => setFileUploadOpen(false)}
                >
                  text
                </div>
              </>
            ) : (
              <>
                <input
                  type='text'
                  className='chatform-textinput'
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  value={messageValue}
                ></input>
                <div className='chatform-submitbutton' onClick={handleSubmit}>
                  send
                </div>
                <div
                  className='chatform-submitbutton'
                  onClick={() => setFileUploadOpen(true)}
                >
                  img
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatForm;
