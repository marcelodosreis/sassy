import { Routes } from "@/constants/Routes";


type FooterProps = {
    isDashboard?: boolean;
}
export default function Footer({ isDashboard }: FooterProps) {
    return (
        <>
            {!isDashboard && <footer id="footer" className="py-20 px-4 bg-indigo-600 text-white">
                <div className="text-center">
                    <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
                    <div className="flex justify-center space-x-4">
                        <a
                            href={Routes.dashboard}
                            className="py-3 px-8 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition"
                        >
                            Join Sassy Today
                        </a>
                    </div>
                </div>
                <div className="mt-12 text-center border-t border-indigo-500 pt-8">
                    <div className="flex justify-center space-x-6">
                        <a
                            href="/terms-and-privacy"
                            className="text-sm hover:underline"
                        >
                            Terms & Privacy
                        </a>
                        <a
                            href="https://github.com/marcelodosreis/sassy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm hover:underline"
                        >
                            GitHub
                        </a>
                    </div>
                    <p className="mt-6 text-sm text-gray-300">
                        © {new Date().getFullYear()} Sassy. All rights reserved.
                    </p>
                </div>
            </footer>}
        </>
    );
}
