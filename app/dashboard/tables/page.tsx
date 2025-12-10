import { adminDb } from "@/lib/firebase-admin";
import { DataTable } from "../components/data-table";
import data from "@/app/dashboard/data.json"

async function loadMouvement() {
    const snap = await adminDb.collection("mouvement").get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
async function loadClient() {
    const snap = await adminDb.collection("clients").get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export default async function TablesPage() {



    const fetchData = await loadMouvement().then(data => data);
    const clients = await loadClient().then(data => data);

    // fetchData.map(item => {

    //     item['client'] = client ? client : 'Unknown';
    //     console.log("client", item);
    // });

    fetchData.sort((a, b) => b.createdAt - a.createdAt);

    // const mouvementData = fetchData
    //     .map(m => ({
    //         ...m,
    //         montant: m.type === 'decaissement' ? -Math.abs(m.montant) : Math.abs(m.montant)
    //     }))

    return (
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <DataTable initialData={fetchData} clients={clients} />
            </div>
        </div>
    );
}