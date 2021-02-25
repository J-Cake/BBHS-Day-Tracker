import User from "./user";

export default function decodeKey(key: string): User {
    const user: User = new User();

    return user;
}
