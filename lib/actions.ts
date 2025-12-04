'use server'

import { adminDb } from "@/lib/firebase-admin";
import { signIn, signOut } from "@/auth";
import { sleep } from "./utils";
import { revalidatePath } from "next/cache";

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

export async function deleteItem(formData: FormData) {

    const itemId = formData.get("id") as string;

    await adminDb.collection("mouvement").doc(itemId).delete();

    revalidatePath("/dashboard/tables");
}

export async function addMouvement(formData: FormData) {

    // await sleep(2000); // Simulate a delay for async operation
    await adminDb.collection("mouvement").add({
        ...Object.fromEntries(formData.entries()),
       /*  type: formData.get("type") as string,
        name: formData.get("libelle") as string,
        montant: Number(formData.get("montant")), */
        // Add other form fields as needed
        createdAt: Date.now(),
    });
    //console.log("form", formData)
    revalidatePath("/dashboard/tables");
    revalidatePath("/dashboard");
}

export async function handleSignout(formData: FormData) {
    await signOut()
}

export async function addClient(values: {
    name: string;
    role: string;
    address: string;
    phone: string;
    email: string;
    avatar: string;
}) {
    await adminDb.collection("clients").add({
        ...values,
        createdAt: Date.now(),
    });

    revalidatePath("/dashboard/clients");
}

export async function updateClient(formData: FormData) {

    const clientId = formData.get("id") as string;

   // console.log("Updating client:", clientId);

    const values = {
        name: formData.get("name") as string,
        role: formData.get("role") as string,
        address: formData.get("address") as string,
        phone: formData.get("phone") as string,
        email: formData.get("email") as string,
    };
      await adminDb.collection("clients").doc(clientId).update({
       ...values,
       updatedAt: Date.now(),
     });

    revalidatePath("/dashboard/clients");
}

export async function deleteClient(clientId: string) {
    await adminDb.collection("clients").doc(clientId).delete();
    revalidatePath("/dashboard/clients");
}

