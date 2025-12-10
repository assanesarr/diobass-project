'use server'

import { adminDb } from "@/lib/firebase-admin";

import { signIn, signOut } from "@/auth";
import { revalidatePath } from "next/cache";

export async function handleSubmit(formData: FormData) {

    const email = formData.get('email')
    const password = formData.get('password')

    // console.log("Form data received in handleSubmit:", { email, password });

    await signIn("credentials", {
        email: email as string,
        password: password as string,
        callbackUrl: "/dashboard",
    });

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


export async function addUser(formData: FormData) {

    const usersRef = adminDb.collection("users");

    await adminDb.runTransaction(async (transaction) => {
        // 1) Vérifier si email existe déjà
        const q = usersRef.where("email", "==", formData.get("email"));
        const snapshot = await transaction.get(q);

        if (!snapshot.empty) {
            throw new Error("Cet email existe déjà.");
        }

        // 2) Ajouter l’utilisateur
        const docRef = usersRef.doc();
        transaction.set(docRef, { ...Object.fromEntries(formData.entries()), createdAt: Date.now() });

        return docRef.id;
    });

    // await sleep(2000); // Simulate a delay for async operation
    // await adminDb.collection("users").add({
    //     ...Object.fromEntries(formData.entries()),
    //     createdAt: Date.now(),
    // });
    revalidatePath("/dashboard/settings");
}

export async function deleteUser(formData: FormData) {
    const userId = formData.get("id") as string;
    if (!userId) return;
    // await adminDb.collection("users").where("email", "==", formData.get("email"))
    const usersRef = adminDb.collection("users").doc(userId);
    const list = await adminDb.collection("users").get().then((snapshot) => {

        return snapshot.docs.filter((doc) => (doc.data().role === "admin" && { id: doc.id, ...doc.data() }) as
            { id: string; name: string; role: string; email: string });
    });

    const u = await usersRef.get()
    // if (list.length === 1 ) return;

    const data = u.data();
    if (list.length === 1 && data?.role === "admin") return;

    // console.log(u.data())

    await usersRef.delete();
    revalidatePath("/dashboard/settings");
}

