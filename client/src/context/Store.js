import React from 'react';

const CTX = React.createContext();

export { CTX };

export function reducer(state, action) {
  const {
    token,
    email,
    username,
    userId,
    isLoggedIn,
    currentTopic,
    profilePicUrl,
    onlineUserList,
    currentPrivateFriend
  } = action.payload;

  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        token,
        email,
        username,
        userId,
        profilePicUrl,
        isLoggedIn: true
      };
    case 'AUTH':
      return {
        ...state,
        username,
        userId,
        token,
        isLoggedIn,
        profilePicUrl
      };
    case 'LOGOUT':
      return {
        ...state,
        username: '',
        userId: '',
        token: '',
        profilePicUrl: '',
        isLoggedIn: false
      };
    case 'CHANGE_TOPIC':
      return {
        ...state,
        currentTopic
      };
    // case 'RECIEVE_MESSAGE':
    //   console.log('recieve message reducer action');
    //   return {
    //     ...state,
    //     [topic]: [
    //       ...state[topic],
    //       {
    //         authorId,
    //         author,
    //         content,
    //         _id
    //       }
    //     ]
    //   };
    case 'UPDATE_ONLINE_USER_LIST':
      return {
        ...state,
        onlineUserList: onlineUserList
      };
    case 'CHANGE_CURRENT_PRIVATE_FRIEND':
      return {
        ...state,
        currentPrivateFriend
      };

    default:
      throw Error('reducer error');
  }
}

export default function Store(props) {
  const stateHook = React.useReducer(reducer, {
    token: '',
    email: '',
    username: '',
    userId: '',
    isLoggedIn: false,
    currentTopic: '',
    profilePicUrl: '',
    onlineUserList: [],
    currentPrivateFriend: {}
  });

  return <CTX.Provider value={stateHook}>{props.children}</CTX.Provider>;
}
