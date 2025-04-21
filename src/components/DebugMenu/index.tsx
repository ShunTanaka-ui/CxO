import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

export const DebugMenu = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { path: "/", label: "トップページ" },
    { path: "/diagnostic", label: "診断ページ" },
    { path: "/personal-info", label: "個人情報ページ" },
    { path: "/result", label: "診断結果ページ" },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="absolute bottom-14 right-0 bg-white rounded-lg shadow-lg p-2 w-48">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};