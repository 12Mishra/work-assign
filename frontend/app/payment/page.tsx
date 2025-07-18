"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  CreditCard,
  Calendar,
  Lock,
  Loader2,
  CheckCircle,
} from "lucide-react";
import axios from "axios";
import socket from "@/config/socket";

export default function PaymentPage() {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const router = useRouter();

  const formatCardNumber = (value: string) => {
    const v = value.replace(/[^0-9]/g, "");
    const parts = [];
    for (let i = 0; i < v.length; i += 4) {
      parts.push(v.substring(i, i + 4));
    }
    return parts.join(" ");
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");

    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }

    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const res = await axios.post("/api/payment", {
        amount: 5000.0,
        cardholderName,
      });
      const data = res.data;
      if (data.success) {
        setIsSuccess(true);
        socket.emit("feeStatusUpdated");
        
      } else {
        alert(data.message || "Payment failed");
      }
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          "An error occurred while processing payment."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Button
          variant="ghost"
          className="mb-6 flex items-center gap-2"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Pay Fees</CardTitle>
              <CardDescription>
                Complete your payment to update your fee status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSuccess ? (
                <div className="flex flex-col items-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-green-700">
                    Payment Successful!
                  </h3>
                  <p className="text-gray-600 mt-2 text-center">
                    Your payment has been processed successfully. Your fee
                    status has been updated.
                  </p>
                  <Button className="mt-6" onClick={() => router.push("/")}>
                    Return to Home
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">₹</span>
                      </div>
                      <Input
                        id="amount"
                        type="text"
                        className="pl-7"
                        value="5000.00"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardholderName">Cardholder Name</Label>
                    <Input
                      id="cardholderName"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      placeholder="Ram"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="cardNumber"
                      className="flex items-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      Card Number
                    </Label>
                    <Input
                      id="cardNumber"
                      value={cardNumber}
                      onChange={(e) => {
                        // Only allow numeric input and format
                        const rawValue = e.target.value.replace(/[^0-9]/g, "");
                        setCardNumber(formatCardNumber(rawValue));
                      }}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="expiryDate"
                        className="flex items-center gap-2"
                      >
                        <Calendar className="w-4 h-4" />
                        Expiry Date
                      </Label>
                      <Input
                        id="expiryDate"
                        value={expiryDate}
                        onChange={(e) =>
                          setExpiryDate(formatExpiryDate(e.target.value))
                        }
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cvv" className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        CVV
                      </Label>
                      <Input
                        id="cvv"
                        type="password"
                        value={cvv}
                        onChange={(e) =>
                          setCvv(e.target.value.replace(/[^0-9]/g, ""))
                        }
                        placeholder="***"
                        maxLength={3}
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full mt-6"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Pay Now"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4"></CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
