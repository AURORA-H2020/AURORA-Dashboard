import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { setAcceptedLegalDocumentVersion } from "@/firebase/user/setAcceptedLegalDocumentVersion";
import { externalLinks } from "@/lib/constants/constants";
import { Link } from "@/navigation";
import { Flex, Heading } from "@radix-ui/themes";
import { User } from "firebase/auth";
import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactElement } from "react";
import { DeleteAccountModal } from "./modals/deleteAccountModal";

/**
 * Renders the UpdateConsent component.
 *
 * @param {Object} props - The component props.
 * @param {number} props.latestLegalDocumentsVersion - The latest version of the legal documents.
 * @param {User} props.user - The user object.
 * @return {ReactElement} The rendered UpdateConsent component.
 */
const UpdateConsent = ({
  latestLegalDocumentsVersion,
  user,
}: {
  latestLegalDocumentsVersion: number;
  user: User;
}): ReactElement => {
  const t = useTranslations();
  return (
    <Flex justify={"center"}>
      <Card className="w-[600px]">
        <CardHeader>
          <Flex
            justify="between"
            align={{ initial: "start", xs: "center" }}
            direction="column"
            className="gap-2"
          >
            <Info size={50} />
            <Heading weight="bold">{t("common.important")}</Heading>
          </Flex>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Flex direction="column" gap="4">
            <div className="w-[400px] text-center">
              {t("app.legal.updatedLegalDocuments")}
            </div>
            <Button variant="outline" asChild>
              <Link href={externalLinks.privacyPolicy}>
                {t("app.legal.privacyPolicy")}
              </Link>
            </Button>
            <Button variant="outline">
              <Link href={externalLinks.termsOfService}>
                {t("app.legal.termsOfService")}
              </Link>
            </Button>
          </Flex>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <DeleteAccountModal
            title={t("app.account.rejectConsentDeletePopup.title")}
            description={t("app.account.rejectConsentDeletePopup.description")}
          >
            <Button variant="destructive">{t("common.reject")}</Button>
          </DeleteAccountModal>
          <Button
            onClick={() =>
              setAcceptedLegalDocumentVersion(latestLegalDocumentsVersion, user)
            }
          >
            {t("common.accept")}
          </Button>
        </CardFooter>
      </Card>
    </Flex>
  );
};

export { UpdateConsent };
