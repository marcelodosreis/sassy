"use client";

import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/solid";
import { useState, useEffect, useRef } from "react";

import { useI18n } from "@/contexts/i18nContext";
import { supabase } from "@/libs/supabase/client";
import AuthService from "@/services/auth";

const authService = new AuthService(supabase);

function MyAccount() {
  const { translate } = useI18n("components.dashboard.navbar.my-account");
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="text-gray-700 hover:text-indigo-600 font-medium focus:outline-hidden"
      >
        {translate("options.button")}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <a
            href="/dashboard/settings"
            className="font-bold block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            {translate("options.profile")}
          </a>
          <hr />
          <a
            href="/dashboard/subscription"
            className="block px-4 py-2 text-gray-500 hover:bg-gray-100"
          >
            {translate("options.subscription")}
          </a>
          <hr />
          <a
            href="/terms-and-privacy"
            className="block px-4 py-2 text-gray-500 hover:bg-gray-100"
          >
            {translate("options.terms-privacy")}
          </a>
          <hr />
          <a
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
            onClick={async () => {
              await authService.signOut();
              window.location.reload();
            }}
          >
            <p>{translate("options.sign-out")}</p>
            <ArrowRightEndOnRectangleIcon className="h-5 w-5 text-gray-500" />
          </a>
        </div>
      )}
    </div>
  );
}

export default MyAccount;
