import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png/;
  const isValid = allowed.test(path.extname(file.originalname).toLowerCase());
  if (isValid) cb(null, true);
  else cb(new Error('Only jpeg, jpg, png allowed!'));
};

const upload = multer({ storage, fileFilter });

export default upload;
