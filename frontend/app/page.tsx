"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { AllStudents } from "@/components/all-students";
import { Profile } from "@/components/profile";
import axios from "axios";
import { useSession } from "next-auth/react";
import socket from "@/config/socket";

export type Student = {
  id: string;
  name: string;
  email: string;
  feeStatus: boolean;
};

export default function Dashboard() {
  const { data: session } = useSession();

  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (session) {
      setUserId(session.user?.id || "");
    }
  }, [session]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("/api/students");
        if (response.data.success) {
          setStudents(response.data.students);

          if (session) {
            const foundUser = response.data.students.find(
              (s: Student) =>
                s.id === session.user?.id || s.email === session.user?.email
            );
            setUser(foundUser);
          }
        } else {
          console.error("Error in fetching students");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchStudents();

    socket.on("refreshStudents", () => {
      console.log("Refreshing student list");
      fetchStudents();
    });

    socket.on("refreshNewStudents", () => {
      console.log("Refreshing student list with added user");
      fetchStudents();
    });

    return () => {
      socket.off("refreshStudents");
    };
  }, [session]);

  const [activeTab, setActiveTab] = useState("students");

  const [students, setStudents] = useState<Student[]>([]);
  const [user, setUser] = useState<Student | undefined>(undefined);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "students" ? (
            <AllStudents students={students} />
          ) : (
            <Profile user={user} />
          )}
        </motion.div>
      </main>
    </div>
  );
}
