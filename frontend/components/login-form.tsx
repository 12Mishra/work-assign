import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { createUser } from "@/actions/createUser";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import socket from "@/config/socket";

export function Form() {
  const router = useRouter();

  const [tab, setTab] = useState<"login" | "signup">("login");
  const [loading, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (tab === "login") {
      startTransition(async () => {
        const res = await signIn("credentials", {
          redirect: false,
          email: form.email,
          password: form.password,
        });
        if (res?.error) {
          setError(res.error);
        } else {
          toast("Successfully logged in! Redirecting.... ");
          setTimeout(() => {
            router.push("/");
          }, 1000);
        }
      });
    } else {
      if (!form.name) {
        setError("Name is required");
        return;
      }
      startTransition(async () => {
        const res = await createUser({
          name: form.name,
          email: form.email,
          password: form.password,
        });
        if (res.success) {
          toast(res.message);
          setTab("login");
          socket.emit("newUserAdded");
        } else {
          toast(res.message);
        }
      });
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex gap-2 mb-2">
          <Button
            variant={tab === "login" ? "default" : "ghost"}
            onClick={() => setTab("login")}
            type="button"
            className="flex-1"
          >
            Login
          </Button>
          <Button
            variant={tab === "signup" ? "default" : "ghost"}
            onClick={() => setTab("signup")}
            type="button"
            className="flex-1"
          >
            Sign Up
          </Button>
        </div>
        <CardTitle>
          {tab === "login" ? "Login to your account" : "Create an account"}
        </CardTitle>
        <CardDescription>
          {tab === "login"
            ? "Enter your email below to login to your account"
            : "Enter your details below to create a new account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {tab === "signup" && (
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required={tab === "signup"}
                disabled={loading}
              />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="password"
              disabled={loading}
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? tab === "login"
                ? "Logging in..."
                : "Signing up..."
              : tab === "login"
              ? "Login"
              : "Sign Up"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
