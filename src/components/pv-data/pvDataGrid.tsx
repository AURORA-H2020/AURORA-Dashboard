import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

type PvDataGridProps = {
  children?: ReactNode;
  dataPanels?: ReactNode;
  footer?: ReactNode;
};

const PvDataGrid = ({ children, dataPanels, footer }: PvDataGridProps) => {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="flex h-fit flex-col gap-4 lg:col-span-2">
        {children && (
          <Card>
            <CardContent className="p-6">{children}</CardContent>
          </Card>
        )}
        {footer && (
          <Card>
            <CardContent className="p-6">{footer}</CardContent>
          </Card>
        )}
      </div>
      {dataPanels && (
        <div className="grid h-fit grid-cols-1 gap-4 md:grid-cols-2 lg:col-span-1 lg:grid-cols-1">
          {dataPanels}
        </div>
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
  className?: string;
};

const DataPanel = ({ children, className }: DataPanelProps) => {
  return <div className={className}>{children}</div>;
};

type FooterProps = {
  children: ReactNode;
};

const Footer = ({ children }: FooterProps) => {
  return <>{children}</>;
};

PvDataGrid.DataPanels = DataPanels;
PvDataGrid.DataPanel = DataPanel;
PvDataGrid.Footer = Footer;

export { PvDataGrid };
