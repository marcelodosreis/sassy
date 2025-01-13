"use client";

import { LockClosedIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

import { useModal } from "@/hooks/useModal";

type Tab = {
    name: string;
    href: string;
    requiredPlan: "free" | "starter" | "creator" | "pro";
};

const tabs: Tab[] = [
    { name: "Free", href: "/feature1", requiredPlan: "free" },
    { name: "Starter/Creator", href: "/feature2", requiredPlan: "starter" },
    { name: "Pro", href: "/feature3", requiredPlan: "pro" },
];
type FeatureMenuProps = {
    activePlan: "free" | "starter" | "creator" | "pro";
    onTabChange: (activeTab: string) => void;
}

export default function FeatureMenu({ activePlan, onTabChange }: FeatureMenuProps) {
    const [activeTab, setActiveTab] = useState("");
    const { openModal } = useModal();


    const isTabAvailable = (requiredPlan: string): boolean => {
        if (requiredPlan === "free") return true;
        if (requiredPlan === "starter" || requiredPlan === "creator") {
            return activePlan === "starter" || activePlan === "creator" || activePlan === "pro";
        }
        if (requiredPlan === "pro") {
            return activePlan === "pro";
        }
        return false;
    };

    const availableTabs = tabs.filter((tab) => isTabAvailable(tab.requiredPlan));

    useEffect(() => {
        if (availableTabs.length > 0 && !activeTab) {
            setActiveTab(availableTabs[0].href);
        } else if (availableTabs.length === 0) {
            openModal();

            console.log("No options available for the current plan.");
        }
    }, [availableTabs, activeTab, openModal]);

    useEffect(() => {
        if (activeTab) {
            onTabChange(activeTab);
        }
    }, [activeTab, onTabChange]);

    return (
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex justify-center space-x-8 py-4 items-center">
                {tabs.map((tab) => {
                    const available = isTabAvailable(tab.requiredPlan);
                    return (
                        <li key={tab.name} className="relative group">
                            <button
                                onClick={() => available && setActiveTab(tab.href)}
                                className="flex items-center rounded-md"
                                disabled={!available}
                            >
                                <p
                                    className={`text-sm font-medium rounded-md transition ${activeTab === tab.href ? "text-indigo-600 font-extrabold" : "text-gray-700"} ${!available ? "cursor-not-allowed opacity-50" : ""}`}
                                >
                                    {tab.name}
                                </p>

                                {!available && (
                                    <LockClosedIcon
                                        className="h-5 w-5 mr-4 text-gray-500"
                                        aria-hidden="true"
                                    />
                                )}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
