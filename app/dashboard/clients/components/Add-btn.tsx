"use client"
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form"
import { IconPlus } from "@tabler/icons-react";
import * as z from "zod"
import { toast } from "sonner"
import { addClient } from "@/lib/actions";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { useFormState, useFormStatus } from "react-dom";
import { Spinner } from "@/components/ui/spinner";


const formSchema = z.object({
    name: z
        .string()
        .min(5, "Bug title must be at least 5 characters.")
        .max(52, "Bug title must be at most 32 characters."),
    role: z
        .string(),
    address: z
        .string()
        .min(5, "Bug title must be at least 5 characters.")
        .max(52, "Bug title must be at most 32 characters."),
    phone: z
        .string(),
    email: z
        .email("Please enter a valid email address."),
    avatar: z
        .string(),

})

const forms = [
    {
        name: "name",
        label: "Name",
        placeholder: "John Doe",
    },
    {
        name: "role",
        label: "Title",
        placeholder: "Web Developer",
    },
    {
        name: "address",
        label: "Adresse",
        placeholder: "Chatakpur-3, Dhangadhi Kailali",
    },
    {
        name: "phone",
        label: "Phone",
        placeholder: "+221 781535413",
    },
    {
        name: "email",
        label: "Email",
        placeholder: "m@gmail.com",
    },
    {
        name: "avatar",
        label: "Photo URL",
        placeholder: "https://www.gravatar.com/avatar/4acfb745ecf9d4dccb3364752d17f65f?s=260&d=mp",
    },
]

export default function AddBtn() {
    const [open, setOpen] = useState(false);
      const [state, formAction] = useFormState(addClient, null)
    
    useEffect(() => {
        if (state?.success) {
            toast.success("Client added successfully!");
            setOpen(false);
        } else if (state?.error) {
            toast.error("Failed to add client: " + state?.error);
        }   
    }, [state]);
      console.log("Form state:", state) // Log the form state to see if it's updating correctly

    return (

        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button variant="outline" size="sm">
                    <IconPlus />
                    <span className="hidden lg:inline">Ajouter</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                { state && state.error && <div className="text-red-500 mb-4">{state.error}</div> }
                <form action={formAction}>
                    <DialogHeader>
                        <DialogTitle>Ajouter un client</DialogTitle>
                    </DialogHeader>
                    <div className="grid w-full items-center gap-4 py-4">
                        <Label>Name</Label>
                        <Input name="name" placeholder="John Doe" />
                    </div>
                    <div className="grid w-full items-center gap-4 py-4">
                        <Label>Adresse</Label>
                        <Input name="address" placeholder="Chatakpur-3, Dhangadhi Kailali" />
                    </div>
                    <div className="grid w-full items-center gap-4 py-4">
                        <Label>Phone</Label>
                        <Input name="phone" placeholder="+221 781535413" />
                    </div>
                    <div className="grid w-full items-center gap-4 py-4">
                        <Label>Email</Label>
                        <Input name="email" placeholder="m@gmail.com" />
                    </div>
                    {/* <div className="grid w-full items-center gap-4 py-4">
                        <Label>Photo URL</Label>
                        <Input name="avatar" placeholder="https://www.gravatar.com/avatar/4acfb745ecf9d4dccb3364752d17f65f?s=260&d=mp" />
                    </div> */}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <BtnSave />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    );
}

const BtnSave = () => { 
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending}>
            {pending ? <Spinner /> : "Enregistrer"}
        </Button>
    )
}