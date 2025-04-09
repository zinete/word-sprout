import React from "react";
import { Book, Search, Award, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems: NavItem[] = [
    {
      icon: <Book className="h-6 w-6" />,
      label: "学习",
      href: "/",
    },
    {
      icon: <Search className="h-6 w-6" />,
      label: "查找",
      href: "/search",
    },
    {
      icon: <Award className="h-6 w-6" />,
      label: "成就",
      href: "/achievements",
    },
    {
      icon: <User className="h-6 w-6" />,
      label: "我的",
      href: "/profile",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-1 flex justify-around items-center">
      {navItems.map((item, index) => {
        const isActive =
          currentPath === item.href ||
          (item.href === "/" && currentPath === "");

        return (
          <Link
            key={index}
            to={item.href}
            className={cn(
              "flex flex-col items-center py-2 px-3 rounded-lg",
              isActive
                ? "text-teal-500 bg-teal-50"
                : "text-gray-600 hover:text-teal-500 hover:bg-teal-50"
            )}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default Navbar;
