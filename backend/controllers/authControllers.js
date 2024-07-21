import { User } from '../models/userModel.js';
import bcryptjs from 'bcryptjs';
import { generateTokenAndSetCookie } from '../utils/generateToken.js';

export async function signup(req, res) {
    try {
        const { username, email, password } = req.body;
        if(!username ||!email ||!password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const emailRegex =/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        if(password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }

        const existingUserByEmail = await User.findOne({ email });
        if(existingUserByEmail) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const existingUserByUsername = await User.findOne({ username });
        if(existingUserByUsername) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];
        const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            image,
        })

        generateTokenAndSetCookie(newUser._id, res);
        await newUser.save();

        return res.status(201).json({
            success: true,
            user: {
                ...newUser._doc,
                password: "", // remove password from response
            }
        })
        
    } catch (error) {
        console.log("Error while signing up: ", error.message);
        res.status(500).json({ error: 'Server error' });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if(!email ||!password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const user = await User.findOne({ email });
        if(!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        generateTokenAndSetCookie(user._id, res);

        return res.status(200).json({
            success: true,
            user: {
                ...user._doc,
                password: "", // remove password from response
            }
        });
    } catch (error) {
        console.log("Error while logging in: ", error.message);
        res.status(500).json({ error: 'Server error' });
    }
}

export async function logout(req, res) {
   try {
    res.clearCookie('jwt-netflix');
    res.status(200).json({ success: true });
   } catch (error) {
    console.log("Error while logging out: ", error.message);
    res.status(500).json({ error: 'Server error' });
   }
}

export async function authCheck(req, res) {
    try {
        res.status(200).json({ success: true, user: req.user });
    } catch (error) {
        console.log("Error while checking auth: ", error.message);
        res.status(500).json({ error: 'Server error' });
    }
}