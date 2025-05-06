"use client";
import { useSearchParams } from "next/navigation";

import BackLink from "@/components/v1/BackLink";
import { useI18n } from "@/hooks/useI18n";

const PaymentStatus = () => {
  const { translate } = useI18n();
  const status = useSearchParams()?.get("status");

  const statusMap = {
    success: {
      href: "/dashboard/subscription",
      label: translate("pages.payments.actions.billing"),
      title: translate("pages.payments.status.success.title"),
      description: translate("pages.payments.status.success.description"),
    },
    cancel: {
      href: "/dashboard/subscription",
      label: translate("pages.payments.actions.settings"),
      title: translate("pages.payments.status.cancel.title"),
      description: translate("pages.payments.status.cancel.description"),
    },
    unknown: {
      href: "./",
      label: translate("pages.payments.actions.home"),
      title: translate("pages.payments.status.unknown.title"),
      description: translate("pages.payments.status.unknown.description"),
    },
  };

  const { href, label, title, description } =
    statusMap[status as keyof typeof statusMap] || statusMap.unknown;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <BackLink href={href} label={label} />
        <h2 className="text-2xl font-semibold text-center text-gray-900">
          {title}
        </h2>
        <p className="text-center text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default PaymentStatus;
