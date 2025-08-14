import React, { useEffect, useRef } from "react";

import { useModal } from "@/contexts/ModalContext";

interface ModalProps {
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, children }) => {
  const { isModalOpen, closeModal } = useModal();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeModal]);

  if (!isModalOpen) return null;

  return (
    <div className="text-gray-700 fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4 sm:px-8">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg max-w-lg w-full sm:w-auto"
      >
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export { Modal };
