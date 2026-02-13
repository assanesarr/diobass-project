'use server'

import { adminDb } from "@/lib/firebase-admin";

import { signIn, signOut } from "@/auth";
import { revalidatePath } from "next/cache";

export async function loadMouvement() {
    const snap = await adminDb.collection("mouvement").get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function loadClient() {
    const snap = await adminDb.collection("clients").get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

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

export type FormState = {
    success: boolean
    message: string
    error: string | null
}

export async function addMouvement(prevState: FormState | null, formData: FormData): Promise<FormState> {

    try {

        const formValues = { ...Object.fromEntries(formData.entries()) };
        if (!formValues.montant) return { success: false, message: "Le montant est obligatoire", error: "Le montant est obligatoire" };

        // await sleep(2000); // Simulate a delay for async operation
        await adminDb.collection("mouvement").add({
            ...formValues,
            /*  type: formData.get("type") as string,
             name: formData.get("libelle") as string,
             montant: Number(formData.get("montant")), */
            // Add other form fields as needed
            createdAt: Date.now(),
        });

        if (formData.get("type") === "encaissement") {

            const clientId = formData.get("clients") as string;
            if (!clientId) return { success: false, message: "Client ID is required", error: "Client ID is required" };



            if (formData.get("mode") === "NOUVEAU") {

                const netPaye = formData.get("montant_total") as string
                const montant = formData.get("montant") as string
                if (!netPaye) return { success: false, message: "Montant total requis pour les nouveaux dossiers", error: "Montant total requis pour les nouveaux dossiers" };
                if (Number(montant) > Number(netPaye)) return { success: false, message: "Montant doit être inférieur ou égal au montant total pour les nouveaux dossiers", error: "Montant doit être inférieur ou égal au montant total pour les nouveaux dossiers" };

                // const normalizedName = dossierName.trim().toLowerCase().replace(/\s+/g, '-');
                const dossierRef = adminDb.collection("dossiers")
                    .where("clientId", "==", clientId)
                    .where("dossierName", "==", formData.get("dossier_name") as string);


                const resps = await dossierRef.get();

                if (!resps.empty) { throw new Error("Un dossier avec ce nom existe déjà pour ce client."); } // const last = resps.docs.length > 0 ? resps.docs[resps.docs.length - 1].data().dossierRef : 0;

                // const next = last + 1;
                // const formatted = String(next).padStart(3, "0");
                const ref = adminDb.collection("dossiers").doc();
                const normalizedName = formData.get("dossier_name") as string;

                if (!normalizedName) return { success: false, message: "Le nom du dossier est requis pour les nouveaux dossiers.", error: "Le nom du dossier est requis pour les nouveaux dossiers." };


                // const normalizedName = normalizedName.concat(`-${normalizedName + 1}`);

                console.log("Number of existing dossiers for this client:", ref.id);
                await ref.set({
                    id: ref.id,
                    clientId: clientId,
                    dossierName: normalizedName.toUpperCase(),
                    montant_total: netPaye,
                    status: netPaye === montant ? "paid" : "pending",
                    versement: [
                        {
                            montant: montant,
                            method: formData.get("payment_method") as string,
                            date: Date.now(),
                        },
                    ],
                    mode: formData.get("mode") as string,
                    createdAt: Date.now(),
                });

            } else if (formData.get("mode") === "ACOMPTE") {

                // Adding versement to existing dossier 
                const dossierId = formData.get("dossier_name") as string;
                const dossierRef = adminDb.collection("dossiers")
                    .where("clientId", "==", clientId)
                    .where("id", "==", dossierId);

                const snapshot = await dossierRef.get();
                if (!snapshot.empty) {
                    const dossierDoc = snapshot.docs[0];
                    const versement = dossierDoc.data().versement || [];
                    const totalVersement = versement.reduce((sum: number, v: any) => Number(sum) + (Number(v.montant) || 0), 0);
                    const montant = formData.get("montant") as string;
                    const montantTotal = dossierDoc.data().montant_total || "0";

                    if (Number(totalVersement) + Number(montant) > Number(montantTotal)) {
                        return { success: false, message: "Le montant total des versements ne peut pas dépasser le montant total du dossier.", error: "Le montant total des versements ne peut pas dépasser le montant total du dossier." };
                    }
                    versement.push({
                        montant: montant,
                        method: formData.get("payment_method") as string,
                        date: Date.now(),
                    });

                    await adminDb.collection("dossiers").doc(dossierDoc.id).update({
                        versement: versement,
                        updatedAt: Date.now(),
                    });
                }
            }
        } else if (formData.get("type") === "decaissement") {
            const clientId = formData.get("clients") as string;
            if (!clientId) return { success: false, message: "Client ID is required", error: "Client ID is required" };

            const dossierId = formData.get("dossier_name") as string;
            const dossierRef = adminDb.collection("dossiers")
                .where("clientId", "==", clientId)
                .where("id", "==", dossierId);

            const snapshot = await dossierRef.get();
            if (!snapshot.empty) {
                const dossierDoc = snapshot.docs[0];
                const payement = dossierDoc.data().payements || [];
                const montant = formData.get("montant") as string;

                payement.push({
                    montant: montant,
                    payement: formData.get("payement") as string,
                    date: Date.now(),
                });

                await adminDb.collection("dossiers")
                    .doc(dossierDoc.id)
                    .update({
                        payements: payement,
                        updatedAt: Date.now(),
                    });
            }

            // Handle decaissement logic if needed TODO
        }
        revalidatePath("/dashboard/tables");
        revalidatePath("/dashboard/clients");
        revalidatePath("/dashboard");
        return { success: true, message: "Mouvement added successfully.", error: null };

    } catch (error) {
        console.error("Error adding mouvement:", error);
        return {
            error: error instanceof Error ? error.message : "An unknown error occurred.",
            success: false,
            message: error instanceof Error ? error.message : "An unknown error occurred.",
        }; // Rethrow the error to be caught by the caller
    }

}

export async function handleSignout(formData: FormData) {
    await signOut()
}

export async function addClient(prevState: FormState | null, formData: FormData): Promise<FormState> {

    // console.log("Form data received in addClient:", prevState); // Log the form data to see if it's being received correctly

    try {
        if (!formData.get("name")) {
            return { success: false, message: "Le nom du client est obligatoire.", error: "Le nom du client est obligatoire." };
        }
        const dossierRef = adminDb.collection("clients")
            .where("name", "==", formData.get("name") as string);

        const values = {
            name: formData.get("name") as string,
            // role: formData.get("role") as string,
            address: formData.get("address") as string,
            phone: formData.get("phone") as string,
            email: formData.get("email") as string,
            // avatar: formData.get("avatar") as string,
        };
        const resps = await dossierRef.get();

        if (!resps.empty) { throw new Error("Un client avec ce nom existe déjà."); }

        await adminDb.collection("clients").add({
            ...values,
            createdAt: Date.now(),
        });

        revalidatePath("/dashboard/clients");
        return { success: true, message: "Client added successfully.", error: null };
    } catch (error) {
        console.error("Error adding client:", error);
        return { success: false, message: error instanceof Error ? error.message : "An unknown error occurred.", error: error instanceof Error ? error.message : "An unknown error occurred." };
    }
}

export async function updateClient(formData: FormData) {

    try {
        const clientId = formData.get("id") as string;
        if (!clientId) return { success: false, message: "Client ID is required", error: "Client ID is required" };

        const values = {
            name: formData.get("name") as string,
            // role: formData.get("role") as string,
            address: formData.get("address") as string,
            phone: formData.get("phone") as string,
            email: formData.get("email") as string,
            // avatar: formData.get("avatar") as string,
            updatedAt: Date.now(),
        };

        await adminDb.collection("clients").doc(clientId).update(values);

        revalidatePath("/dashboard/clients");
        return { success: true, message: "Client updated successfully.", error: null };
    } catch (error) {
        console.error("Error updating client:", error);
        return { success: false, message: error instanceof Error ? error.message : "An unknown error occurred.", error: error instanceof Error ? error.message : "An unknown error occurred." };
    }
}

export async function deleteClient(clientId: string) {
   try {   await adminDb.collection("mouvements").where("clientId", "==", clientId).get().then((snapshot) => {
        snapshot.docs.forEach((doc) => {
            adminDb.collection("mouvements").doc(doc.id).delete();
        });
    });
    await adminDb.collection("dossiers").where("clientId", "==", clientId).get().then((snapshot) => {
        snapshot.docs.forEach((doc) => {
            adminDb.collection("dossiers").doc(doc.id).delete();
        });
    });
    await adminDb.collection("clients").doc(clientId).delete();

    revalidatePath("/dashboard/clients");
    
    return { success: true, message: "Client supprimé avec succès.", error: null }
   } catch (error) {
    console.error("Error deleting client:", error);
    return { success: false, message: error instanceof Error ? error.message : "An unknown error occurred.", error: error instanceof Error ? error.message : "An unknown error occurred." }
   }
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

