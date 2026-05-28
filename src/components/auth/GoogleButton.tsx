"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth";

const SCRIPT_SRC = "https://accounts.google.com/gsi/client";

// Minimal shape of the Google Identity Services API we use.
type GoogleId = {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: { credential: string }) => void;
      }) => void;
      renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleId;
  }
}

function decodeJwt(token: string): { email?: string; name?: string; picture?: string } {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return {};
  }
}

export function GoogleButton() {
  const { signInWithGoogle } = useAuth();
  const ref = useRef<HTMLDivElement>(null);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!clientId || !ref.current) return;
    let cancelled = false;

    function init() {
      if (cancelled || !window.google || !ref.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId as string,
        callback: ({ credential }) => {
          const data = decodeJwt(credential);
          if (data.email) {
            signInWithGoogle({ email: data.email, name: data.name, picture: data.picture });
          }
        },
      });
      window.google.accounts.id.renderButton(ref.current, {
        theme: "filled_black",
        size: "large",
        text: "continue_with",
        shape: "pill",
        width: 320,
      });
    }

    if (window.google?.accounts?.id) {
      init();
      return;
    }

    let script = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    const created = !script;
    if (!script) {
      script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    const onLoad = () => init();
    const onError = () => setFailed(true);
    script.addEventListener("load", onLoad);
    script.addEventListener("error", onError);

    return () => {
      cancelled = true;
      script?.removeEventListener("load", onLoad);
      script?.removeEventListener("error", onError);
      if (created) script?.remove();
    };
  }, [clientId, signInWithGoogle]);

  if (!clientId) {
    return (
      <div className="flex flex-col items-center gap-1.5">
        <button
          type="button"
          disabled
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-ink-400"
        >
          <GoogleGlyph />
          Continue with Google
        </button>
        <p className="text-center text-xs text-ink-500">
          Set <code className="text-ink-400">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> to enable Google.
        </p>
      </div>
    );
  }

  if (failed) {
    return (
      <p className="text-center text-xs text-red-300">
        Couldn&apos;t load Google sign-in. Check your network / client ID.
      </p>
    );
  }

  return <div ref={ref} className="flex min-h-[44px] justify-center" />;
}

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 11v3.6h5.1c-.2 1.3-1.5 3.9-5.1 3.9-3.1 0-5.6-2.5-5.6-5.6S8.9 7.3 12 7.3c1.8 0 2.9.8 3.6 1.4l2.5-2.4C16.5 4.8 14.5 4 12 4 7.6 4 4 7.6 4 12s3.6 8 8 8c4.6 0 7.7-3.2 7.7-7.8 0-.5 0-.9-.1-1.2H12z"
      />
    </svg>
  );
}
