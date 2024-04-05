import multer from "multer";

// specify the storage engine

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });


// file validation
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    // prevent the upload
    cb({ message: "Unsupported file format" }, false);
  }
};

const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: fileFilter,
})


export default upload;
