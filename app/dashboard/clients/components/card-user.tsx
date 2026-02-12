"use client"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import FooterUser from "./user-footer";
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight, IconCircleCheckFilled, IconLoader, IconPencil } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import TrashComponent from "./trash";
import { useEffect, useId, useState } from "react";
import { Input } from "@/components/ui/input";
import { Save, SaveAll } from "lucide-react";
import { updateClient } from "@/lib/actions";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, SortingState, useReactTable } from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export type User = {
    id: string;
    name: string;
    role: string;
    address: string;
    phone: string;
    email: string;
    avatar: string;
    dossiers: []
};

type Payment = {
    id: string
    Name: string
    status: "pending" | "processing" | "success" | "failed"
    versement: number
    netpaye: number
    reste: number
    dossiers: []
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export default function CardUser({ users }: { users: User[] }) {

    // const [editMode, setEditMode] = useState(false);
    //  const [dossiers, setDossiers] = useState<any[]>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [sorting, setSorting] = useState<SortingState>([])
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })
    const sortableId = useId()

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => {
                return (
                    <FooterUser user={row.original} docs={row.original.dossiers} />
                )
            }
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {

                return (
                    <Badge variant="outline" className={cn("", false ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200")}>
                        {false ? (
                            <><IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" /> Done</>
                        ) : (
                            <><IconLoader />En cours</>
                        )}
                    </Badge>
                )
            }
        },
        {
            accessorKey: "versement",
            header: "Versement",
            cell({ row }) {
                const total = row.original.dossiers
                    .flatMap((d: any) => d.versement)
                    .reduce((sum: number, v: any) => Number(sum) + Number(v.montant), 0);

                return total

            },
        },
        {
            accessorKey: "netpaye",
            header: "Net A Payer",
            cell({ row }) {
                return row.original.dossiers.reduce((sum: number, v: any) => Number(sum) + Number(v.montant_total), 0)
            },
        },
        {
            accessorKey: "restant",
            header: "Restant",
            cell({ row }) {
                const totalMontant = row.original.dossiers.reduce((sum: number, v: any) => Number(sum) + Number(v.montant_total), 0)
                const totalVersement = row.original.dossiers
                    .flatMap((d: any) => d.versement)
                    .reduce((sum: number, v: any) => Number(sum) + Number(v.montant), 0);
                const result = totalMontant - totalVersement
                return (
                    <div className={cn("font-bold", result > 0 ? "text-red-500 " : "text-green-500")}>
                        {result}
                    </div>
                )
            },
        },
    ]

    const table = useReactTable({
        data: users,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        onPaginationChange: setPagination,
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            sorting,
            columnFilters,
            pagination,
        },
    })

    console.log("rendering... page")

    return (
        <div className="p-2 w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter nom..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>
            <div className="overflow-hidden rounded-md border w-full">

                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex w-full items-center gap-8 lg:w-fit p-2">
                <div className="flex w-fit items-center justify-center text-sm font-medium">
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                </div>
                <div className="ml-auto flex items-center gap-2 lg:ml-0">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to first page</span>
                        <IconChevronsLeft />
                    </Button>
                    <Button
                        variant="outline"
                        className="size-8"
                        size="icon"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <IconChevronLeft />
                    </Button>
                    <Button
                        variant="outline"
                        className="size-8"
                        size="icon"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to next page</span>
                        <IconChevronRight />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden size-8 lg:flex"
                        size="icon"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to last page</span>
                        <IconChevronsRight />
                    </Button>
                </div>
            </div>
        </div>
    );

    // return (
    //     <Card className="w-xs bg-white">
    //         <CardHeader className="">
    //             <div className="flex gap-2 justify-end">
    //                 {!editMode && (<Button variant="secondary" onClick={() => setEditMode(true)}><IconPencil /></Button>)}
    //                 {!editMode && <TrashComponent user={user} />}
    //             </div>
    //             <div className="photo-wrapper p-2">
    //                 <img className="w-32 h-32 rounded-full mx-auto" src={user.avatar} alt="John Doe" />
    //             </div>
    //         </CardHeader>
    //         <CardContent>
    //             <form action={updateClient}>
    //                 {editMode && <input type="hidden" name="id" value={user.id} />}

    //                 {
    //                     editMode ? <Input name="name" defaultValue={user.name} /> :
    //                         (<h3 className="text-center text-xl font-medium leading-8">{user.name}</h3>)
    //                 }
    //                 <div className="text-center text-gray-400 text-xs font-semibold">
    //                     <h3 className="text-center text-lg font-bold mb-2">
    //                         <Badge variant="outline" className={cn("", false ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200")}>
    //                             {false ? (
    //                                 <><IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" /> Done</>
    //                             ) : (
    //                                 <><IconLoader />Dossier En cours</>
    //                             )}
    //                         </Badge>
    //                     </h3>
    //                     {/* <p>{editMode ? <Input name="role" defaultValue={user.role} /> : user.role}</p> */}
    //                 </div>
    //                 <table className="text-xs my-3">
    //                     <tbody>
    //                         <tr>
    //                             <td className="px-2 py-2 text-gray-500 font-semibold">Address</td>
    //                             <td className="px-2 py-2">{editMode ? <Input name="address" defaultValue={user.address} /> : user.address}</td>
    //                         </tr>
    //                         <tr>
    //                             <td className="px-2 py-2 text-gray-500 font-semibold">Phone</td>
    //                             <td className="px-2 py-2">{editMode ? <Input name="phone" defaultValue={user.phone} /> : user.phone}</td>
    //                         </tr>
    //                         <tr>
    //                             <td className="px-2 py-2 text-gray-500 font-semibold">Email</td>
    //                             <td className="px-2 py-2">{editMode ? <Input name="email" defaultValue={user.email} /> : user.email}</td>
    //                         </tr>
    //                     </tbody>
    //                 </table>
    //                 <CardFooter className="flex justify-center my-3">
    //                     {editMode ? (<Button variant="outline" ><Save /> Enregistre</Button>) : <FooterUser user={user} dossiers={dossiers} setDossiers={setDossiers} />}
    //                 </CardFooter>
    //             </form>
    //         </CardContent>
    //     </Card >
    // );
}