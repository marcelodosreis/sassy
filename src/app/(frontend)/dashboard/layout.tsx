import { Navbar } from "@/components/v1/Dashboard/Navbar";

type Props = {
  children: React.ReactNode;
};

export default async function DashboardLayout({ children }: Props) {
  return (
    <>
      <Navbar />
      <div className="flex h-screen bg-white">
        <div className="flex-1 flex flex-col">{children}</div>
      </div>
    </>
  );
}
