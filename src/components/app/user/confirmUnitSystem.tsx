"use client";

import { BorderBox } from "@/components/app/common/borderBox";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import { useFirebaseData } from "@/context/FirebaseContext";
import { addEditUserData } from "@/firebase/user/addEditUserData";
import { UserSettingsUnitSystem } from "@/models/firestore/user/user-settings/user-settings-unitSystem";
import { Flex, Text } from "@radix-ui/themes";
import { CircleHelp } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

/**
 * Renders a component that confirms the unit system for the user.
 *
 * @return {ReactNode} The rendered component.
 */
const ConfirmUnitSystem = (): ReactNode => {
  const t = useTranslations();
  const { userData, isLoadingUserData } = useFirebaseData();
  const { user } = useAuthContext();

  const unitSystem: UserSettingsUnitSystem | undefined =
    userData?.settings?.unitSystem;

  if (isLoadingUserData || unitSystem) {
    return null;
  }

  /**
   * Sets the unit system for the user.
   *
   * @param {UserSettingsUnitSystem} unitSystem - The unit system to be set.
   * @return {void} This function does not return anything.
   */
  const setUnitSystem = (unitSystem: UserSettingsUnitSystem): void => {
    if (userData && user) {
      if (!userData.settings) {
        userData.settings = {};
      }
      userData.settings.unitSystem = unitSystem;

      addEditUserData(userData, user);
    }
  };

  return (
    <BorderBox className="mt-4">
      <Flex
        justify="between"
        align="center"
        gap="4"
        className="flex-wrap md:flex-nowrap"
      >
        <Flex gap="4" align="center">
          <CircleHelp className="flex-shrink-0" />
          <Text>{t("app.confirmUnitSystem.description")}</Text>
        </Flex>
        <Flex gap="2" className="w-full md:w-auto flex-wrap sm:flex-nowrap">
          <Button
            size="sm"
            variant="outline"
            className="w-full sm:w-1/2"
            onClick={() => setUnitSystem("metric")}
          >
            {t("app.confirmUnitSystem.useMetric")}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-full sm:w-1/2"
            onClick={() => setUnitSystem("imperial")}
          >
            {t("app.confirmUnitSystem.useImperial")}
          </Button>
        </Flex>
      </Flex>
    </BorderBox>
  );
};

export { ConfirmUnitSystem };
