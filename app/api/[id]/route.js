import { connectToDB } from '@/utils/database';
import User from '@/model/user';

export const GET = async (req, { params }) => {
    try {
        await connectToDB();
        const user = await User.findById(params.id);

        if (!user) return new Response('user not found!', { status: 404 });

        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response("Failed to create user", { status: 500 });
    }
}

export const DELETE = async (req, { params }) => {
    try {
        await connectToDB();
        const user = await User.findByIdAndDelete(params.id);

        if (!user) return new Response('user not found!', { status: 404 });

        return new Response('user deleted successfully!', { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response("Failed to create user", { status: 500 });
    }
}