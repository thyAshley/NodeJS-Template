const multer = require('multer');
const sharp = require('sharp');

const User = require('../models/userModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/users');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
    }
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image, Please upload only images.', 400), false);
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo'); 

exports.resizeUserPhoto = (req, user, next) => {
    if (!req.file) return next();

}

function filterObj(obj, ...allowedFields) {
    const newObj = {};
    Object.keys(obj).forEach(key => {
        if (allowedFields.includes(key)) newObj[key] = obj[key];
    })
    return newObj;
}

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};


exports.updateMe = catchAsync(async(req, res, next) => {
    // 1) error if post password
    if (req.body.password || req.body.confirmPassword) return next(new AppError('This is not for password updating, please use the /updatePassword route instead'), 400)

    // 2) update user document after filtering unwanted fields
    const filteredBody = filterObj (req.body, 'name', 'email');
    if (req.file) filteredBody.photo = req.file.filename

    const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        status: 'success',
        user
    })
    
})

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate( req.user.id, { active: false } );
    
    res.status(204).json({
        status: 'success',
        data: null
    })
    
})

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.deleteUser = factory.deleteOne(User);

// Do not update password with this
exports.updateUser = factory.updateOne(User);