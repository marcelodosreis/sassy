import LanguageSelector from "./LanguageSelector";
import MyAccount from "./MyAccount";

export default function DashboardNavbar() {
    return (
        <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <a href="/dashboard" className="cursor-pointer">
                            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                        </a>
                    </div>
                    <div className="flex items-center space-x-4">
                        <MyAccount />
                        <LanguageSelector />
                        {/* <Notification /> */}
                    </div>
                </div>
            </div>
        </header>

    );
}
