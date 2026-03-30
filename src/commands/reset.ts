import { deleteUsers } from "src/lib/db/queries/users.js";

export async function handlerReset(cmdName: string, ...args: string[]) {
    const count = await deleteUsers();
    console.log(`Database successfully reset! (${count} ${count === 1 ? "user" : "users"} deleted)`);
}