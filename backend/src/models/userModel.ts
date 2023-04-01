import bcrypt from "bcryptjs";
import "dotenv/config";
import mongoose, { Document, Schema } from "mongoose";
import validator from "validator";
import { USER, ADMIN } from "../constants/index.js";

export interface IUser extends Document {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  passwordConfirm?: string;
  isEmailVerified: boolean;
  provider: String;
  googleId?: string;
  avatar?: string;
  businessName?: string;
  phoneNumber: string;
  address?: string;
  city?: string;
  country?: string;
  passwordChangedAt?: Date;
  roles: string[];
  active: boolean;
  refreshToken?: string[];
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: function (value: string) {
          return /^[A-z][A-z0-9-_]{3,23}$/.test(value);
        },
        message: "username must be alphanumeric, without special characters. Hyphens and underscores are allowed.",
      },
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      validate: [validator.isAlphanumeric, "Please provide a valid first name"],
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      validate: [validator.isAlphanumeric, "Please provide a valid last name"],
    },
    password: {
      type: String,
      select: false,
      required: true,
      validate: [
        validator.isStrongPassword,
        "Password must be at least 8 characters long, with at least 1 uppercase and lowercase letters and at least 1 symbol",
      ],
    },
    passwordConfirm: {
      type: String,
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    provider: {
      type: String,
      required: true,
      default: "email",
    },
    googleId: String,
    avatar: String,
    businessName: String,
    phoneNumber: {
      type: String,
      default: "+84123456789",
      validate: [validator.isMobilePhone, "Your phone number must begin with a '+' followed by your country code"],
    },
    address: String,
    city: String,
    country: String,
    passwordChangedAt: Date,
    roles: {
      type: [String],
      default: [USER],
    },
    active: {
      type: Boolean,
      default: true,
    },
    refreshToken: [String],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.password && this.passwordConfirm) {
    if (this.password !== this.passwordConfirm) {
      throw Error("Password and Confirm password did not match");
    }
  }
  next();
});

userSchema.pre("save", async function (next) {
  if (this.roles.length === 0) {
    this.roles.push(USER);
    next();
  }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

userSchema.methods.comparePassword = async function (givenPassword: string) {
  return await bcrypt.compare(givenPassword, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
