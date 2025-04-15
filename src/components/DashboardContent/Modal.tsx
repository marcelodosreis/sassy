"use client";

import { useI18n } from "@/hooks/useI18n";

import { Modal as ModalComponent } from "../Modal";

export function Modal() {
  const { translate } = useI18n();

  return (
    <ModalComponent title={translate("components.dashboard-content.modal.title")}>
      <div className="bg-white py-4 rounded-lg text-center">
        <button className="absolute top-2 right-2 text-xl text-gray-500 hover:text-gray-700">
          &times;
        </button>
        <p className="text-lg mb-4">
          {translate("components.dashboard-content.modal.description")}
        </p>
        <a
          href="/dashboard/subscription"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md w-full hover:bg-indigo-800 transition duration-300"
        >
          {translate("components.dashboard-content.modal.actions.proceed")}
        </a>
      </div>
    </ModalComponent>
  );
}
