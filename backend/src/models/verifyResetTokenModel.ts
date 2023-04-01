import mongoose, { Schema, Document } from "mongoose";

export interface IVerifyResetToken extends Document {
  _userId: mongoose.Schema.Types.ObjectId;
  token: string;
  createdAt: Date;
}

const verifyResetTokenSchema = new Schema<IVerifyResetToken>({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 900,
  },
});

const VerifyResetToken = mongoose.model<IVerifyResetToken>("VerifyResetToken", verifyResetTokenSchema);

export default VerifyResetToken;
