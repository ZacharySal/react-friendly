import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { uploadFile } from "../s3.js";

/* REGISTER USER */
export const register = async (req, res) => {
    try {
        const file = req.file;
        const result = await uploadFile(file);
        const {
            firstName,
            lastName,
            email,
            password,
            friends,
            location,
            occupation
        } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        /* TODO: add default picture path is none is provided*/

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            pictureKey: result.Key,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 1000),
            impressions: Math.floor(Math.random() * 1000),
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email }).populate("friends");
        if (!user) return res.status(400).json({ msg: "Sorry, account not found. Please try again." });

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) return res.status(400).json({ msg: "Invalid credentials. Please try again." });

        const token = jwt.sign({ id: user._id, }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}; 