"use client";

import { Menu } from "./Menu";
import { Modal } from "./Modal";
import { Navbar } from "./Navbar";

type ComponentDashboardContentProps = {
  plan: "free" | "starter" | "creator" | "pro";
};

export const DashboardContent = ({ plan }: ComponentDashboardContentProps) => {
  const handleTabChange = (tab: string) => {
    console.log(tab);
  };

  return (
    <>
      <Modal />
      <Navbar />
      <Menu onTabChange={handleTabChange} activePlan={plan} />
    </>
  );
};
