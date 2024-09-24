"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { validSites } from "@/lib/constants/apiConstants";
import { useCreateQueryString } from "@/lib/hooks/useCreateQueryString";
import { Link, usePathname } from "@/navigation";
import { ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const SiteTabs = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const site = searchParams.get("site");
  const date = searchParams.get("date");

  const [activeTab, setActiveTab] = useState(site || validSites[0].id);

  const createQueryString = useCreateQueryString();

  return (
    <div className="flex gap-4 justify-between">
      <Tabs
        defaultValue={activeTab}
        value={activeTab}
        className="w-[400px]"
        onValueChange={setActiveTab}
      >
        <TabsList>
          {validSites.map((site) => (
            <TabsTrigger key={site.id} value={site.id} asChild>
              <Link href={pathname + "?" + createQueryString("site", site.id)}>
                {site.name}
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {date && (
        <Button asChild variant="outline">
          <Link href={pathname + "?" + createQueryString("date", null)}>
            <ArrowLeft className="mr-1" />
            Overview
          </Link>
        </Button>
      )}
    </div>
  );
};

export { SiteTabs };
