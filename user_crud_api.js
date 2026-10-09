// User CRUD API
// Node.js + Express + MongoDB + Mongoose

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

app.use(express.json());

// MongoDB Connection
mongoose
    .connect("mongodb://127.0.0.1:27017/dailyGithubDB")
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((error) => {
        console.log("MongoDB Error:", error);
    });

// User Schema
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        age: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

// User Model
const User = mongoose.model("User", userSchema);

// Home Route
app.get("/", (req, res) => {
    res.json({
        message: "User CRUD API is running"
    });
});

// CREATE USER
app.post("/users", async (req, res) => {
    try {
        const { name, email, age } = req.body;

        if (!name || !email || !age) {
            return res.status(400).json({
                message: "Name, email and age are required"
            });
        }

        const user = await User.create({
            name,
            email,
            age
        });

        console.log("User Created:", user);

        res.status(201).json({
            message: "User created successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            message: "Error creating user",
            error: error.message
        });
    }
});

// READ ALL USERS
app.get("/users", async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching users"
        });
    }
});

// READ SINGLE USER
app.get("/users/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(user);

    } catch (error) {
        res.status(400).json({
            message: "Invalid user ID"
        });
    }
});

// UPDATE USER
app.put("/users/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        console.log("User Updated:", user);

        res.status(200).json({
            message: "User updated successfully",
            user
        });

    } catch (error) {
        res.status(400).json({
            message: "Error updating user",
            error: error.message
        });
    }
});

// DELETE USER
app.delete("/users/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        console.log("User Deleted:", user);

        res.status(200).json({
            message: "User deleted successfully"
        });

    } catch (error) {
        res.status(400).json({
            message: "Invalid user ID"
        });
    }
});

// START SERVER
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
