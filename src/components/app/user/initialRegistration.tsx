"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useFirebaseData } from "@/context/FirebaseContext";
import { Flex, Heading } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import UserDataForm from "./forms/userDataForm";
import DeleteAccountModal from "./modals/deleteAccountModal";

/**
 * Renders the initial registration component.
 *
 * @return {React.ReactElement} The rendered initial registration component.
 */
const InitialRegistration = (): React.ReactElement => {
    const t = useTranslations();

    const { userData } = useFirebaseData();

    return (
        <Flex justify={"center"}>
            <Card className="w-[600px]">
                <CardHeader>
                    <Flex
                        justify="between"
                        align={{ initial: "start", xs: "center" }}
                        direction={{ initial: "column", xs: "row" }}
                        className="gap-2"
                    >
                        <Heading weight="bold">
                            {t("app.profile.createYourProfile")}
                        </Heading>

                        <DeleteAccountModal>
                            <Button variant="destructive">
                                {t("app.account.deleteMyAccount")}
                            </Button>
                        </DeleteAccountModal>
                    </Flex>
                </CardHeader>
                <CardContent>
                    <UserDataForm userData={userData} isNewUser={true} />
                </CardContent>
            </Card>
        </Flex>
    );
};

export default InitialRegistration;
