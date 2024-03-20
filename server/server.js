const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const User = require("./user.js");
const Post = require("./Post.js");
const bcrypt = require("bcryptjs");

const salt = bcrypt.genSaltSync(10);
const secret = "skndkfdghgg34347dfkkjkj";
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");

require("dotenv").config();

app.use(
  cors({ credentials: true, origin: "https://blogify-1-14k2.onrender.com/" })
);
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(400).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  //if username does not match
  if (userDoc === null) {
    res.status(400).json("wrong credentials");
  } else {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
        if (err) throw err;
        res.cookie("token", token).json({
          id: userDoc._id,
          username,
        });
      });
    } else {
      res.status(400).json("wrong credentials");
    }
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      return res.status(401).json({ message: "Token expired or invalid" });
    }
    res.json(info);
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", null).json("ok");
});

app.use("/uploads", express.static(__dirname + "/uploads"));

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

app.post("/post", upload.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      return res.status(401).json({ message: "Token expired or invalid" });
    }
    const { title, summary, content } = req.body; //createPost fetch method
    try {
      const uploadResult = await cloudinary.uploader.upload(newPath);
      const PostDoc = await Post.create({
        title,
        summary,
        content,
        cover: uploadResult.secure_url,
        author: info.username,
      });
      res.json(PostDoc);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error uploading image" });
    }
  });
});

//updating the post
app.put("/post", upload.single("file"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      return res.status(401).json({ message: "Token expired or invalid" });
    }
    const { id, title, summary, content } = req.body;
    const PostDoc = await Post.findById(id);
    const isAuthor =
      JSON.stringify(PostDoc.author) === JSON.stringify(info.username);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }
    await PostDoc.updateOne({
      title,
      summary,
      content,
      cover: newPath ? newPath : PostDoc.cover,
    });

    res.json(PostDoc);
  });
});

app.get("/post", async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const PostDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(PostDoc);
});

app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Find the post by ID
    const post = await Post.findById(id);

    // Check if the post exists
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await post.deleteOne();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(4000, () => {
  console.log("Server is running on port 4000...");
});
