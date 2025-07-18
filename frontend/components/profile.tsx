"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, CreditCard, CheckCircle, Edit2, Save } from "lucide-react";
import type { Student } from "@/app/page";
import { Form } from "./login-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axios from "axios";

export type ProfileProps = { user?: Student };

export function Profile({ user }: ProfileProps) {
  const router = useRouter();

  const { data: session } = useSession();
  const userDetails = user || session?.user;

  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userDetails?.name || "",
    email: userDetails?.email || "",
  });

  useEffect(() => {
    if (session) {
      setisLoggedIn(true);
    }
  }, [session]);

  const handleFeePayment = async () => {
    router.push("/payment");
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      setIsUpdating(true);
      try {
        const res = await axios.put("/api/students", {
          name: formData.name,
          email: formData.email,
        });
        const data = res.data;
        if (data.success) {
          setIsEditing(false);
          // Optionally update UI or show a success message
        } else {
          alert(data.message || "Failed to update user");
        }
      } catch (error: any) {
        alert(
          error?.response?.data?.message ||
            "An error occurred while updating user"
        );
      } finally {
        setIsUpdating(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return isLoggedIn ? (
    <>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
          <p className="text-gray-600 mt-1">Manage your account information</p>
        </div>
        <Button
          variant="outline"
          onClick={handleEditToggle}
          className="flex items-center gap-2 bg-transparent"
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4" />
              Save
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4" />
              Edit
            </>
          )}
        </Button>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {user?.name}
                      </div>
                      <div className="text-sm text-gray-500">Student</div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center gap-3 pt-2">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">{userDetails?.email}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Fee Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">
                    Current Status
                  </div>
                  <Badge
                    variant={user?.feeStatus ? "default" : "destructive"}
                    className={
                      user?.feeStatus
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-red-100 text-red-800 hover:bg-red-100 mt-4 text-md"
                    }
                  >
                    {user?.feeStatus ? "Paid" : "Pending"}
                  </Badge>
                </div>
              </div>

              {isUpdating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-sm text-blue-600"
                >
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  Updating status...
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {!user?.feeStatus && (
        <Card className="border-orange-200 bg-orange-50 mt-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CreditCard className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <h3 className="font-medium text-orange-900">
                  Payment Reminder
                </h3>
                <p className="text-sm text-orange-700 mt-1">
                  Your fees are currently pending. Please complete your payment
                  to avoid any academic holds on your account.
                </p>
                <Button
                  size="sm"
                  className="mt-3 bg-orange-600 hover:bg-orange-700"
                  onClick={handleFeePayment}
                >
                  Pay Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  ) : (
    <div className="flex items-center justify-center">
      <Form />
    </div>
  );
}
