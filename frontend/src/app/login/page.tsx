"use client";

import React from "react";
import { LoginBranding } from "@/components/features/auth/LoginBranding";
import { LoginForm } from "@/components/features/auth/LoginForm";

export default function LoginPage() {
  return (
    <div style={{ display: "flex", width: "100vw", minHeight: "100vh" }}>
      {/* Left — dark branding panel */}
      <LoginBranding />
      {/* Right — form panel */}
      <LoginForm />
    </div>
  );
}
