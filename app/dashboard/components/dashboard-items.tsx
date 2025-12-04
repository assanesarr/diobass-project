import { BadgeCheckIcon, ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item"
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardItems({ mouvementData }: { mouvementData: any[] }) {
    mouvementData.sort((a, b) => b.createdAt - a.createdAt)
    return (
        <Card className="@container/card">
            <CardContent className="grid gap-4">
                {mouvementData.slice(0, 10).map(mouvement => (
                    <Item key={mouvement.id} variant="outline">
                        <ItemContent>
                            <ItemTitle>{mouvement.libelle}</ItemTitle>

                            {/* <ItemTitle>{mouvement.type === 'encaissement' ? 'Encaissement' : 'Decaissement'}</ItemTitle> */}
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
        </Card>);
}