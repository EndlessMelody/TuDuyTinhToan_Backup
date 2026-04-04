"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, ChevronLeft } from "lucide-react";
import { MOCK_USER } from "@/constants/mock-data";
import { useAuth } from "@/context/AuthContext";

type View = "login" | "signup";
type LoadingType = null | "google" | "email" | "mock";

export function LoginForm() {
  const router = useRouter();
  const auth = useAuth();
  const [view, setView] = useState<View>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<LoadingType>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }
    setLoading("email");
    await auth.login("email");
    setLoading(null);
    router.push("/discover");
  };

  const handleGoogleLogin = async () => {
    setLoading("google");
    await auth.login("google");
    setLoading(null);
    router.push("/discover");
  };

  const handleMockLogin = async () => {
    setLoading("mock");
    await auth.login("email");
    setLoading(null);
    router.push("/discover");
  };

  return (
    <div
      style={{
        flex: 1,
        minHeight: "100vh",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 52px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Back to promo */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          onClick={() => router.push("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(0,0,0,0.4)",
            fontSize: 13,
            fontWeight: 500,
            marginBottom: 40,
            padding: 0,
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = "#1C1C1E";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = "rgba(0,0,0,0.4)";
          }}
        >
          <ChevronLeft size={15} />
          Back to home
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 32 }}
        >
          <h2
            style={{
              margin: "0 0 8px",
              fontSize: 26,
              fontWeight: 800,
              color: "#1C1C1E",
              letterSpacing: "-0.8px",
            }}
          >
            {view === "login" ? "Welcome back" : "Create account"}
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: "rgba(0,0,0,0.45)",
              lineHeight: 1.5,
            }}
          >
            {view === "login"
              ? "Sign in to continue to TasteMap"
              : "Start mapping your food journey today"}
          </p>
        </motion.div>

        {/* Mock user quick-login */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
          onClick={handleMockLogin}
          disabled={loading !== null}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 16px",
            borderRadius: 14,
            backgroundColor: "rgba(0,0,0,0.02)",
            border: "1.5px solid rgba(0,122,255,0.2)",
            cursor: loading !== null ? "not-allowed" : "pointer",
            textAlign: "left",
            marginBottom: 16,
            transition: "border-color 0.15s, background 0.15s",
            opacity: loading !== null ? 0.7 : 1,
          }}
          onMouseEnter={(e) => {
            if (loading === null) {
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(0,122,255,0.5)";
              (e.currentTarget as HTMLElement).style.backgroundColor =
                "rgba(0,122,255,0.03)";
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor =
              "rgba(0,122,255,0.2)";
            (e.currentTarget as HTMLElement).style.backgroundColor =
              "rgba(0,0,0,0.02)";
          }}
        >
          <div style={{ position: "relative", flexShrink: 0 }}>
            <img
              src={MOCK_USER.avatar}
              alt=""
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "2px solid rgba(0,122,255,0.2)",
                display: "block",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: "#34C759",
                border: "2px solid white",
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                marginBottom: 2,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: "#1C1C1E" }}>
                {MOCK_USER.name}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#007AFF",
                  backgroundColor: "rgba(0,122,255,0.08)",
                  padding: "2px 7px",
                  borderRadius: 6,
                }}
              >
                MOCK
              </span>
            </div>
            <span style={{ fontSize: 12, color: "rgba(0,0,0,0.4)" }}>
              Continue as this demo user
            </span>
          </div>
          <ArrowRight size={15} color="rgba(0,0,0,0.3)" />
        </motion.button>

        {/* Google button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading !== null}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: "12px",
            borderRadius: 11,
            marginBottom: 16,
            backgroundColor: "white",
            border: "1.5px solid rgba(0,0,0,0.1)",
            cursor: loading !== null ? "not-allowed" : "pointer",
            fontSize: 14,
            fontWeight: 600,
            color: "#1C1C1E",
            opacity: loading !== null ? 0.6 : 1,
            transition: "border-color 0.15s, box-shadow 0.15s",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
          onMouseEnter={(e) => {
            if (loading === null) {
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(0,0,0,0.25)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 2px 8px rgba(0,0,0,0.1)";
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor =
              "rgba(0,0,0,0.1)";
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 1px 4px rgba(0,0,0,0.06)";
          }}
        >
          {loading === "google" ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              style={{ animation: "spin 0.8s linear infinite", flexShrink: 0 }}
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="rgba(0,0,0,0.15)"
                strokeWidth="3"
              />
              <path
                d="M12 2a10 10 0 0 1 10 10"
                stroke="#4285F4"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              style={{ flexShrink: 0 }}
            >
              <path
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                fill="#4285F4"
              />
              <path
                d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                fill="#34A853"
              />
              <path
                d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                fill="#FBBC05"
              />
              <path
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"
                fill="#EA4335"
              />
            </svg>
          )}
          {loading === "google" ? "Connecting…" : "Continue with Google"}
        </motion.button>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div
            style={{ flex: 1, height: 1, backgroundColor: "rgba(0,0,0,0.08)" }}
          />
          <span
            style={{
              fontSize: 12,
              color: "rgba(0,0,0,0.3)",
              whiteSpace: "nowrap",
            }}
          >
            or sign in with email
          </span>
          <div
            style={{ flex: 1, height: 1, backgroundColor: "rgba(0,0,0,0.08)" }}
          />
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.45 }}
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          {view === "signup" && (
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#1C1C1E",
                  marginBottom: 6,
                }}
              >
                Full name
              </label>
              <input
                type="text"
                placeholder="Your name"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: "1.5px solid rgba(0,0,0,0.1)",
                  fontSize: 14,
                  color: "#1C1C1E",
                  outline: "none",
                  transition: "border-color 0.15s",
                  backgroundColor: "white",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(0,122,255,0.4)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(0,0,0,0.1)";
                }}
              />
            </div>
          )}

          <div>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: "#1C1C1E",
                marginBottom: 6,
              }}
            >
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 14px",
                borderRadius: 10,
                border: "1.5px solid rgba(0,0,0,0.1)",
                fontSize: 14,
                color: "#1C1C1E",
                outline: "none",
                transition: "border-color 0.15s",
                backgroundColor: "white",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(0,122,255,0.4)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(0,0,0,0.1)";
              }}
            />
          </div>

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <label
                style={{ fontSize: 12, fontWeight: 600, color: "#1C1C1E" }}
              >
                Password
              </label>
              {view === "login" && (
                <button
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 12,
                    color: "#007AFF",
                    fontWeight: 500,
                    padding: 0,
                  }}
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px 42px 12px 14px",
                  borderRadius: 10,
                  border: "1.5px solid rgba(0,0,0,0.1)",
                  fontSize: 14,
                  color: "#1C1C1E",
                  outline: "none",
                  transition: "border-color 0.15s",
                  backgroundColor: "white",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(0,122,255,0.4)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(0,0,0,0.1)";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(0,0,0,0.35)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 9,
                backgroundColor: "rgba(255,59,48,0.07)",
                border: "1px solid rgba(255,59,48,0.15)",
              }}
            >
              <span style={{ fontSize: 13, color: "#D70015" }}>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading !== null}
            style={{
              marginTop: 4,
              width: "100%",
              padding: "13px",
              borderRadius: 11,
              background:
                loading !== null
                  ? "rgba(0,122,255,0.5)"
                  : "linear-gradient(135deg, #1A7AFF, #0057D9)",
              border: "none",
              cursor: loading !== null ? "not-allowed" : "pointer",
              color: "white",
              fontSize: 15,
              fontWeight: 700,
              boxShadow:
                loading !== null ? "none" : "0 4px 16px rgba(0,100,255,0.28)",
              transition: "box-shadow 0.15s, background 0.15s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {loading === "email" ? (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ animation: "spin 0.8s linear infinite" }}
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="3"
                  />
                  <path
                    d="M12 2a10 10 0 0 1 10 10"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                Signing in…
              </>
            ) : (
              <>
                {view === "login" ? "Sign in" : "Create account"}{" "}
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </motion.form>

        {/* Toggle login / signup */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            margin: "20px 0 0",
            textAlign: "center",
            fontSize: 13,
            color: "rgba(0,0,0,0.45)",
          }}
        >
          {view === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <button
            onClick={() => {
              setView(view === "login" ? "signup" : "login");
              setError("");
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 700,
              color: "#007AFF",
              padding: 0,
            }}
          >
            {view === "login" ? "Sign up" : "Sign in"}
          </button>
        </motion.p>

        {/* Footer note */}
        <p
          style={{
            margin: "28px 0 0",
            textAlign: "center",
            fontSize: 11,
            color: "rgba(0,0,0,0.25)",
            lineHeight: 1.6,
          }}
        >
          Authentication is mocked — any credentials work.
          <br />
          Real auth coming in the next release.
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
