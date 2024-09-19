import { connectToDB } from '@/utils/database';
import bcrypt from 'bcryptjs';

import User from '@/model/user';
import { createToken, verifyToken } from '../../../utils/token';

export const POST = async (req) => {
    try {
        const { username, password } = await req.json();
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt)

        console.log({ username, password })

        await connectToDB();

        // Check for missing fields
        if (!username || !password) {
            return new Response(JSON.stringify({
                message: 'Username and password are required'
            }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }


        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return new Response(JSON.stringify({
                message: 'username is already taken'
            }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const user = new User({
            username,
            password: hashedPassword
        });
        await user.save();

        const token = createToken(user);
        const decoded = verifyToken(token);


        return new Response(JSON.stringify({
            message: 'user created successfully!',
            userToken: decoded
        }), {
            status: 201, headers: {
                "Set-Cookie": `userToken=${token}; secure; HttpOnly; SameSite=None`,
                "Content-Type": "application/json",
            }
        });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({
            message: 'Error creating user',
            error: error.message
        }), {
            status: 500, headers: {
                "Content-Type": "application/json"
            }
        });
    }
}