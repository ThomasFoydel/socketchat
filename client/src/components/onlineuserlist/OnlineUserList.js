import React, { useContext } from 'react';
import IndividualOnlineUser from 'components/onlineuserlist/IndividualOnlineUser';
import { Link } from 'react-router-dom';
import { CTX } from 'context/Store';
import './OnlineUserList.scss';

const OnlineUserList = () => {
  const [appState, updateState] = useContext(CTX);

  return (
    <div>
      {appState.onlineUserList.length > 0 && (
        <h1 className='onlineuserlist-title'>online users</h1>
      )}

      <div className='onlineuserlist-container'>
        {appState.onlineUserList &&
          appState.onlineUserList.map(user => {
            return (
              <div key={user.userId}>
                {user.userId === appState.userId ? (
                  <Link to={`/user/${user.userId}`}>
                    <IndividualOnlineUser
                      username={user.username}
                      profilePicUrl={user.profilePicUrl}
                    />
                  </Link>
                ) : (
                  <Link to={`/privateconvo/${user.userId}`}>
                    <IndividualOnlineUser
                      username={user.username}
                      profilePicUrl={user.profilePicUrl}
                    />
                  </Link>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default OnlineUserList;
