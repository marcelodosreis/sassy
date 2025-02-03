'use client';

import { useI18n } from "@/hooks/useI18n";

import FeatureMenu from "./FeatureMenu";
import Modal from "./Modal";

type ComponentClientDashboardProps = {
    plan: "free" | "starter" | "creator" | "pro";
}

export const ClientDashboard = ({ plan }: ComponentClientDashboardProps) => {
    const { translate } = useI18n();

    const handleTabChange = (tab: string) => {
        console.log(tab);
    };

    return (
        <>
            <FeatureMenu
                onTabChange={handleTabChange}
                activePlan={plan}
            />
            <Modal title={translate("component-client-dashboard-modal-title")}>
                <div className="bg-white py-4 rounded-lg text-center">
                    <button className="absolute top-2 right-2 text-xl text-gray-500 hover:text-gray-700">
                        &times;
                    </button>
                    <p className="text-lg mb-4">
                        {translate("component-client-dashboard-modal-text")}
                    </p>
                    <a
                        href="/dashboard/subscription"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md w-full hover:bg-indigo-800 transition duration-300"
                    >
                        {translate("component-client-dashboard-modal-button")}
                    </a>
                </div>
            </Modal>
        </>
    );
};
