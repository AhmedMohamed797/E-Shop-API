import multer from 'multer';
import { AppError } from '../utils/appError.js';

const multerOptions = () => {
  // 1) diskStorage engine
  // const multerOptions = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, path.resolve('src/uploads/categories'));
  //   },

  //   filename: function (req, file, cb) {
  //     // category-${id}.${Date.now}-jpeg
  //     const ext = file.mimetype.split('/')[1];
  //     const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;

  //     cb(null, filename);
  //   },
  // });

  // 2) memoryStorage engine

  const multerOptions = multer.memoryStorage();

  // Check if file if image or not
  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new AppError(`Only images accepted`, 400), false);
    }
  };

  const upload = multer({
    storage: multerOptions,
    fileFilter: multerFilter,
  });

  return upload;
};

export const uploadSingleImage = (fieldName) => {
  return multerOptions().single(fieldName);
};

export const uploadListOfImages = (arrayOfFields) => {
  return multerOptions().fields(arrayOfFields);
};
