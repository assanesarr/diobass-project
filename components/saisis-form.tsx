"use client"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar"
import { IconCirclePlusFilled } from "@tabler/icons-react"
import { addMouvement } from "@/lib/actions"
import React, { useEffect, useState } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select"
import { toast } from "sonner"
import { useFormState, useFormStatus } from "react-dom"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { AlertCircleIcon } from "lucide-react"
import { Spinner } from "./ui/spinner"

const payements = [
    "Debarquement",
    "Tax Port + Relevage",
    "Escorte Douane + Retour Douanier",
    "Circuit",
    "Depotage",
    "Surestarie",
    "Transport",
    "Assurance",
    "Vacation Douane",
    "Gainde",
    "Container N",
    "TS Douane",
    "Visite Douane",
    "Fret",
    "TRansfert LTA",
    "Magasinage",
    "Location Fourchette"
]

const initialState = { error: null }

export function DialogSaisis({ clients }: { clients?: any[] }) {
    const [type, setType] = useState<"encaissement" | "decaissement">("encaissement");
    const [modeEncaissement, setModeEncaissement] = useState<string>("NOUVEAU");
    const [methodPayement, setMethodPayement] = useState<string>("")
    const [clientId, setClientId] = useState<string>("");
    const [dossiers, setDossiers] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [state, formAction] = useFormState(addMouvement, null)



    useEffect(() => {
        fetch("/api/dossiers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ clientId })
        })
            .then((res) => res.json())
            .then((res) => {
                setDossiers(res);
                res.length === 0 && setModeEncaissement("NOUVEAU");
                console.log("API Response:", res);
            })
            .catch((error) => {
                console.error("Error fetching API:", error);
            });
        

    }, [clientId]);

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error);
        } else if (state?.success) {
            toast.success("Enregistrement effectué avec succès!");
            setOpen(false);
        }
    }, [state]);


    return (
        <Dialog onOpenChange={setOpen} open={open}>
            <DialogTrigger asChild>
                <SidebarMenuItem className="flex items-center gap-2">
                    <SidebarMenuButton
                        tooltip="Quick Create"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear cursor-pointer"
                        onClick={() => setType("encaissement")}
                    >
                        <IconCirclePlusFilled />
                        <span>Encaissement</span>
                    </SidebarMenuButton>
                    <SidebarMenuButton
                        tooltip="Quick Create"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear cursor-pointer"
                        onClick={() => setType("decaissement")}
                    >
                        <IconCirclePlusFilled />
                        <span>Decaissement</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                {state?.error && (
                    <Alert variant="destructive" className="max-w-md">
                        <AlertCircleIcon />
                        <AlertTitle>Échec de l'enregistrement</AlertTitle>
                        <AlertDescription>
                            {state?.error}
                        </AlertDescription>
                    </Alert>
                )}
                <form action={formAction} className="grid gap-4">
                    <input type="hidden" name="type" value={type} />
                    <DialogHeader>
                        <DialogTitle className={type === "decaissement" ? "text-red-600" : "text-green-600"}>Operation {type} </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4">
                        {/* <div className="grid gap-3">
                            <Label htmlFor="name-1">Libelle</Label>
                            <Input id="name-1" name="libelle" />
                        </div> */}

                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="Clients">Clients</Label>
                                <Select name="clients" onValueChange={setClientId}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a clients" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {
                                                clients && clients.length > 0 ? (<>
                                                    {
                                                        clients.map((client) => (
                                                            <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                                                        ))
                                                    }
                                                    {
                                                        type === "decaissement" && <SelectItem value="OTHER">Autre</SelectItem>
                                                    }
                                                </>) : (
                                                    <SelectItem value="none">No clients available</SelectItem>
                                                )
                                            }
                                            <Button variant="outline" size="sm" className="w-full" >Ajouter un nouveau client</Button>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            {
                                type === "encaissement" ? (
                                    <div className="flex flex-col gap-3">
                                        <Label htmlFor="mode">Mode encaissement</Label>
                                        {
                                            dossiers.length === 0 ? (
                                                <Input id="mode" name="mode" value="NOUVEAU" readOnly />
                                            ) : (
                                                <Select name="mode" onValueChange={setModeEncaissement} defaultValue={modeEncaissement}>
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue placeholder="Select a mode" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Mode encaissement</SelectLabel>
                                                            <SelectItem value="NOUVEAU">NOUVEAU</SelectItem>
                                                            <SelectItem value="ACOMPTE">ACOMPTE</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            )
                                        }
                                    </div>

                                ) : (<>
                                    {
                                        type === "decaissement" && clientId !== "OTHER" && (
                                            <div className="flex flex-col gap-3">
                                                <Label htmlFor="">Dossiers</Label>
                                                <Select name="dossier_name" >
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue placeholder="Dossiers" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {dossiers.map((dossier) => (
                                                                <SelectItem
                                                                    key={dossier.id}
                                                                    value={dossier.id}
                                                                >{dossier.dossierName}</SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )
                                    }
                                    <div className="flex flex-col gap-3">
                                        <Label htmlFor="Payement">Payement</Label>
                                        <Select name="payement" >
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Select a mode" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>decaissement</SelectLabel>
                                                    {
                                                        clientId === "OTHER" ?
                                                            <>
                                                                <SelectItem value="TRANSPORT" >Transport</SelectItem>
                                                                <SelectItem value="REPAS" >Repas</SelectItem>
                                                            </>
                                                            : payements.map((p, index) => (
                                                                <SelectItem key={index} value={p} >{p}</SelectItem>
                                                            ))
                                                    }
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </>)
                            }

                            <div className="grid gap-3">
                                <Label htmlFor="montant-1">Montant versé</Label>
                                <Input id="montant-1" name="montant" />
                            </div>
                            {
                                type === "encaissement" && modeEncaissement === "NOUVEAU" && (
                                    <div className="grid gap-3">
                                        <Label htmlFor="montant-total">Montant Total a payer</Label>
                                        <Input id="montant-total" name="montant_total" />
                                    </div>
                                )
                            }

                            <div className="flex flex-col gap-3">
                                <Label htmlFor="limit">Method Paiement</Label>
                                <Select name="payment_method" onValueChange={setMethodPayement}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select Payement Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Method de paiement</SelectLabel>
                                            <SelectItem value="ORANGE MONEY">ORANGE MONEY</SelectItem>
                                            <SelectItem value="WAVE">WAVE</SelectItem>
                                            <SelectItem value="ESPECE">ESPECE</SelectItem>
                                            <SelectItem value="CHEQUE">CHEQUE</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            {
                                modeEncaissement === "ACOMPTE" && type === "encaissement" && (
                                    <div className="flex flex-col gap-3">
                                        <Label htmlFor="">Dossiers</Label>
                                        <Select name="dossier_name" >
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Dossiers" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {dossiers.map((dossier) => (
                                                        <SelectItem
                                                            key={dossier.id}
                                                            value={dossier.id}
                                                        >{dossier.dossierName}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )
                            }
                            {
                                modeEncaissement === "NOUVEAU" && type === "encaissement" && (
                                    <div className="flex flex-col gap-3">
                                        <Label >Dossier name</Label>
                                        <Input name="dossier_name" />
                                    </div>
                                )
                            }
                            {/* {
                                type === "decaissement" && (
                                    <div className="flex flex-col gap-3">
                                        <Label htmlFor="limit">Compagnie</Label>
                                        <Select name="compagnie">
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Select a compagnies" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Compagnies</SelectLabel>
                                                    <SelectItem value="CMAGGM">CMAGGM</SelectItem>
                                                    <SelectItem value="MSC">MSC</SelectItem>
                                                    <SelectItem value="MAESLINE">MAESLINE</SelectItem>
                                                    <SelectItem value="SOCAPAO">SOCAPAO</SelectItem>
                                                    <SelectItem value="ONE">ONE</SelectItem>
                                                    <SelectItem value="HAPAG">HAPAG</SelectItem>
                                                    <SelectItem value="ARKAS">ARKAS</SelectItem>
                                                    <SelectItem value="BOLUDA">BOLUDA</SelectItem>
                                                    <SelectItem value="DAKAR TERMINAL">DAKAR TERMINAL</SelectItem>
                                                    <SelectItem value="GRIMALDI">GRIMALDI</SelectItem>
                                                    <SelectItem value="CSTTAO">CSTTAO</SelectItem>
                                                    <SelectItem value="AGL">AGL</SelectItem>
                                                    <SelectItem value="OTHER">OTHER</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )
                            } */}
                        </div>
                        {
                            type === "encaissement" && methodPayement === "CHEQUE" && (
                                <div className="flex flex-col gap-3">
                                    <Label >Numero Cheque</Label>
                                    <Input name="numero_cheque" />
                                </div>
                            )
                        }
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Annuler</Button>
                        </DialogClose>
                        <SubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    )
}


function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <Button
            type="submit"
            disabled={pending}
            className="disabled:opacity-50"
        >
            {pending ? <Spinner /> : "Enregistrer"}
        </Button>
    )
}
