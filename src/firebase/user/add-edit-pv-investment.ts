import { firebaseApp } from "@/firebase/config";
import { FirebaseConstants } from "@/firebase/firebase-constants";
import { UserPvInvestment } from "@/models/firestore/user/user-pv-investment/user-pv-investment";
import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  setDoc,
} from "firebase/firestore";

const firestore = getFirestore(firebaseApp);

/**
 * Removes invalid values from the given PV investment object.
 *
 * Checks the following fields and sets them to the "deleteField()" sentinel value if they are invalid:
 * - investment
 * - share
 * - investmentDate
 *
 * Invalid values are:
 * - undefined
 * - empty string
 * - null
 * - NaN
 *
 * @param {UserPvData} pvInvestment - The user PV investment data to remove invalid values from.
 * @return {UserPvData} - The updated PV investment data with invalid values removed.
 */
function removeInvalidValues(pvInvestment: UserPvInvestment): UserPvInvestment {
  const keysToCheck = [
    "investmentCapacity",
    "investmentPrice",
    "share",
    "investmentDate",
    "note",
    "city",
  ];
  keysToCheck.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(pvInvestment, key)) {
      const value = pvInvestment[key];
      if (
        value === undefined ||
        value === "" ||
        value === null ||
        Number.isNaN(value)
      ) {
        delete pvInvestment[key];
      }
    }
  });

  return pvInvestment;
}

/**
 * Adds or edits a PV investment entry in the database based on user input.
 *
 * @param {UserPvInvestment} pvInvestment - The PV investment object to add or edit.
 * @param {User} user - The user object associated with the PV investment.
 * @param {string} [pvInstmentId] - The optional ID of the PV investment entry.
 * @return {Promise<{ success: boolean }>} An object indicating the success of the operation.
 */
export const addEditPvInvestment = async (
  pvInvestment: UserPvInvestment,
  user: User,
  pvInvestmentId?: string,
): Promise<{ success: boolean }> => {
  let success = false;
  pvInvestment = removeInvalidValues(pvInvestment);
  if (user) {
    const pvInvestmentsRef = collection(
      firestore,
      FirebaseConstants.collections.users.name,
      user.uid,
      FirebaseConstants.collections.users.pvInvestments.name,
    );
    try {
      if (pvInvestmentId) {
        const docRef = doc(pvInvestmentsRef, pvInvestmentId);
        await setDoc(docRef, pvInvestment);
      } else {
        await addDoc(pvInvestmentsRef, pvInvestment);
      }
      success = true;
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  } else {
    throw new Error("User is not logged in.");
  }

  return { success };
};
