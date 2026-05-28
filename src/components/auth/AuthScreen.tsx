"use client";

import { useState } from "react";
import { ArrowLeft, Loader2, Lock, Mail, ShieldCheck, User } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { cn } from "@/lib/utils";

type Mode = "signin" | "signup";
type Pending = { name: string; email: string; password: string; token: string };

const inputClass =
  "w-full rounded-xl border border-white/10 bg-ink-950/60 py-3 pl-11 pr-4 text-sm text-white placeholder:text-ink-500 outline-none transition-colors focus:border-brand-400/70 focus:ring-2 focus:ring-brand-400/30 disabled:opacity-60";

export function AuthScreen() {
  const { signIn, startSignUp, completeSignUp } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [pending, setPending] = useState<Pending | null>(null);

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
    setInfo("");
    setPending(null);
  }

  async function handleSignin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setLoading(true);
    setError("");
    try {
      await signIn({
        email: String(data.get("email") ?? ""),
        password: String(data.get("password") ?? ""),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  async function handleCredentials(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");
    setLoading(true);
    setError("");
    setInfo("");
    try {
      const token = await startSignUp({ name, email, password });
      setPending({ name: name.trim(), email: email.trim().toLowerCase(), password, token });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!pending) return;
    const data = new FormData(event.currentTarget);
    const code = String(data.get("code") ?? "");
    setLoading(true);
    setError("");
    try {
      await completeSignUp({ ...pending, code });
      // Success unmounts this screen (the gate renders the app).
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  async function resendCode() {
    if (!pending) return;
    setLoading(true);
    setError("");
    setInfo("");
    try {
      const token = await startSignUp({
        name: pending.name,
        email: pending.email,
        password: pending.password,
      });
      setPending({ ...pending, token });
      setInfo("A new code is on its way.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const verifying = mode === "signup" && pending !== null;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden py-12">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-spotlight" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-faint bg-[size:64px_64px] opacity-40 mask-fade-b" />

      <Container className="max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="ring-gradient card p-7 sm:p-8">
          {verifying ? (
            <VerifyStep
              email={pending.email}
              loading={loading}
              error={error}
              info={info}
              onSubmit={handleVerify}
              onResend={resendCode}
              onBack={() => {
                setPending(null);
                setError("");
                setInfo("");
              }}
            />
          ) : (
            <>
              <h1 className="text-center font-display text-2xl font-semibold tracking-tight text-white">
                {mode === "signin" ? "Welcome back" : "Create your account"}
              </h1>
              <p className="mt-2 text-center text-sm text-ink-400">
                {mode === "signin"
                  ? "Sign in to access your VexelSP workspace."
                  : "We'll email you a code to confirm it's really you."}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
                {(["signin", "signup"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => switchMode(m)}
                    className={cn(
                      "rounded-lg py-2 text-sm font-medium transition-colors",
                      mode === m
                        ? "bg-brand-500 text-white shadow-glow"
                        : "text-ink-300 hover:text-white",
                    )}
                  >
                    {m === "signin" ? "Sign in" : "Sign up"}
                  </button>
                ))}
              </div>

              <form
                onSubmit={mode === "signin" ? handleSignin : handleCredentials}
                className="mt-6 flex flex-col gap-3"
                noValidate
              >
                {mode === "signup" && (
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
                    <input
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Full name"
                      disabled={loading}
                      className={inputClass}
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Email address"
                    disabled={loading}
                    className={inputClass}
                  />
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
                  <input
                    name="password"
                    type="password"
                    required
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                    placeholder={mode === "signin" ? "Password" : "Password (min. 6 characters)"}
                    disabled={loading}
                    className={inputClass}
                  />
                </div>

                {error && (
                  <p
                    role="alert"
                    className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300"
                  >
                    {error}
                  </p>
                )}

                <Button type="submit" size="lg" disabled={loading} className="mt-1 w-full">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Please wait…
                    </>
                  ) : mode === "signin" ? (
                    "Sign in"
                  ) : (
                    "Continue"
                  )}
                </Button>
              </form>

              <div className="my-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-white/10" />
                <span className="text-xs uppercase tracking-widest text-ink-500">or</span>
                <span className="h-px flex-1 bg-white/10" />
              </div>

              <GoogleButton />
            </>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-ink-500">
          By continuing you agree to our Terms and Privacy Policy.
        </p>
      </Container>
    </div>
  );
}

type VerifyStepProps = {
  email: string;
  loading: boolean;
  error: string;
  info: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onResend: () => void;
  onBack: () => void;
};

function VerifyStep({ email, loading, error, info, onSubmit, onResend, onBack }: VerifyStepProps) {
  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        disabled={loading}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-400 transition-colors hover:text-white disabled:opacity-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="mb-5 flex justify-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-500/15 text-brand-300">
          <ShieldCheck className="h-7 w-7" />
        </span>
      </div>

      <h1 className="text-center font-display text-2xl font-semibold tracking-tight text-white">
        Verify your email
      </h1>
      <p className="mt-2 text-center text-sm text-ink-400">
        Enter the 6-digit code we sent to{" "}
        <span className="font-medium text-ink-200">{email}</span>.
      </p>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3" noValidate>
        <input
          name="code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          maxLength={6}
          pattern="\d{6}"
          placeholder="● ● ● ● ● ●"
          disabled={loading}
          autoFocus
          className="w-full rounded-xl border border-white/10 bg-ink-950/60 px-4 py-3 text-center text-2xl font-semibold tracking-[0.5em] text-white placeholder:tracking-[0.3em] placeholder:text-ink-600 outline-none transition-colors focus:border-brand-400/70 focus:ring-2 focus:ring-brand-400/30 disabled:opacity-60"
        />

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300"
          >
            {error}
          </p>
        )}
        {info && !error && (
          <p className="rounded-xl border border-brand-500/30 bg-brand-500/10 px-4 py-2.5 text-sm text-brand-200">
            {info}
          </p>
        )}

        <Button type="submit" size="lg" disabled={loading} className="mt-1 w-full">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying…
            </>
          ) : (
            "Verify & create account"
          )}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-ink-400">
        Didn&apos;t get it?{" "}
        <button
          type="button"
          onClick={onResend}
          disabled={loading}
          className="font-medium text-brand-300 transition-colors hover:text-brand-200 disabled:opacity-50"
        >
          Resend code
        </button>
      </p>
    </div>
  );
}
