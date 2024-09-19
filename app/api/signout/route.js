export const GET = (req, res) => {
    try {
        console.log("cookie cleared");

        // Clear the `userToken` cookie
        return new Response("Successfully logged out", {
            status: 200,
            headers: {
                "Set-Cookie": `userToken=; Max-Age=0; path=/; HttpOnly; Secure; SameSite=None`,
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        console.log(error);
        return new Response("Failed to log out", {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}