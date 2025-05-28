import {Clerk }from "@clerk/clerk-js";


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerk = new Clerk(PUBLISHABLE_KEY);
await clerk.load();

export async function isAuthenticated(): Promise<boolean> {
    await clerk.load();
    return clerk.user !== null && clerk.user !== undefined;
}
