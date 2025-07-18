"use client";

import { motion } from "framer-motion";
import { Users, User, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const tabs = [
    { id: "students", name: "All Students", icon: Users },
    { id: "profile", name: "Profile", icon: User },
  ];

  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href='/'>
              <h1 className="text-xl font-bold text-gray-900">
                Student Dashboard
              </h1>
            </Link>
          </div>

          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-background"
                      className="absolute inset-0 bg-white rounded-md shadow-sm"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">{tab.name}</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-3">
            {session && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  signOut();
                }}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
