"use client";

import { ElectricityForm } from "@/components/app/consumptions/forms/electricityForm";
import { HeatingForm } from "@/components/app/consumptions/forms/heatingForm";
import { TransportationForm } from "@/components/app/consumptions/forms/transportationForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { consumptionMapping } from "@/lib/constants/consumption-constants";
import { cn } from "@/lib/utilities";
import { ConsumptionWithID } from "@/models/extensions";
import { ConsumptionCategory } from "@/models/firestore/consumption/consumption-category";
import { useTranslations } from "next-intl";
import { ReactNode, forwardRef, useState } from "react";

const AddEditConsumptionModal = forwardRef(
  (
    props: {
      children: ReactNode;
      isDuplication?: boolean;
      consumption?: ConsumptionWithID;
      className?: string;
    },
    _ref,
  ) => {
    const { isDuplication, consumption, children, className } = props;

    const t = useTranslations();

    const [currentTab, setCurrentTab] = useState<ConsumptionCategory>(
      consumption?.category || "electricity",
    );
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCloseModal = () => {
      setIsModalOpen(false);
    };

    return (
      <>
        <div
          onClick={() => setIsModalOpen(true)}
          className={cn(className, "mt-0")}
        >
          {children}
        </div>
        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
          <DialogContent className="sm:max-w-lg">
            <ScrollArea className="max-h-[80vh]">
              <Tabs
                value={currentTab}
                onValueChange={(value) =>
                  setCurrentTab(value as ConsumptionCategory)
                }
              >
                {!consumption && (
                  <div className="overflow-x-auto">
                    <TabsList className="my-6 w-full">
                      {consumptionMapping.map((consumption) => (
                        <TabsTrigger
                          key={consumption.category}
                          value={consumption.category}
                          className="w-full"
                        >
                          {t(consumption.label)}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>
                )}

                <TabsContent value="electricity">
                  <ElectricityForm
                    consumption={consumption}
                    onConsumptionAdded={handleCloseModal}
                    isDuplication={isDuplication}
                  />
                </TabsContent>
                <TabsContent value="heating">
                  <HeatingForm
                    consumption={consumption}
                    onConsumptionAdded={handleCloseModal}
                    isDuplication={isDuplication}
                  />
                </TabsContent>
                <TabsContent value="transportation">
                  <TransportationForm
                    consumption={consumption}
                    onConsumptionAdded={handleCloseModal}
                    isDuplication={isDuplication}
                  />
                </TabsContent>
              </Tabs>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </>
    );
  },
);

AddEditConsumptionModal.displayName = "AddEditConsumptionModal";

export { AddEditConsumptionModal };
