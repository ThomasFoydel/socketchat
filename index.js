const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const socketio = require('socket.io');
const mongoose = require('mongoose');

///////// image parsing / storing ///////
const multer = require('multer');
const crypto = require('crypto');
const methodOverride = require('method-override');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
/////////////////////////////////////////

const User = require('./models/User');
const Message = require('./models/Message');
const PrivateMessage = require('./models/PrivateMessage');

const auth = require('./middlewares/auth');

const app = express();
const expressServer = app.listen(process.env.PORT || 8000);
const io = socketio(expressServer);

let onlineUsers = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
require('dotenv').config({ path: path.resolve(__dirname + '/.env') });

///////////// IMAGE STUFF ///////////////////////////
app.use(methodOverride('_method'));
// mongo uri
const mongoURI = process.env.MONGO_URI;
const conn = mongoose.createConnection(mongoURI);
// Init gfs
let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});
// create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });
//////////////////////////////////////////////////

app.get('/messages/:topic', async (req, res) => {
  const { topic } = req.params;
  if (topic) {
    const foundMessages = await Message.find({ topic: topic })
      .sort({ createdAt: 1 })
      .limit(20);

    res.send(foundMessages);
  } else {
    res.status(404).send();
  }
});

app.get('/loadmessages', async (req, res) => {
  let { topic, count, start, offset } = req.query;
  count = Number(count);
  start = Number(start);
  offset = Number(offset);
  const page = await Message.find({ topic: topic })
    .sort({ createdAt: -1 })
    .skip(count * (start - 1) + offset)
    .limit(count);
  res.send(page.reverse());
});

app.get('/privateloadmessages', auth, async (req, res) => {
  let { friendid, count, start, offset } = req.query;
  let { userId } = req.tokenUser;
  count = Number(count);
  start = Number(start);
  offset = Number(offset);
  const page = await PrivateMessage.find({
    $and: [
      { participants: { $in: [friendid] } },
      { participants: { $in: [userId] } }
    ]
  })
    .sort({ createdAt: -1 })
    .skip(count * (start - 1) + offset)
    .limit(count);

  res.send(page.reverse());
});

app.get('/privateconvo', async (req, res) => {
  const foundMessages = await PrivateMessage.find({
    $and: [
      { participants: { $in: [req.query.friendid] } },
      { participants: { $in: [req.query.userid] } }
    ]
  })
    .sort({ createdAt: -1 })
    .limit(10);

  res.send(foundMessages.reverse());
});

app.post('/register', async (req, res) => {
  if (req.body.password.length < 6) {
    return res.json({ err: 'Password must be at least 6 characters' });
  }
  if (req.body.username.length < 4 || req.body.username.length > 12) {
    return res.json({ err: 'Username must be between 4 and 12 characters' });
  }
  if (req.body.password !== req.body.confirmPassword) {
    return res.json({ err: 'Passwords do not match' });
  }
  if (!req.body.email.includes('@') || !req.body.email.includes('.')) {
    return res.json({ err: 'Email input invalid' });
  }

  const hashedPW = await bcrypt.hash(req.body.password, 12);

  const alreadyExistingEmailUser = await User.findOne({
    email: req.body.email
  });
  if (alreadyExistingEmailUser) {
    return res.json({ err: 'User with this email already exists' });
  }
  const alreadyExistingUsernameUser = await User.findOne({
    username: req.body.username
  });
  if (alreadyExistingUsernameUser) {
    return res.json({ err: 'User with this username already exists' });
  }

  const newUser = new User({
    email: req.body.email,
    username: req.body.username,
    password: hashedPW
  });
  newUser.save().then(result => {
    res.send(result);
  });
});

app.post('/login', async (req, res) => {
  User.findOne({ email: req.body.email }, async (err, user) => {
    if (!user) {
      return res.json({ err: 'User not found' });
    } else {
      const passwordsMatch = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (passwordsMatch) {
        const token = jwt.sign(
          {
            tokenUser: {
              userId: user._id
            }
          },
          process.env.SECRET,
          { expiresIn: '100hr' }
        );

        res.json({
          status: 'success',
          message: 'login sucessful',
          data: {
            token: token,
            email: user.email,
            username: user.username,
            userId: user._id,
            profilePicUrl: user.profilePicUrl
          }
        });
      } else if (!passwordsMatch) {
        return res.json({ err: 'Incorrect password' });
      }
    }
  });
});

app.post('/auth', auth, async (req, res) => {
  if (req.tokenUser.userId === req.body.userId) {
    const foundUser = await User.findOne({ _id: req.tokenUser.userId });
    res.send(foundUser);
  } else {
    res.status(401).json({ err: 'Not authenticated' });
  }
});

app.post('/editprofile/:type', auth, async (req, res) => {
  const { value, password } = req.body;
  const { type } = req.params;
  const { userId } = req.tokenUser;

  User.findOne({ _id: userId }).then(user => {
    const updateUser = async () => {
      try {
        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (passwordsMatch) {
          switch (type) {
            case 'username':
              const updatedUserUserName = await User.findOneAndUpdate(
                { _id: userId },
                { $set: { username: value } },
                { new: true }
              );
              res.status(201).send(updatedUserUserName);
              break;
            case 'email':
              const updatedUserEmail = await User.findOneAndUpdate(
                { _id: userId },
                { $set: { email: value } },
                { new: true }
              );
              res.status(201).send(updatedUserEmail);
              break;
            case 'profilepic':
              const updatedUserProfilePic = await User.findOneAndUpdate(
                { _id: userId },
                { $set: { profilePicUrl: value } },
                { new: true }
              );
              res.status(201).send(updatedUserProfilePic);
              break;
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    updateUser();
  });
});

app.get('/userinfo/:id', async (req, res) => {
  const { id } = req.params;
  if (id) {
    const foundUser = await User.findById(id);
    if (foundUser) {
      res.send(foundUser);
    }
  }
});

app.post(
  '/imagemessage',
  [auth, upload.single('imagefile')],
  async (req, res) => {
    // let errors;
    let reqFileId = req.file.id;
    const { username, userId, topic } = req.body;

    const newMessage = new Message({
      author: username,
      authorId: userId,
      imageFile: reqFileId,
      content: '',
      topic
    });

    newMessage.save().then(result => {
      io.emit('message', result);
      res.send(result);
    });
  }
);

app.post(
  '/privateimagemessage',
  [auth, upload.single('imagefile')],
  async (req, res) => {
    let reqFileId = req.file.id;
    const { username, userId, receiver } = req.body;

    const newPrivateMessage = new PrivateMessage({
      author: username,
      authorId: userId,
      participants: [userId, receiver],
      imageFile: reqFileId,
      content: '',
      receiver
    });

    newPrivateMessage.save().then(result => {
      const onlineFriend = onlineUsers.filter(
        user => user.userId === result.receiver
      );
      if (onlineFriend) {
        const friendSocketId = onlineFriend[0].socketId;

        io.to(`${friendSocketId}`).emit('privatemessage', result);
      }

      const senderInArray = onlineUsers.filter(
        user => user.userId === result.authorId
      );
      const senderSocketId = senderInArray[0].socketId;
      io.to(`${senderSocketId}`).emit('privatemessage', result);
      res.send(result);
    });
  }
);

// get image by contentImageId
app.get('/messageimage/:id', async (req, res) => {
  const file = await gfs.files.findOne({
    _id: mongoose.Types.ObjectId(req.params.id)
  });
  if (!file || file.length === 0) {
    return res.status(404).json({ err: 'no file exists' });
  } else {
    const readStream = gfs.createReadStream(file.filename);
    readStream.pipe(res);
  }
});

//Static file declaration
app.use(express.static(path.join(__dirname, 'client/build')));
//production mode
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  //
  app.get('*', (req, res) => {
    res.sendfile(path.join((__dirname = 'client/build/index.html')));
  });
}
//build mode
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/public/index.html'));
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(res => {
    io.on('connection', socket => {
      const { userId, username, profilePicUrl } = socket.handshake.query;
      let filteredOnlineUsers = onlineUsers.filter(user => {
        return user.userId !== userId;
      });
      if (socket.handshake.query.userId) {
        onlineUsers = [
          ...filteredOnlineUsers,
          { userId, username, profilePicUrl, socketId: socket.id }
        ];
      }

      socket.on('reqOnlineUsers', () => {
        socket.emit('onlineUsers', onlineUsers);
        socket.broadcast.emit('onlineUsersUpdate', onlineUsers);
      });

      socket.on('updateAndSendOnlineUsers', () => {
        socket.broadcast.emit('onlineUsers', onlineUsers);
      });

      socket.on('message', async message => {
        const newMessage = new Message({
          author: message.username,
          authorId: message.userId,
          content: message.content,
          topic: message.topic,
          _id: message._id
        });
        newMessage
          .save()
          .then(result => {
            io.emit('message', result);
          })
          .catch(err => console.log('new message error: ', err));
      });

      socket.on('privatemessage', async message => {
        const newMessage = new PrivateMessage({
          author: message.username,
          authorId: message.userId,
          content: message.content,
          participants: [message.userId, message.receiver],
          receiver: message.receiver,
          _id: message._id
        });
        newMessage
          .save()
          .then(result => {
            const onlineFriend = onlineUsers.filter(
              user => user.userId === message.receiver
            );
            if (onlineFriend.length > 0) {
              const friendSocketId = onlineFriend[0].socketId;

              io.to(`${friendSocketId}`).emit('privatemessage', result);
            }
            io.to(`${socket.id}`).emit('privatemessage', result);
          })
          .catch(err => console.log('new private message error: ', err));
      });

      socket.on('disconnect', socketToClose => {
        try {
          const { userId } = socket.handshake.query;
          let filteredOnlineUsers = onlineUsers.filter(user => {
            return user.userId !== userId;
          });
          onlineUsers = filteredOnlineUsers;

          socket.broadcast.emit('onlineUsersUpdate', filteredOnlineUsers);
        } catch (err) {
          console.log(err);
        }
      });

      socket.on('error', err => {
        console.log('error from socket: ', socket.id, ' error: ', err);
      });
    });
  });
