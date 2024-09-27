"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { validSites } from "@/lib/constants/api-constants";
import { Link } from "@/navigation";
import {
  BatteryChargingIcon,
  CalendarIcon,
  FactoryIcon,
  MapPinIcon,
  SunIcon,
  Wallet,
} from "lucide-react";

const PvPanelDetails = ({ site }: { site: string }) => {
  const siteDetails = validSites.find((s) => s.id === site);

  if (!siteDetails) return null;

  const details = [
    {
      icon: BatteryChargingIcon,
      label: "Capacity",
      value: siteDetails.capacity,
    },
    {
      icon: MapPinIcon,
      label: "Location",
      value: `${siteDetails.country}, ${siteDetails.city}`,
    },
    {
      icon: FactoryIcon,
      label: "Manufacturer",
      value: siteDetails.manufacturer,
    },
    {
      icon: CalendarIcon,
      label: "Installation Date",
      value: siteDetails.installationDate,
    },
  ];

  return (
    <Card className="overflow-hidden bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-semibold">
          <SunIcon className="mr-2 size-5 text-yellow-500" />
          Solar Panel Information
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6">
        <div className="flex flex-col gap-4">
          {details.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className="size-5 text-primary" />
              <span className="font-semibold">{label}:</span>
              <span className="">{value}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4">
        <Button className="flex w-full" variant="default" asChild>
          <Link href={siteDetails.investLink}>
            <Wallet className="mr-2 size-5" /> How to invest?
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export { PvPanelDetails };
