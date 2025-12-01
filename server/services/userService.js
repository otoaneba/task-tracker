import { UserModel } from "../models/userModel.js";
import { ValidationError, AlreadyExistsError, AuthenticationError } from "../utils/errors.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserService = {
  signup: async function({email, password, username}) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError("Invalid email address");
    }

    if (!password || password.length < 8) {
      throw new ValidationError("Password must be at least 8 characters long");
    }

    if (username) {
      username = username.trim() || null;
    }

    const emailExists = await UserModel.findByEmail(email);
    if (emailExists) {
      throw new AlreadyExistsError("Email already registered", { email });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserModel.createUser({email, passwordHash, username});
    
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      }
    }
  },
  login: async function({ email, password }) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError("Invalid email address");
    }

    if (!password) {
      throw new ValidationError("Password is required");
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new AuthenticationError("Invalid email or password"); // return same error as below to avoid leaking information
    }

    const passwordHash = user.password_hash;
    const isPasswordValid = await bcrypt.compare(password, passwordHash);

    if (!isPasswordValid) { 
      throw new AuthenticationError("Invalid email or password"); // return same error as above to avoid leaking information
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      }
    }
  }
}