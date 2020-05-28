const multer = require('multer');

module.exports = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        if(!file.mimetype.match(/jpg|jpeg|png$i/)) {
            return cb(new Error('File is Not Supported'), false)
        }
        cb(null, true)
    }
})