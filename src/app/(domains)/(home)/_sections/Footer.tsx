"use client";

import { ROUTES } from "@/constants/ROUTES";
import { useI18n } from "@/hooks/useI18n"

type FooterProps = {
  isDashboard?: boolean;
};

export default function Footer({ isDashboard }: FooterProps) {
  const { translate } = useI18n();

  return (
    <>
      {!isDashboard && (
        <footer id="footer" className="py-20 px-4 bg-indigo-600 text-white">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">
              {translate("home-footer-title")}
            </h2>
            <div className="flex justify-center space-x-4">
              <a
                href={ROUTES.dashboard}
                className="py-3 px-8 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition"
              >
                {translate("home-footer-join")}
              </a>
            </div>
          </div>
          <div className="mt-12 text-center border-t border-indigo-500 pt-8">
            <div className="flex justify-center space-x-6">
              <a
                href="/terms-and-privacy"
                className="text-sm hover:underline"
              >
                {translate("home-footer-terms")}
              </a>
              <a
                href="https://github.com/marcelodosreis/sassy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline"
              >
                {translate("home-footer-github")}
              </a>
            </div>
            <p className="mt-6 text-sm text-gray-300">
              {translate("home-footer-copyright")}
            </p>
          </div>
        </footer>
      )}
    </>
  );
}
