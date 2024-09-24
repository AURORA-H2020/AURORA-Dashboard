"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { validSites } from "@/lib/constants/apiConstants";
import { Link } from "@/navigation";
import {
  BatteryChargingIcon,
  CalendarIcon,
  FactoryIcon,
  MapPinIcon,
  SunIcon,
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
    <Card className="overflow-hidden transition-shadow hover:shadow-lg bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-semibold">
          <SunIcon className="mr-2 h-5 w-5 text-yellow-500" />
          Solar Panel Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          {details.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold">{label}:</span>
              <span className="text-sm">{value}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4">
        <Button className="w-full" variant="default">
          <Link href={siteDetails.investLink}>How to invest?</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export { PvPanelDetails };
