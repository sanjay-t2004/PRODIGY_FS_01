import { connectToDB } from '@/utils/database';
import User from '@/model/user';

export const GET = async (req) => {
    try {
        await connectToDB();
        const users = await User.find();

        if (!users || users.length === 0) return new Response('no users found!', { status: 404 });

        return new Response(JSON.stringify(users), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response("Failed to fetch users", { status: 500 });
    }
}