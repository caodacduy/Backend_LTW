const multer = require('multer');
const path = require('path');

// Cấu hình Multer
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '_' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage }); // ✅ đúng multer instance

// Hàm xử lý upload ảnh cho CKEditor
const uploadImg = async (req, res) => {

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
  res.status(200).json({ url: imageUrl });
};

module.exports = {
  upload,
  uploadImg
};

