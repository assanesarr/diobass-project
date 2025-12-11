import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


export function SectionCards({ dataMouvements }: { dataMouvements?: { solde: number; totalDebit: number; totalCredit: number } }) {

  // const variation = dataMouvements?.solde - ancienSoldeMoisPrecedent;

  // const tauxCroissance =
  // ancienSoldeMoisPrecedent !== 0
  //   ? (variation / ancienSoldeMoisPrecedent) * 100
  //   : 0;
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Solde</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {dataMouvements?.solde} f cfa
          </CardTitle>
          {/* <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction> */}
        </CardHeader>
        {/* <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Visitors for the last 6 months
          </div>
        </CardFooter> */}
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Encaissements</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {dataMouvements?.totalCredit}
          </CardTitle>
          <CardAction>
            {/* <Badge variant="outline">
              <IconTrendingDown />
              -20%
            </Badge> */}
          </CardAction>
        </CardHeader>
        
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Decaissements</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {dataMouvements?.totalDebit}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Taux de croissance</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4.5%
            {/* {tauxCroissance.toFixed(2)}% */}
          </CardTitle>
          
        </CardHeader>
       
      </Card>
    </div>
  )
}