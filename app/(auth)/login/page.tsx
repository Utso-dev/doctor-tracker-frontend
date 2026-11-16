"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Activity, ArrowRight, CheckCircle2 } from "lucide-react";
import ReusableInput from "@/components/reusable/InputFiled/ReusableInput";
import { CookieHelper } from "@/helper/cookie.helper";
import { UserService } from "@/service/user/user.service";

// Zod validation schema
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError("");
    setLoading(true);

    try {
      const res = await UserService.login({
        email: values.email,
        password: values.password,
      });

      const data = res.data;
      if (data.success || data.status === "success") {
        const token = data.data?.token || data.token;
        if (token) {

          CookieHelper.set({ key: "accessToken", value: token });
        }
        router.push("/dashboard");
      } else {
        setServerError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (err: any) {
      setServerError(
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred during login."
      );
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-bgColor flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primaryColor text-whiteColor mb-4 shadow-lg shadow-primaryColor/25">
            <Activity className="w-8 h-8 text-secondaryColor" />
          </div>
          <h1 className="text-2xl font-bold text-headerColor tracking-tight">
            Doctor<span className="text-secondaryColor">Tracker</span>
          </h1>
          <p className="text-sm text-descriptionColor mt-1">
            Sign in to access the secure administrative portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-whiteColor rounded-2xl shadow-xl border border-borderColor p-8">
          {serverError && (
            <div className="mb-6 p-4 rounded-xl bg-redColor/10 border border-redColor/30 text-redColor text-sm flex items-start gap-2">
              <span className="font-semibold">Error:</span> {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <ReusableInput
              label="Email Address"
              required
              type="email"
              placeholder="admin@doctortracker.com"
              {...register("email")}
              error={errors.email?.message}
            />

            <ReusableInput
              label="Password"
              required
              type="password"
              placeholder="••••••••"
              {...register("password")}
              error={errors.password?.message}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-md bg-primaryColor text-whiteColor font-medium text-sm hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md shadow-primaryColor/20 cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-whiteColor border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-grayColor1">
            Don&apos;t have an account?{" "}
            <Link
              href="/registration"
              className="text-primaryColor font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
