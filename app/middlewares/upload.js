// middlewares/upload.js
const multer = require('multer');
const path = require('path');

// Tùy theo field, lưu vào thư mục khác nhau
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'image') {
      cb(null, 'uploads/image');
    } else if (file.fieldname === 'file') {
      cb(null, 'uploads/file');
    } else {
      cb(null, 'uploads/others');
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

module.exports = upload;
