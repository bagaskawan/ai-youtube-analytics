"use client";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { GithubButton } from "@/components/auth/GithubButton";
import { Inter } from "next/font/google";
import Image from "next/image";

const inter = Inter({
  weight: ["700", "800"],
  subsets: ["latin"],
});

export default function LoginPage() {
  return (
    <div className="h-screen flex flex-col lg:flex-row">
      {/* Left Side - Illustration */}
      <div className="relative hidden w-3/5 lg:block">
        <Image
          src="/loginpage.png"
          alt="Illustration of a person analyzing charts on a screen"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 0vw, 60vw"
        />
      </div>
      {/* Right Side - Login Form */}
      <div className="flex w-full items-center justify-center bg-white p-8 lg:w-2/5">
        <Card className="w-full max-w-md border-0 shadow-none">
          <CardContent className="px-0 space-y-8">
            {/* Header Text */}
            <div className="space-y-4">
              <h1
                className={cn(
                  "text-5xl font-extrabold leading-[1.1] text-[#393E46]",
                  inter.className
                )}
              >
                Yes, your unfair <span className="text-[#A62C2C]">Youtube</span>{" "}
                advantage exists. Ideate, optimize, and dominate your niche.
              </h1>
            </div>

            {/* Sign in Buttons */}
            <div className="space-y-4 pt-4">
              <GoogleButton
                className="w-full h-14 bg-white border-2 border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-base font-medium"
                onClick={() => console.log("Google Sign In Clicked")}
              />
              <GithubButton
                onClick={() => console.log("GitHub Sign In Clicked")}
                className="w-full h-14 border-2 border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-base font-medium"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
