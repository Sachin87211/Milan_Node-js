const { body, validationResult } = require("express-validator");

exports.registerValidation = [
  body("countryCode")
    .notEmpty()
    .withMessage("Country code cannot be empty")
    .matches(/^\+\d+$/)
    .withMessage("Country code must start with '+' and be followed by digits")
    .isLength({ min: 2, max: 5 })
    .withMessage("Country code must be between 2 and 5 characters long")
    .trim(),

  body("phoneNumber")
    .notEmpty()
    .withMessage("Phone number cannot be empty")
    .isString()
    .withMessage("Phone number must be a string")
    .isNumeric()
    .withMessage("Phone number must be numeric")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be exactly 10 digits long")
    .trim(),
];

exports.otpVerificationValidation = [
  body("otp").notEmpty().trim().withMessage("Please Enter the otp"),
];

exports.emailValidation = [
  body("email")
    .notEmpty()
    .trim()
    .withMessage("Please Enter the email address")
    .isEmail()
    .withMessage("Please enter the email address correctly"),
];

exports.firstNameValidation = [
  body("firstName")
    .notEmpty()
    .withMessage("Firstname must not be Empty")
    .isLength({ min: 3 })
    .withMessage("Firstname must not be less than 3 characters")
    .isString()
    .withMessage("Firstname must be a string")
    .trim()
];

exports.validateLocation = [
  body('lat')
    .notEmpty().withMessage('Latitude cannot be empty')
    .trim()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be a float between -90 and 90'),

  body('lon')
    .notEmpty().withMessage('Longitude cannot be empty')
    .trim()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be a float between -180 and 180'),
];

exports.validateGender = [
  body('gender')
    .notEmpty().withMessage('gender cannot be empty')
    .trim()
    .isString()
    .withMessage('gender can only be string values')
];

exports.validateSeeking = [
  body('seeking')
    .notEmpty().withMessage('seeking cannot be empty')
    .trim()
    .isString()
    .withMessage('seeking can only be string values')
];

exports.validateDOB = [
  body('dob')
    .notEmpty().withMessage('date of bith cannot be empty')
    .trim()
  // .isDate({ format: 'YYYY-MM-DD' })
  // .withMessage('Date of birth must be a valid date in YYYY-MM-DD format')
];

exports.validateUserData = [
  // body('lati').isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
  // body('long').isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
  body('interests').isString().withMessage('Interests must be a string').optional(),
  body('currentWork').isString().withMessage('Current work must be a string').optional(),
  body('school').isString().withMessage('School must be a string').optional(),
  // body('seeking').isString().withMessage('Seeking must be a string'),
  body('children').isInt({ min: 0 }).withMessage('Children must be a non-negative integer').optional(),
  body('astrologicalSign').isString().withMessage('Astrological sign must be a string').optional(),
  body('education').isString().withMessage('Education must be a string').optional(),
  body('bodyType').isString().withMessage('Body type must be a string').optional(),
  body('exercise').isString().withMessage('Exercise must be a string').optional(),
  body('smoker').isString().withMessage('Smoker status must be a string').optional(),
  body('marijuana').isString().withMessage('Marijuana status must be a string').optional(),
  body('dob').notEmpty().withMessage('date of bith cannot be empty').optional()
];

// exports.homeProfileValidation = [
//   body('maxDistance').notEmpty().withMessage('Max distance is required').isInt({ min: 1 }).withMessage('Max distance must be a positive integer'),
// ];

exports.completeProfileValidaion = [
  body('email').isEmail().withMessage('Email is invalid'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('long').isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
  body('lati').isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Gender is invalid'),
  body('seeking').isIn(['male', 'female', 'other']).withMessage('Seeking is invalid'),
  body('dob').isDate().withMessage('Date of birth is invalid'),
];

exports.blockedUserValidation = [
  body('blocked_user_id').isMongoId().withMessage('Invalid blocked user ID'),
];

exports.unblockedUserValidation = [
  body('blocked_user_id').isMongoId().withMessage('Invalid blocked user ID'),
];

exports.validateCreateReport = [
  body('blocked_user_id')
    .notEmpty().withMessage('Blocked User ID is required')
    .isMongoId().withMessage('Blocked User ID must be a valid Mongo ID'),
  body('reason')
    .notEmpty().withMessage('Reason is required')
    .isString().withMessage('Reason must be a string')
];

exports.likeActionValidation = [
  body('receiver_id')
    .notEmpty().withMessage('Receiver Id is required')
    .isMongoId().withMessage('Receiver Id must be a valid MongoDB ObjectId'),
    body('likeStatus')
    .notEmpty().withMessage('likeStatus is required')
];
