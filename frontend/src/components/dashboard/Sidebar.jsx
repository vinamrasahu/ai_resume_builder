import { FileText, Briefcase, ListChecks, User } from "lucide-react";

const NAV_ITEMS = [
    { key: "resuse", label: "Resume", icon: FileText },
    { key: "templates", label: "Cover Letter", icon: Briefcase },
    { key: "job-tracker", label: "Job Tracker", icon: ListChecks },
];

function Sidebar({ active, onNavigate }) {
    return (
        <aside className="flex h-full w-full flex-col bg-[#f0faff] px-4 py-6 md:w-65 md:px-5 md:pl-10 md:h-screen">
            <div className="mb-8 flex items-center gap-2 px-1">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-sm">
                    <FileText size={18} />
                </div>
                <span className="text-xl font-extrabold tracking-tight text-gray-900">flowcv</span>
            </div>

            <nav className="flex flex-1 flex-col gap-1">
                {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
                    const isActive = key === active;
                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => onNavigate(key)}
                            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[15px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 ${isActive
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-600 hover:bg-white/60 hover:text-gray-900"
                                }`}
                        >
                            <Icon size={18} className={isActive ? "text-rose-500" : "text-gray-400"} />
                            {label}
                        </button>
                    );
                })}
            </nav>

            <div className="mt-6 flex flex-col gap-1 border-t border-gray-300/60 pt-4">
                <a href="#" className="rounded-xl px-3 py-2 text-sm font-medium text-gray-600 hover:bg-white/60">
                    Plans &amp; Pricing
                </a>
                <a href="#" className="rounded-xl px-3 py-2 text-sm font-medium text-gray-600 hover:bg-white/60">
                    Student Benefits
                </a>
                <button
                    type="button"
                    className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-white/60"
                >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                        <User size={16} />
                    </span>
                    My account
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;