import { connectToDB } from '@/utils/database';
import bcrypt from 'bcryptjs';

import User from '@/model/user';
import { createToken, verifyToken } from '../../../utils/token';

export const POST = async (req) => {
    try {
        const { username, password } = await req.json();

        await connectToDB();
        const user = await User.findOne({ username });

        if (!user) return new Response('username does not exist', { status: 404 });

        const isPasswordValid = bcrypt.compareSync(password, user.password)
        if (!isPasswordValid) return new Response('wrong password please try again', { status: 401 });

        const token = createToken(user);
        const decoded = verifyToken(token);

        return new Response(JSON.stringify({
            message: "sign in successful",
            userToken: decoded
        }), {
            status: 200, headers: {
                "Set-Cookie": `userToken=${token}; secure; HttpOnly; SameSite=None`,
                "Content-Type": "application/json",
            }
        });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({
            message: "error signing in",
            error: error.message
        }), {
            status: 500, headers: {
                "Content-Type": "application/json"
            }
        });
    }
}