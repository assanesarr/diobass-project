'use client'
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item"
import { Card, CardContent } from "@/components/ui/card";
import ShowRecu from "./show-recu";
import { useState } from "react";



export default function DashboardItems({ mouvementData }: { mouvementData: any[] }) {
    const [open, setOpen] = useState(false)
    const [id, setId] = useState<string | undefined>()

    mouvementData.sort((a, b) => b.createdAt - a.createdAt)


    console.log(mouvementData)
    return (
        <>
            <ShowRecu open={open} setOpen={setOpen} id={id} data={mouvementData} />
            <Card className="@container/card">
                <CardContent className="grid gap-4">
                    {mouvementData.slice(0, 5).map(mouvement => (
                        <Item key={mouvement.id} variant="outline" onClick={() => { setId(mouvement.id); setOpen(true) }}>
                            <ItemContent>
                                <ItemTitle>{mouvement.type === 'encaissement' ? 'Encaissement' : 'Decaissement'} {mouvement.payement}</ItemTitle>
                                <ItemDescription>
                                    {new Date(mouvement.createdAt).toLocaleDateString('fr-FR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </ItemDescription>
                            </ItemContent>
                            <ItemActions className={mouvement.type === 'encaissement' ? 'text-green-600' : 'text-red-600'}>
                                {mouvement.montant}
                                {/* <Button variant="outline" size="sm">
                                Voir Détails
                            </Button> */}
                            </ItemActions>
                        </Item>
                    ))}

                </CardContent>
            </Card>
        </>
    );
}