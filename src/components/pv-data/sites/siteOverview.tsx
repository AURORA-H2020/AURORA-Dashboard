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
import { Link, usePathname } from "@/i18n/routing";
import { useCreateQueryString } from "@/lib/hooks/useCreateQueryString";
import { Building2, Earth } from "lucide-react";

const SiteOverview = () => {
  const pathname = usePathname();
  const createQueryString = useCreateQueryString();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {validSites.map((site) => (
        <Card
          key={site.id}
          className="overflow-hidden bg-primary/5 transition-shadow hover:shadow-lg"
        >
          <CardHeader>
            <CardTitle className="text-xl font-semibold">{site.name}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Earth className="h-5 w-5 text-primary" />
                <span className="text-sm">{site.country}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <span className="text-sm">{site.city}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4">
            <Button className="w-full" variant="default">
              <Link
                href={pathname + "?" + createQueryString("site", site.id)}
                className="flex w-full items-center justify-center"
              >
                View Data
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export { SiteOverview };
