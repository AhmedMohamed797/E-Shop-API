import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import slugify from 'slugify';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, 'User email is required'],
      unique: [true, 'User email must be unique'],
    },
    password: {
      type: String,
      required: [true, 'User password is required'],
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    profileImg: String,
    role: {
      type: String,
      enum: ['user', 'admin', 'manager'],
      default: 'user',
    },
    active: {
      type: Boolean,
      default: true,
    },
    // Child reference [one to many] Parent stores child IDs
    wishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
      },
    ],
    // Embed Document
    addresses: [
      {
        alias: String,
        city: String,
        details: String,
        phone: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function () {
  // Encrypt only when create new account
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.pre('save', function () {
  this.slug = slugify(this.name, { trim: true, lower: true });
});

const setImgURl = (doc) => {
  if (doc.profileImg) {
    const imageURL = `${process.env.BASE_URL}/users/${doc.profileImg}`;
    doc.profileImg = imageURL;
  }
};

userSchema.post('init', (doc) => {
  setImgURl(doc);
});

userSchema.post('save', (doc) => {
  setImgURl(doc);
});

const User = mongoose.model('User', userSchema);

export default User;
