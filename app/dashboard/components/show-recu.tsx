'use client'
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item";
import { capitalizeFirstLetter } from "@/lib/utils";
import { IconCash, IconEggCracked } from "@tabler/icons-react";




export default function ShowRecu(
    { open, setOpen, id, data }:
        { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, id: string | undefined, data: any[] }
) {

    const recu = data.find(d => d.id === id)
    console.log(recu)


    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex flex-col justify-center items-center gap-2" >
                        <IconCash size={52} />
                        {capitalizeFirstLetter(recu?.type as string)} effectue
                    </DialogTitle>
                    <DialogDescription>
                        <div className="flex justify-center">
                            {recu?.libelle}
                        </div>
                        <Item >
                            <ItemContent>
                                <ItemTitle>Montant</ItemTitle>
                            </ItemContent>
                            <ItemActions >
                                {recu?.montant} CFA
                            </ItemActions>
                        </Item>
                        <Item >
                            <ItemContent>
                                <ItemTitle>Mode</ItemTitle>
                            </ItemContent>
                            <ItemActions >
                                {recu?.payment_method}
                            </ItemActions>
                        </Item>
                        <Item >
                            <ItemContent>
                                <ItemTitle>Date</ItemTitle>
                            </ItemContent>
                            <ItemActions >
                                {new Date(recu?.createdAt).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </ItemActions>
                        </Item>
                        <Item >
                            <ItemContent>
                                <ItemTitle>Référence</ItemTitle>
                            </ItemContent>
                            <ItemActions >
                                {recu?.id}
                            </ItemActions>
                        </Item>
                    </DialogDescription>
                </DialogHeader>
                <Button
                    variant="outline"
                    onClick={() => window.print()}
                    className="print:hidden"
                >
                    Imprimer le reçu
                </Button>
            </DialogContent>
        </Dialog>
    )
}