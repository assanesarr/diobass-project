import CardUser, { User } from "./components/card-user";
import AddBtn from "./components/Add-btn";
import { adminDb } from "@/lib/firebase-admin";



export default async function ClientsPage() {

    const clinets = await adminDb.collection("clients").orderBy("createdAt").get().then((snapshot) => {
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }) as User[];

    return (
        <div className="@container/main flex flex-1 flex-col gap-2 p-4 md:gap-6 md:py-6">
            <div className="flex justify-between  gap-4 py-4 md:gap-6 md:py-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
                    <p className="text-muted-foreground">Manage your clients</p>
                </div>
                <div className="flex gap-2">
                    <AddBtn />
                </div>
            </div>
            <div className="flex justify-center flex-wrap gap-4">
                { 
                    clinets.map((client: User) => (
                        <CardUser key={client.id} user={client} />
                    ))
                }
            </div>
        </div>
    );
}