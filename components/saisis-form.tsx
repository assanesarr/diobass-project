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
import { Spinner } from "./ui/spinner"
import React, { useEffect } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select"
import { Checkbox } from "./ui/checkbox"
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldTitle } from "./ui/field"
import { Switch } from "./ui/switch"

export function DialogSaisis({ clients }: { clients?: any[] }) {
    const [type, setType] = React.useState<"encaissement" | "decaissement">("encaissement");
    const [modeEncaissement, setModeEncaissement] = React.useState<string>("NOUVEAU");
    const [clientId, setClientId] = React.useState<string>("");
    const [dossiers, setDossiers] = React.useState<any[]>([]);


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
        console.log("Selected Client ID:", clientId);
    }, [clientId]);

    return (
        <Dialog>
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
                <form action={addMouvement} className="grid gap-4">
                    <input type="hidden" name="type" value={type} />
                    <DialogHeader>
                        <DialogTitle className={type === "decaissement" ? "text-red-600" : "text-green-600"}>Operation {type} </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name-1">Libelle</Label>
                            <Input id="name-1" name="libelle" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {
                                type === "encaissement" ? (
                                    <>
                                        <div className="flex flex-col gap-3">
                                            <Label htmlFor="Clients">Clients</Label>
                                            <Select name="clients" onValueChange={setClientId}>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Select a clients" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {
                                                            clients && clients.length > 0 ? (
                                                                clients.map((client) => (
                                                                    <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                                                                ))
                                                            ) : (
                                                                <SelectItem value="none">No clients available</SelectItem>
                                                            )
                                                        }
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
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
                                    </>

                                ) : null
                            }

                            <div className="grid gap-3">
                                <Label htmlFor="montant-1">Montant</Label>
                                <Input id="montant-1" name="montant" />
                            </div>
                            {
                                type === "encaissement" && modeEncaissement === "NOUVEAU" && (
                                    <div className="grid gap-3">
                                        <Label htmlFor="montant-total">Montant Total</Label>
                                        <Input id="montant-total" name="montant_total" />
                                    </div>
                                )
                            }
                            {/* <div className="flex flex-col gap-3">
                                <Label htmlFor="montant-total">Montant Total</Label>
                                <Input id="montant-total" name="montant_total" />
                            </div> */}
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="limit">Method Paiement</Label>
                                <Select name="payment_method" >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select Payement Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Type de paiement</SelectLabel>
                                            <SelectItem value="OM">ORANGE MONEY</SelectItem>
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
                                        <Input name="dossier_name"  />
                                    </div>
                                )
                            }
                            {
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
                            }
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" > Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    )
}
