const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

exports.signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!validator.isEmail(email)) {
        return res.status(400).json({message: "Invalid email format",});
        }
        if (!validator.isStrongPassword(password, { 
            minLength: 6,
            minUppercase: 1,
            minNumbers: 1,
            minLowercase: 1,
            minSymbols: 0, })) {
        return res.status(400).json({message:"Password must be at least 6 characters long and include one uppercase letter, one lowercase letter and one number",});
        }

        const userExists = await User.findOne({ email});
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, password: hashedPassword});
        await newUser.save();

        res.status(201).json({ message: "User created successfully"});
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log("Error signing up", error.message);
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: user.id },process.env.PRIVATE_KEY,{ expiresIn: "1d" } );
        res.cookie("token", token, { httpOnly: true,secure: false,sameSite: "lax", expires: new Date(Date.now() + 24 * 60 * 60 * 1000) });

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
        if (user) {  
              console.log("User logged in:", user.email);
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("Error logging in", error.message);
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("Error getting profile", error.message);
    }
} 

exports.logout = (req, res) => {
    
    res.clearCookie("token", {httpOnly: true,secure: false,sameSite: "lax", });
    return res.status(200).json({
      message: "Logout successful",
    });
};

