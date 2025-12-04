import { ChartAreaInteractive } from "@/app/dashboard/components/chart-area-interactive"
import { DataTable } from "@/app/dashboard/components/data-table"
import { SectionCards } from "@/app/dashboard/components/section-cards"
import { adminDb } from "@/lib/firebase-admin"
import DashboardItems from "./components/dashboard-items"

export default async function DashboardPage() {

  const mouvements = await adminDb.collection("mouvement").get().then((snapshot) => {
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  });

  const decaissement = mouvements.filter(m => m.type === 'decaissement' && new Date(m.createdAt).getFullYear() === new Date().getFullYear());
  const totalDebit = decaissement.reduce((acc, m) => acc + Number(m.montant), 0);


  const encaissement = mouvements.filter(m => m.type === 'encaissement');
  const totalCredit = encaissement.reduce((acc, m) => acc + Number(m.montant), 0);


  const solde = totalCredit - totalDebit;
  const dataMouvements = { solde, totalDebit, totalCredit };
  // const totalCredit = mouvements.reduce((acc, m) => acc + m.encaissement, 0);
  // console.log("mouvements", totalEncaissement, totalDebit, solde);
  const mouvementData = mouvements
  .map(m => ({
    ...m,
    montant: m.type === 'decaissement' ? -Math.abs(m.montant) : Math.abs(m.montant)
  }))

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards dataMouvements={dataMouvements} />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive mouvement={mouvements} />
        </div>
        <div className="px-4 lg:px-6">
          <DashboardItems mouvementData={mouvementData} />
        </div>
      </div>
    </div>
  )
}