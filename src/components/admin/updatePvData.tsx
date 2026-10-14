import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllApiData } from "@/firebase/firestore/get-all-api-data";
import { useFirebaseData } from "@/providers/context/firebaseContext";

const UpdatePvData = () => {
  interface FirebaseResponse {
    success: boolean;
    error?: unknown;
    plantId?: string;
  }

  const { pvPlants } = useFirebaseData();

  const [updatingPvData, setUpdatingPvData] = useState(false);

  const getAllPvDataWrapper = async (plantId: string) => {
    setUpdatingPvData(true);
    let response: FirebaseResponse | undefined = undefined;
    try {
      response = await getAllApiData(plantId);
    } catch (error) {
      console.error("Error updating PV data:", error);
    } finally {
      setUpdatingPvData(false);
      if (response?.success) {
        toast.success("PV data updated");
      } else {
        toast.error("Error updating PV data", {
          description: String(response?.error ?? "Unknown error"),
        });
      }
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {pvPlants.map((pvPlant) => (
        <Card key={pvPlant.plantId}>
          <CardHeader>
            <CardTitle>{pvPlant.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {Object.keys(pvPlant).map((key) => (
              <div key={key}>
                <span className="font-bold">{key.toString()}</span>
                <br />
                {String(pvPlant[key])}
              </div>
            ))}
            <Button
              onClick={() => getAllPvDataWrapper(pvPlant.id)}
              disabled={updatingPvData}
            >
              Update Site
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export { UpdatePvData };
