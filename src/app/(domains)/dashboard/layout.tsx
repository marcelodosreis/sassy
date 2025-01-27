import DashboardNavbar from "@/components/DashboardNavbar";

type Props = {
    children: React.ReactNode;
}

export default async function DashboardLayout({ children }: Props) {
    return (
        <div className="flex h-screen bg-white">
            <div className="flex-1 flex flex-col">
                <DashboardNavbar />
                {children}
            </div>
        </div>

    );
}
