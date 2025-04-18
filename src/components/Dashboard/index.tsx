"use client";

import { Menu } from "./Menu";
import { Modal } from "./Modal";

type ComponentDashboardProps = {
  plan: "free" | "starter" | "creator" | "pro";
};

export const Dashboard = ({ plan }: ComponentDashboardProps) => {
  const handleTabChange = (tab: string) => {
    console.log(tab);
  };

  return (
    <>
      <Modal />
      <Menu onTabChange={handleTabChange} activePlan={plan} />
    </>
  );
};
