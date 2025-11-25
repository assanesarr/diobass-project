"use client"
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
import { SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar"
import { IconCirclePlusFilled } from "@tabler/icons-react"
import { handleClick } from "@/lib/actions"
import { useFormStatus } from "react-dom"
import { Spinner } from "./ui/spinner"
import React, { useEffect, useTransition } from "react"

export function DialogSaisis() {
    const [type, setType] = React.useState<"encaissement" | "decaissement">("encaissement")
    const { pending } = useFormStatus()
    const [isPending, startTransition] = useTransition()

    console.log("pending", isPending)

    useEffect(() => {
        console.log("Type changed:", pending);
    }, [pending]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <SidebarMenuItem className="flex items-center gap-2">
                    <SidebarMenuButton
                        tooltip="Quick Create"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear cursor-pointer"
                        onClick={() => setType("encaissement")}
                    >
                        <IconCirclePlusFilled />
                        <span>Encaissement</span>
                    </SidebarMenuButton>
                    <SidebarMenuButton
                        tooltip="Quick Create"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear cursor-pointer"
                        onClick={() => setType("decaissement")}
                    >
                        <IconCirclePlusFilled />
                        <span>Decaissement</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form action={handleClick} className="grid gap-4">
                    <input type="hidden" name="type" value={type} />
                    <DialogHeader>
                        <DialogTitle className={type === "decaissement" ? "text-red-600" : "text-green-600"}>Operation {type} </DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you&apos;re
                            done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name-1">Name</Label>
                            <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="montant-1">Montant</Label>
                            <Input id="montant-1" name="montant" defaultValue="120000" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="target">Target</Label>
                                <Input id="target" name="target"  />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="limit">Limit</Label>
                                <Input id="limit" name="limit" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={pending}> {pending && <Spinner className="size-4" />}Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
