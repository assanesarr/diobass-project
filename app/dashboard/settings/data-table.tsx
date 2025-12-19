import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { AddUser } from "./add-user";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { deleteUser } from "@/lib/actions";

export default function TableUsers(
    { users }:
        {
            users: Array<{
                id: string;
                name: string;
                role: string;
                email: string
            }>
        }) {


    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Users</h2>
                    <p className="text-muted-foreground">
                        Gérer les utilisateurs et leurs rôles.</p>
                </div>
                <AddUser />
            </div>
            <Table>
                {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                <TableHeader>
                    <TableRow>
                        <TableHead >Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell className="text-right flex gap-2 justify-end">
                                <Button variant="outline" size="icon">
                                    <IconEdit />
                                </Button>
                                <form action={deleteUser}>
                                    <input type="hidden" name="id" value={user.id} />
                                    <Button variant="destructive" size="icon" >
                                        <span className="sr-only">Delete</span>
                                        <IconTrash />
                                    </Button>
                                </form>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}