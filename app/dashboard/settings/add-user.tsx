import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { addUser } from "@/lib/actions"

export function AddUser() {
    return (
        <Dialog>

            <DialogTrigger asChild>
                <Button variant="outline" className="mt-4">Add User</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form action={addUser}>
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you&apos;re
                            done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name-1">Name</Label>
                            <Input id="name-1" name="name"  />
                        </div>
                        <Select name="role" defaultValue="user">
                            <SelectTrigger >
                                <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="user">USER</SelectItem>
                                    <SelectItem value="editor">EDITOR</SelectItem>
                                    <SelectItem value="admin">ADMIN</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <div className="grid gap-3">
                            <Label htmlFor="email">Email or Phone</Label>
                            <Input id="email" name="email" />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>

        </Dialog>
    )
}
