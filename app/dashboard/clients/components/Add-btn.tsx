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
import { useState } from "react";


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

    const form = useForm({
        defaultValues: {
            name: "",
            role: "",
            address: "",
            phone: "",
            email: "",
            avatar: "https://www.gravatar.com/avatar/4acfb745ecf9d4dccb3364752d17f65f?s=260&d=mp",
        },
        validators: {
            onSubmit: formSchema,
        },
        onSubmit: async ({ value }) => {
            await addClient(value);
            form.reset();
            toast.success("Client added successfully!")
            setOpen(false);
        },
    })


    return (

        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button variant="outline" size="sm">
                    <IconPlus />
                    <span className="hidden lg:inline">Ajouter</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ajouter un client</DialogTitle>
                </DialogHeader>
                <FieldSet>
                    <form
                        id="bug-report-form"
                        onSubmit={(e) => {
                            e.preventDefault()
                            form.handleSubmit()
                        }}
                    >
                        <FieldGroup>
                            
                            <form.Field
                                name="name"
                                children={(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                                placeholder="John Doe"
                                            />

                                            {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                        </Field>
                                    )
                                }}
                            />

                            <form.Field
                                name="role"
                                children={(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                                placeholder="Web Developer"
                                            />

                                            {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                        </Field>
                                    )
                                }}
                            />
                            <form.Field
                                name="address"
                                children={(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Adresse</FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                                placeholder="Chatakpur-3, Dhangadhi Kailali"
                                            />

                                            {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                        </Field>
                                    )
                                }}
                            />
                            <form.Field
                                name="phone"
                                children={(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                                placeholder="+221 781535413"
                                            />

                                            {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                        </Field>
                                    )
                                }}
                            />
                            <form.Field
                                name="email"
                                children={(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                                placeholder="m@gmail.com"
                                            />

                                            {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                        </Field>
                                    )
                                }}
                            />
                            <form.Field
                                name="avatar"
                                children={(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Photo URL</FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                                placeholder="https://www.gravatar.com/avatar/4acfb745ecf9d4dccb3364752d17f65f?s=260&d=mp"
                                            />

                                            {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                        </Field>
                                    )
                                }}
                            />

                        </FieldGroup>
                    </form>
                </FieldSet>
                <DialogFooter>
                    <Field orientation="horizontal">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" className="btn btn-primary" form="bug-report-form">Save changes</Button>
                    </Field>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}