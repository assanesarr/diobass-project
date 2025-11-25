'use server'

import { adminDb } from "@/lib/firebase-admin";
import { signIn, signOut } from "@/auth";
import { sleep } from "./utils";

export async function handleSubmit(formData: FormData) {

    const email = formData.get('email')
    const password = formData.get('password')

    await signIn("credentials", {
        email: email as string,
        password: password as string,
        callbackUrl: "/dashboard",
    });

    // console.log("SignIn response:", res);

    // Perform login logic here, e.g., call an authentication API
    // const response = await authenticateUser(email, password)

    // Update data
    // Revalidate cache
}

export async function handleClick(formData: FormData) {

    formData.entries().forEach(([key, value]) => {

        console.log(`{${key}: ${value}}`);
    });

  // await sleep(2000); // Simulate a delay for async operation
   await adminDb.collection("mouvement").add({
    type : formData.get("type") as string,
    name: formData.get("name") as string,
    montant: Number(formData.get("montant")),
    // Add other form fields as needed
    createdAt: Date.now(),
  });
    //console.log("form", formData)
}

export async function handleSignout(formData: FormData) {
    await signOut()
}

