const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const tokenString = req.headers['x-access-token'];

    if (!tokenString) {
        return res.status(403).send({
            success: false,
            message: "No Token is provided"
        });
    }

    const token = tokenString.split(' ')[1];

    jwt.verify(token, process.env.SECRET_KEY, async (err, payload) => {
        if (err) {
            return res.status(403).send({
                success: false,
                message: "Invalid JWT token"
            });
        }
        
        const userId = payload.userId;
        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: "User not found"
                });
            }
            req.userDetails = user;
            next();
        } catch (err) {
            console.error("Error fetching user:", err);
            return res.status(500).send({ 
                success: false,
                message: "Internal Server Error" 
            });
        }
    });
};

// Middleware to verify if the user is an admin
const verifyAdmin = (req, res, next) => {
    const userDetails = req.userDetails;
    if (!userDetails.isAdmin) {
        return res.status(403).send({
            success: false,
            message: "Authorization denied"
        });
    }
    next();
};

module.exports = {
    verifyToken,
    verifyAdmin
};
