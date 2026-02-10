"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { handleSubmit } from "@/lib/actions"
import { toast } from "sonner";
import InstallButton from "./install-button"



const login = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const form = new FormData(e.currentTarget as HTMLFormElement);
  await handleSubmit(form)
  .catch((error) => {
    toast.error("Login failed. Please check your credentials and try again.");
  })
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={login} >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email or phone below to login to your account
            <InstallButton />
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email or phone</FieldLabel>
          <Input id="email" name="email" type="text" placeholder="m@example.com or 123-456-7890" required />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input id="password" type="password" name="password" required />
        </Field>
        <Field>
          <Button type="submit" variant="outline"  className="w-full">
            Login
          </Button>
        </Field>       
      </FieldGroup>
    </form>
  )
}