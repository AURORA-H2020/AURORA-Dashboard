import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { ReactNode } from "react";

type PvDataGridProps = {
  children: ReactNode;
  timeframe: string;
  dataPanels?: ReactNode;
};

const PvDataGrid = ({ children, timeframe, dataPanels }: PvDataGridProps) => {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Energy Production for {timeframe}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
      {dataPanels && (
        <div className="flex flex-col gap-4 lg:col-span-1">{dataPanels}</div>
      )}
    </div>
  );
};

type DataPanelsProps = {
  children: ReactNode;
};

const DataPanels = ({ children }: DataPanelsProps) => {
  return <>{children}</>;
};

type DataPanelProps = {
  children: ReactNode;
};

const DataPanel = ({ children }: DataPanelProps) => {
  return <div>{children}</div>;
};

PvDataGrid.DataPanels = DataPanels;
PvDataGrid.DataPanel = DataPanel;

export { PvDataGrid };
