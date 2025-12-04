"use client"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import FooterUser from "./user-footer";
import { IconPencil } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import TrashComponent from "./trash";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Save, SaveAll } from "lucide-react";
import { updateClient } from "@/lib/actions";

export type User = {
    id: string;
    name: string;
    role: string;
    address: string;
    phone: string;
    email: string;
    avatar: string;
};

export default function CardUser({ user }: { user: User }) {

    const [editMode, setEditMode] = useState(false);

    return (
        <Card className="w-xs bg-white">
            <CardHeader className="">
                <div className="flex gap-2 justify-end">
                    {!editMode && (<Button variant="secondary" onClick={() => setEditMode(true)}><IconPencil /></Button>)}
                    {!editMode && <TrashComponent user={user} />}
                </div>
                <div className="photo-wrapper p-2">
                    <img className="w-32 h-32 rounded-full mx-auto" src={user.avatar} alt="John Doe" />
                </div>
            </CardHeader>
            <CardContent>
                <form action={updateClient}>
                    {editMode && <input type="hidden" name="id" value={user.id} />}
                    {editMode ? <Input name="name" defaultValue={user.name} /> : (<h3 className="text-center text-xl font-medium leading-8">{user.name}</h3>)}
                    <div className="text-center text-gray-400 text-xs font-semibold">
                        <p>{editMode ? <Input name="role" defaultValue={user.role} /> : user.role}</p>
                    </div>
                    <table className="text-xs my-3">
                        <tbody>
                            <tr>
                                <td className="px-2 py-2 text-gray-500 font-semibold">Address</td>
                                <td className="px-2 py-2">{editMode ? <Input name="address" defaultValue={user.address} /> : user.address}</td>
                            </tr>
                            <tr>
                                <td className="px-2 py-2 text-gray-500 font-semibold">Phone</td>
                                <td className="px-2 py-2">{editMode ? <Input name="phone" defaultValue={user.phone} /> : user.phone}</td>
                            </tr>
                            <tr>
                                <td className="px-2 py-2 text-gray-500 font-semibold">Email</td>
                                <td className="px-2 py-2">{editMode ? <Input name="email" defaultValue={user.email} /> : user.email}</td>
                            </tr>
                        </tbody>
                    </table>
                    <CardFooter className="flex justify-center my-3">
                        {editMode ? (<><Button variant="outline" ><Save /> Enregistre</Button> </>) : <FooterUser user={user} />}
                    </CardFooter>
                </form>
            </CardContent>
        </Card >
    );
}