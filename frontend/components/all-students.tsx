"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Student } from "@/app/page";

interface AllStudentsProps {
  students: Student[];
}

export function AllStudents({ students }: AllStudentsProps) {
  console.log(students);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Students</h2>
          <p className="text-gray-600 mt-1">
            Manage and view all student records
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Records</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Name
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Email
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Fees Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student, index) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">
                        {student.name}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-600">{student.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge
                        variant={student.feeStatus ? "default" : "destructive"}
                        className={
                          student.feeStatus
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-red-100 text-red-800 hover:bg-red-100"
                        }
                      >
                        {Boolean(student.feeStatus) ? "Yes" : "No"}
                      </Badge>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
