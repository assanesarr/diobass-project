'use client';

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import TrashBtn from "./trash-btn";
import TrashDossier from "./trash-dossier";
import { BadgeCheckIcon} from "lucide-react";
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";



export default function FooterUser({ user, docs }: { user: any, docs: any[] }) {

    const isMobile = useIsMobile();
    const [dossiers, setDossiers] = useState<any[]>(docs)

    // console.log("rendering...", dossiers)
    // console.log("User in FooterUser:", user);
    // const totalMontant = dossiers.reduce((sum: number, dossier: any) => sum + (dossier.montant_total || 0), 0);

    useEffect(() => {
        setDossiers(docs)
    }, [user])

    console.log("Dossiers in FooterUser:", dossiers)

    return (
        <Drawer direction={isMobile ? "bottom" : "right"} >
            <DrawerTrigger asChild>
                <Button variant="ghost" className="font-bold hover:underline text-sm w-fit px-0 text-left">
                    {user.name}
                </Button>
            </DrawerTrigger>
            <DrawerContent >
                <DrawerHeader className="gap-1">
                    <DrawerTitle className="text-xl font-bold">{user.name}</DrawerTitle>
                    <DrawerDescription></DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
                    <h1 className="text-xl font-bold">Encaissement </h1>
                    <Accordion type="single" collapsible >
                        {
                            dossiers.length === 0 ? (
                                <p>No dossiers found for this client.</p>
                            ) :
                                dossiers.map((dossier: any, index: number) => {
                                    const totalVersement = dossier.versement.reduce((sum: number, v: any) => Number(sum) + (Number(v.montant) || 0), 0);

                                    return (
                                        <AccordionItem key={index} value={`item-${index}`}>
                                            <div className="flex gap-1 justify-between">
                                                <TrashDossier dossierId={dossier.id} setDossiers={setDossiers} />
                                                <AccordionTrigger>
                                                    <Badge>Dossier {dossier.dossierName}</Badge>
                                                </AccordionTrigger>
                                            </div>
                                            <AccordionContent>

                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Action</TableHead>
                                                            <TableHead className="w-[100px]">Invoice</TableHead>
                                                            <TableHead>Method</TableHead>
                                                            <TableHead className="text-right">Amount</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {dossier.versement.map((versement: any, vIndex: number) => (
                                                            <TableRow key={vIndex}>
                                                                <TableCell>
                                                                    <TrashBtn
                                                                        dossierName={dossier.dossierName}
                                                                        versementDate={versement.date}
                                                                        setDossiers={setDossiers}
                                                                    />
                                                                </TableCell>
                                                                <TableCell className="font-medium">{versement.invoice || `INV${String(vIndex + 1).padStart(3, '0')}`}</TableCell>
                                                                <TableCell>{versement.method}</TableCell>
                                                                <TableCell className="text-right">{versement.montant}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                        <TableRow>
                                                            <TableCell className="font-medium text-right" colSpan={3}>TOTAL ACOUNT:</TableCell>
                                                            <TableCell className="text-right">
                                                                {
                                                                    totalVersement >= dossier.montant_total
                                                                        ? (<Badge className="bg-green-500 text-white rounded-none">{totalVersement}</Badge>)
                                                                        : (<Badge className="bg-red-500 text-white rounded-none">{totalVersement}</Badge>)
                                                                }
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell className="font-medium text-right" colSpan={3}>NET A PAIE:</TableCell>
                                                            <TableCell className="text-right">{dossier.montant_total}</TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </AccordionContent>
                                        </AccordionItem>
                                    )
                                })
                        }

                    </Accordion>
                    <Separator />
                    <h1 className="text-xl font-bold">Decaissement Paiements</h1>
                    <div>
                        <Accordion type="single" collapsible >
                            {
                                dossiers.length === 0 ? (
                                    <p>No dossiers found for this client.</p>
                                ) :
                                    dossiers.map((dossier: any, index: number) => {
                                        const totalVersement = dossier.versement.reduce((sum: number, v: any) => Number(sum) + (Number(v.montant) || 0), 0);
                                        const totalPayement = dossier?.payements && dossier.payements.reduce((sum: number, p: any) => Number(sum) + (Number(p.montant) || 0), 0);
                                        return (
                                            <AccordionItem key={index} value={`item-${index}`}>
                                                <AccordionTrigger >
                                                    Dossier {dossier.dossierName}
                                                </AccordionTrigger>
                                                <AccordionContent  >
                                                    {
                                                        dossier.payements && dossier.payements.length > 0 ?
                                                            <>

                                                                {
                                                                    dossier.payements.map((payement: any, pIndex: number) => (
                                                                        <Item variant="outline" size="sm" key={pIndex}>
                                                                            <ItemMedia>
                                                                                <BadgeCheckIcon className="size-5 text-green-500" />
                                                                            </ItemMedia>
                                                                            <ItemContent>
                                                                                <ItemTitle>{payement.payement}</ItemTitle>
                                                                            </ItemContent>
                                                                            <ItemActions>
                                                                                {payement.montant}
                                                                            </ItemActions>
                                                                        </Item>
                                                                    ))
                                                                }

                                                                <Item variant="muted" size="sm">
                                                                    <ItemContent>
                                                                        <ItemTitle>Total Payements</ItemTitle>
                                                                    </ItemContent>
                                                                    <ItemActions>
                                                                        {totalPayement}
                                                                    </ItemActions>
                                                                </Item>
                                                                <Item variant="muted" size="sm">

                                                                    <ItemContent>
                                                                        <ItemTitle className="font-bold">Total Versement</ItemTitle>
                                                                    </ItemContent>
                                                                    <ItemActions>
                                                                        {totalVersement}
                                                                    </ItemActions>
                                                                </Item>
                                                            </>

                                                            : (
                                                                <p className="text-sm text-muted-foreground">No payements found for this dossier.</p>
                                                            )

                                                    }

                                                </AccordionContent>
                                            </AccordionItem>
                                        )
                                    })
                            }
                        </Accordion>
                    </div>
                </div>
                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button variant="outline">Done</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer >

    );
}