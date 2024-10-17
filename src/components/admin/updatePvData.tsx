import { Button } from "@/components/ui/button";
import { getAllApiData } from "@/firebase/firestore/get-all-api-data";
import { useFirebaseData } from "@/providers/context/firebaseContext";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

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
      // Handle the error
      console.error("Error downloading user data:", error);
    } finally {
      setUpdatingPvData(false);
      toast.success(JSON.stringify(response));
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
                {pvPlant[key].toString()}
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
