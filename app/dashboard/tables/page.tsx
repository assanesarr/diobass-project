import { adminDb } from "@/lib/firebase-admin";
import { DataTable } from "../components/data-table";
import data from "@/app/dashboard/data.json"

export default async function TablesPage() {
    let fetchData: any = [];
    async function loadPosts() {
        const snap = await adminDb.collection("mouvement").get();
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

   await loadPosts().then(data => fetchData = data);

   console.log("fetchData in page.tsx", fetchData);

    return (
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <DataTable data={data} />
            </div>
        </div>
    );
}