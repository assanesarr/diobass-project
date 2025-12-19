"use client"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
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
import React from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select"

export function DialogSaisis({ clients }: { clients?: any[] }) {
    const [type, setType] = React.useState<"encaissement" | "decaissement">("encaissement");

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
                            <div className="grid gap-3">
                                <Label htmlFor="montant-1">Montant</Label>
                                <Input id="montant-1" name="montant" />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="limit">Type Paiement</Label>
                                <Select name="payement_type">
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
                        </div>
                        <div className="grid grid-cols-2 gap-4">
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
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="Clients">Clients</Label>
                                <Select name="clients">
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
                        </div>
                        {
                            type === "encaissement" && (
                                <div className="grid gap-3">
                                    <Label htmlFor="montant-total">Montant Total</Label>
                                    <Input id="montant-total" name="montant_total" />
                                </div>
                            )
                        }

                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" > Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
