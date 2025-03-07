import { firebaseApp } from "@/firebase/config";
import { FirebaseConstants } from "@/firebase/firebase-constants";
import { Consumption } from "@/models/firestore/consumption/consumption";
import { User } from "firebase/auth";
import {
  Timestamp,
  collection,
  getDocs,
  getFirestore,
  query,
} from "firebase/firestore";

const fetchAllUserConsumptions = async (user: User): Promise<Consumption[]> => {
  const firestore = getFirestore(firebaseApp);

  const collectionRef = collection(
    firestore,
    FirebaseConstants.collections.users.name,
    user.uid,
    FirebaseConstants.collections.users.consumptions.name,
  );

  const q = query(collectionRef);

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => doc.data() as Consumption);
};

const formatTimestamp = (timestamp: Timestamp | undefined): string => {
  if (!timestamp) {
    return "";
  }
  return new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000,
  ).toISOString();
};

const jsonToCsv = (items) => {
  const header = Object.keys(items[0]);
  const headerString = header.join(";");
  // handle null or undefined values here
  const replacer = (_key, value) => value ?? "";
  const rowItems = items.map((row) =>
    header
      .map((fieldName) => JSON.stringify(row[fieldName], replacer))
      .join(";"),
  );
  // join header and body, and break into separate lines
  const csv = [headerString, ...rowItems].join("\r\n");
  return csv;
};

export const getUserConsumptionsAsCsv = async (user: User) => {
  const consumptions = await fetchAllUserConsumptions(user);

  const consumptionsJson = consumptions.map((entry: Consumption) => {
    const res = {
      createdAt: formatTimestamp(entry.createdAt),
      updatedAt: formatTimestamp(entry.updatedAt),
      category: entry.category || null,
      value: entry.value || null,
      carbonEmissions: entry.carbonEmissions || null,
      energyExpended: entry.energyExpended || null,
      version: entry.version || null,
      description: entry.description || null,
      costs: entry.electricity?.costs || entry.heating?.costs || null,
      generatedByRecurringConsumption: entry.generatedByRecurringConsumptionId
        ? true
        : false,
      startDate: (() => {
        if (entry.category === "electricity") {
          return formatTimestamp(entry.electricity?.startDate) || null;
        } else if (entry.category === "heating") {
          return formatTimestamp(entry.heating?.startDate) || null;
        } else if (entry.category === "transportation") {
          return formatTimestamp(entry.transportation?.dateOfTravel) || null;
        }
      })(),
      endDate: (() => {
        if (entry.category === "electricity") {
          return formatTimestamp(entry.electricity?.endDate) || null;
        } else if (entry.category === "heating") {
          return formatTimestamp(entry.heating?.endDate) || null;
        } else if (entry.category === "transportation") {
          return formatTimestamp(entry.transportation?.dateOfTravelEnd) || null;
        }
      })(),
      householdSize: (() => {
        if (entry.category === "electricity") {
          return entry.electricity?.householdSize || null;
        } else if (entry.category === "heating") {
          return entry.heating?.householdSize || null;
        } else if (entry.category === "transportation") {
          return null;
        }
      })(),
      primarySource: (() => {
        if (entry.category === "electricity") {
          return entry.electricity?.electricitySource ?? null;
        } else if (entry.category === "heating") {
          return entry.heating?.heatingFuel ?? null;
        } else if (entry.category === "transportation") {
          return entry.transportation?.transportationType ?? null;
        }
      })(),

      // Electricity specific fields
      electricityExported: entry.electricity?.electricityExported || null,

      // Heating specific fields
      districtHeatingSource: entry.heating?.districtHeatingSource || null,

      // Transportation specific fields
      privateVehicleOccupancy:
        entry.transportation?.privateVehicleOccupancy || null,
      publicVehicleOccupancy:
        entry.transportation?.publicVehicleOccupancy || null,
    };

    return res;
  });

  return jsonToCsv(consumptionsJson);
};

export function downloadCsv(filename: string, csvContent: string) {
  if (typeof window !== "undefined") {
    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    // Create a temporary URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement("a");

    // Set link properties
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";

    // Append the link to the document body
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
