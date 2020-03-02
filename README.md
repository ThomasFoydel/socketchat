<div align="center"> <h1>socketchat</h1> </div>

### A chat application built in MERN stack with socket.io! [live demo here](http://socketchat.xyz/)

SocketChat.xyz allows users to create accounts, manage profiles, and send live chat messages to multiple public chat rooms or to other individual users privately. This app is built with mongodb, node/express, react, socketio. It uses a bcrypt and json web token based authentication flow and a state management flow based on react's context and hooks.

This project was inspired by challenges I ran into while building http://mernsocialmedia.xyz, particularly with integrating socketio chat features and storing/serving images. This project allowed me to build fluency in those areas and explore react's context.

<img src="/client/src/img/screenshot.jpg" width="100%" >

The main challenges I ran into with this project ended up being:

1. Implementing an auto-scroll effect when new messages come in, getting the flow of events in the right order to make this happen was a bit tricky
2. Implementing react-spring animations that play nicely with the timing of the other animation effects (mainly the auto-scroll)

### To run on your machine:

1. clone or download and unzip
2. open terminal from the root folder of the project and run `npm i` then `cd client` then `npm i` again and then `cd ..`
3. start the project with `npm run dev` or, alternatively, first start the backend server with `npm start` and then open a second terminal and run `cd client` followed by `npm start`
4. project front-end should be running at http://localhost:3000 and back-end running at http://localhost:8000
5. socketio chat connection string in client/src/components/chat/chatcontainer must be changed to the url that backend is running on, it is currently set to `` `?token=${token}` `` for production so it needs to be set to `` `http://localhost:8000?token=${token}` `` for use in a local environment
