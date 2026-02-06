
'use client'

import { QRCodeCanvas } from "qrcode.react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { IconTrendingUp } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeOffIcon, EyeIcon } from "lucide-react";
import { useState } from "react";


export function SectionCards({ dataMouvements }: { dataMouvements?: { solde: number; totalDebit: number; totalCredit: number } }) {
  const [isVisible, setIsVisible] = useState(false);
  // const variation = dataMouvements?.solde - ancienSoldeMoisPrecedent;

  // const tauxCroissance =
  // ancienSoldeMoisPrecedent !== 0
  //   ? (variation / ancienSoldeMoisPrecedent) * 100
  //   : 0;
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex"><IconTrendingUp /> Solde</CardDescription>
          <CardTitle className="-mt-9">

            <div className='relative'>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setIsVisible(prevState => !prevState)}
                className='text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 left-0 rounded-none hover:bg-transparent'
              >
                {isVisible ? <EyeOffIcon /> : <EyeIcon />}
                <span className='sr-only'>{isVisible ? 'Hide password' : 'Show password'}</span>
              </Button>
              <Input type={isVisible ? 'text' : 'password'} className='border-none shadow-none focus-visible:ring-0 pl-8 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl' value={dataMouvements?.solde} readOnly />

            </div>

          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="rounded-none">
              <QRCodeCanvas
                value="https://example.com/dossier/123"
                size={100}
              />
            </Badge>
          </CardAction>
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
      <Card className="@container/card sm:col-span-2 @xl/main:col-span-1 hidden md:block">
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
      <Card className="@container/card hidden md:block">
        <CardHeader>
          <CardDescription>Decaissements</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {dataMouvements?.totalDebit}
          </CardTitle>
        </CardHeader>
      </Card>
      {/* <Card className="@container/card">
        <CardHeader>
          <CardDescription>Taux de croissance</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4.5%
            {/* {tauxCroissance.toFixed(2)}% }
          </CardTitle>

        </CardHeader>

      </Card> */}
    </div>
  )
}