import { NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="bg-white shadow-sm border-b-4 border-[#38003c]">
            <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo / Project Name */}
                <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-[#38003c]">
                        EPL Data Analysis
                    </span>
                </div>

                {/* Links */}
                <div className="flex gap-8">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive
                                ? "text-[#38003c] font-bold border-b-4 border-[#38003c] pb-1 transition-all duration-200"
                                : "text-gray-700 hover:text-[#38003c] transition-colors duration-200 font-medium"
                        }
                    >
                        Data Analysis
                    </NavLink>

                    <NavLink
                        to="/about"
                        className={({ isActive }) =>
                            isActive
                                ? "text-[#38003c] font-bold border-b-4 border-[#38003c] pb-1 transition-all duration-200"
                                : "text-gray-700 hover:text-[#38003c] transition-colors duration-200 font-medium"
                        }
                    >
                        About
                    </NavLink>

                    <NavLink
                        to="/tools"
                        className={({ isActive }) =>
                            isActive
                                ? "text-[#38003c] font-bold border-b-4 border-[#38003c] pb-1 transition-all duration-200"
                                : "text-gray-700 hover:text-[#38003c] transition-colors duration-200 font-medium"
                        }
                    >
                        Tools
                    </NavLink>
                </div>
            </div>
        </nav>
    );
}