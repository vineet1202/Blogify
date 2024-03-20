require("dotenv").config();
const cloudinary = require("cloudinary").v2;
console.log(process.env.API_KEY);
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const image = "./uploads/6ff958fcd064d95f24208eaf9fa60950.webp"; // This can also be a remote URL or a base64 DataURI

cloudinary.uploader.upload(image).then((result) => {
  console.log(result);
});
