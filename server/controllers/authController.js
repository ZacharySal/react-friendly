import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma/prisma.js";
import { uploadFile } from "../s3.js";

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    let result;
    if (req.file) {
      const file = req.file;
      result = await uploadFile(file);
    }

    const { firstName, lastName, displayName, email, password } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const savedUser = await prisma.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        display_name: displayName,
        email: email.toLowerCase(),
        password: passwordHash,
        profile_img_key: req.file ? result.Key : "f516ddf3458951425013d41b0a9742b0",
        banner_img_key: null,
        location: null,
        biography: null,
      },
    });

    res.status(201).json(savedUser);

    // what if email already exists?
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const updatedEmail = email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email: updatedEmail,
      },
      include: {
        friends: {
          include: {
            friend: true,
          },
        },
        posts: true,
      },
    });

    if (!user) return res.status(400).json({ msg: "Sorry, account not found. Please try again." });

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch)
      return res.status(400).json({ msg: "Invalid credentials. Please try again." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};
