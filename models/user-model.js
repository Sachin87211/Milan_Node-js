const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  mediaUrl: { type: String},
  mimeType: { type: String},
  thumbnail: { type: String },
  cloudnairy_link: { type: String },
});


const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      // unique: true,
    },
    emailVerficationStatus: {
      type: Boolean,
      default: false,
    },
    phoneNumber: {
      type: String,
      unique: true,
      required : true,
    },
    phoneNumberVerficaionStatus: {
      type: String,
      default: false,
    },
    countryCode: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 5
    },
    facebook_login_id: {
      type: Number,
    },
    apple_login_id: {
      type: Number,
    },
    google_login_id: {
      type: Number,
    },
    otp: {
      type: String,
      // default: "1234",
    //   required: true,
    },
    profile_status: {
      type: Number,
      default: 0,
    },
    exercise: {
      type: String,
      default: "Never",
      },
    firstName: {
      type: String,
      // required: true,
    },
    gender: {
      type: String,
      // enum: ["male", "female"],
      // required: true,
    },
    is_reported: {
      type: Boolean,
      default: false,
    },
    interests: {
      type: [String],
      // enum: ['travelling','books','music','dancing','modeling']
    },
    lati: {
      type: Number,
    },
    long: {
      type: Number,
    },
    location: {
      type: {type: String},
      coordinates: []
    },
    currentWork: {
      type: String,
    },
    seeking: {
      type: [String],
      // enum: ["male", "female"],
      // required:true
    },
    minAge: {
      type: Number,
      default: 18
    },
    maxAge: {
      type: Number,
      default: 60
    },
    seeking_profile_status: {
      type: Boolean,
      default: false,
    },
    pets: {
      type: [String],
      default: []
    },
    children: {
      type: String,
      default: ''
    },
    education: {
      type: String,
    },
    school: {
      type: String,
    },
    astrologicalSign: {
      type: String,
      default: ''
    },
    dob: {
      type: Date,
      // required:true
    },
    religion: {
      type: String,
      default:""
    },
    height: {
      type: Number,
      default:70
    },
    verify_profile_status: {
      type: Boolean,
      default: false
    },
    // age: {
    //   type: Number,
    // },
    bodyType: {
      type: String,
    },
    drink: {
      type: String,
      default: 'Never',
    },
    smoker: {
      type: String,
      default: 'Never',
    },
    marijuana: {
      type: String,
      default: 'Never',
    },
    about_me: {
      type: String,
      default: ""
    },
    looking_for: {
      type: [String],
      default: []
    },
    distance_preferences: {
      type: Number,
      default: 25000
    },
    url: [imageSchema],
    blocked_count: {
      type: Number,
      default: 0,
    },
    blocked_status: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

userSchema.index({location:"2dsphere"});
module.exports = mongoose.model("users", userSchema);
