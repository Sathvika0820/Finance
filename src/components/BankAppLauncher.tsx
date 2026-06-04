import { BankLogo } from "@/components/BankLogo";
import { SmartRedirectActions } from "@/components/SmartRedirectActions";
import { getBankById } from "@/data/banks";
import { getInstitutionRedirect } from "@/data/institutionRedirects";
import type { BankAppInfo } from "@/data/bankApps";

interface BankAppLauncherProps {
  bankId: string;
  bankName: string;
  officialWebsite: string;
  app: BankAppInfo | null;
}

export function BankAppLauncher({ bankId, bankName, officialWebsite, app }: BankAppLauncherProps) {
  const bank = getBankById(bankId);
  const configured = getInstitutionRedirect("bank", bankId);
  const institution = configured ?? {
    id: bankId,
    kind: "bank" as const,
    name: bankName,
    website: officialWebsite,
    androidPackage: app?.androidPackage,
    appName: app?.appName,
    deepLink: app?.uriScheme,
  };

  return (
    <SmartRedirectActions
      institution={institution}
      logo={bank ? <BankLogo bank={bank} size="md" /> : undefined}
    />
  );
}
