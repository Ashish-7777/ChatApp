const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');
const cookieParser = require('cookie-parser');
const multer  = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');
const Post = require('./models/post')
const dotEnv = require('dotenv');

dotEnv.config();
const app = express();
const PORT = process.env.PORT || 3500; 
const saltRounds = 10;
const code = process.env.CODE;

app.use(cors({credentials:true, origin:process.env.CLIENT_URL}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect(process.env.MONGO_URL);

app.post('/signUp', (req, res) => { 
    const {username, email, password} = req.body;
    try{
        bcrypt.hash(password, saltRounds, async function(err, hash) {
            const userDoc = await User.create({username, email, password:hash});
            res.json(userDoc);
        });  
    } catch(e){
        res.status(404).json(e);
    }
});

app.post('/signIn', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const userDoc = await User.findOne({ email });
        if (!userDoc) {
            return res.status(400).json('User not found');
        }

        bcrypt.compare(password, userDoc.password, function (err, result) {
            if (err) {
                return res.status(400).json('Error comparing passwords');
            }
            if (result) { 
                jwt.sign(
                    { username: userDoc.username, email, id: userDoc._id },
                    code,
                    {},
                    (err, token) => {
                        if (err) {
                            return res.status(500).json('Error generating token');
                        }
                        res.cookie('token', token).json({
                            id: userDoc._id,
                            username: userDoc.username,
                            email: userDoc.email,
                        });
                    }
                );
            } else {
                res.status(400).json('Wrong password');
            }
        });
    } catch (error) {
        res.status(500).json('Server error');
    }
});


app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, code, {}, (err, info) => {
        if(err) throw err;
        res.json(info);
    })
});

app.post('/signout', (req, res) => {
    res.cookie('token', '').json('ok');
}); 

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    const { originalname, path} = req.file;
    const part = originalname.split('.');
    const ext = part[part.length-1];
    const newPath = (path+"."+ext).replace(/\\/g, '/');
    fs.renameSync(path, newPath);

    const {token} = req.cookies;
    jwt.verify(token, code, {}, async (err, info) => {
        if(err) throw err;
        const {title, summary, content} = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content, 
            cover:newPath,
            author:info.id,
        }) 
        res.json(postDoc);
        });
});

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;
    if (req.file) {
        const { originalname, path } = req.file;
        const part = originalname.split('.');
        const ext = part[part.length - 1];
        newPath = (path + "." + ext).replace(/\\/g, '/');
        fs.renameSync(path, newPath);
    }

    const { token } = req.cookies;
    jwt.verify(token, code, {}, async (err, info) => {
        if (err) throw err;

        const { id, title, summary, content } = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);

        if (!isAuthor) {
            return res.status(404).json('You are not the author');
        }
        postDoc.title = title;
        postDoc.summary = summary;
        postDoc.content = content;
        if (newPath) {
            postDoc.cover = newPath;
        }
        await postDoc.save();

        res.json(postDoc);
    });
});


app.get('/post', async (req, res) => {
    const posts = await Post.find().populate('author', ['username']).sort({createdAt: -1}).limit(20);
    res.json(posts);
});

app.get('/post/:id', async (req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
});

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
});// This is a test change
