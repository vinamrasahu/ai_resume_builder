import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  User,
  LayoutTemplate,
} from "lucide-react";

const Navbar = ({
  activeView,
  setActiveView,
}) => {
  return (
    <header className="sticky top-0 z-50 h-[58px] w-full border-b border-gray-200 bg-white">

      <div className="flex h-full items-center justify-between px-4 sm:px-6">

        {/* Left */}
        <div className="flex items-center gap-4">

          <Link
            to="/dashboard"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back To Dashboard
          </Link>

          {/* Mobile Edit / Preview */}
          <div className="flex h-[44px] w-[200px] items-center rounded-xl bg-[#f5f7fa] p-1 sm:hidden">

            <button
              type="button"
              onClick={() => setActiveView("edit")}
              className={`h-full flex-1 rounded-lg text-sm font-medium transition-all ${
                activeView === "edit"
                  ? "bg-white text-[#1597ee] shadow-sm"
                  : "text-gray-500"
              }`}
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() => setActiveView("preview")}
              className={`h-full flex-1 rounded-lg text-sm font-medium transition-all ${
                activeView === "preview"
                  ? "bg-white text-[#1597ee] shadow-sm"
                  : "text-gray-500"
              }`}
            >
              Preview
            </button>

          </div>

        </div>


        {/* Desktop Right */}
        <div className="hidden items-center gap-3 sm:flex">

          {/* Resume Score */}
          <div className="flex items-center gap-2">

            <span className="rounded-md bg-green-500 px-2 py-1 text-xs font-bold text-white">
              90%
            </span>

            <span className="text-sm text-gray-600">
              Your resume score 🤩
            </span>

          </div>


          {/* Change Template */}
          <button
            type="button"
            className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <LayoutTemplate className="h-4 w-4" />
            Change Template
          </button>


          {/* Profile */}
          <button
            type="button"
            className="ml-2 flex h-9 w-9 items-center justify-center rounded-full border border-pink-400 text-pink-500 transition-colors hover:bg-pink-50"
          >
            <User className="h-4 w-4" />
          </button>

        </div>

      </div>

    </header>
  );
};

export default Navbar;