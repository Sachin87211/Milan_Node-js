// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');


// const uploadDirectory = path.join(__dirname, '../public/uploads');

// if (!fs.existsSync(uploadDirectory)) {
//   fs.mkdirSync(uploadDirectory);
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDirectory)
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     cb(null, file.fieldname + '-' + uniqueSuffix)
//   }
// });

// // console.log("here")
// const fileFilter = (req, file, cb) => {

//   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: 1024 * 1024 * 50
//   },
// })

// module.exports = { upload }


const multer = require("multer");
const path = require("path");
const fs = require("fs");




const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});



const fileFilter = (req, file, cb) => {

  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 50
  },
})


module.exports = { upload };