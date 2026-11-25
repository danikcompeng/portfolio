"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "./icons";

export function CopyEmail({ email }: { email: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (status === "idle") return;
    const t = setTimeout(() => setStatus("idle"), 2400);
    return () => clearTimeout(t);
  }, [status]);

  return (
    <>
      <button
        type="button"
        className="btn btn-secondary press"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(email);
            setStatus("copied");
          } catch {
            setStatus("failed");
          }
        }}
      >
        {status === "copied" ? <Check /> : <Copy />}
        {status === "copied" ? "Copied" : "Copy email"}
      </button>
      <span role="status" className="sr-only">
        {status === "copied" ? "Email copied" : status === "failed" ? "Couldn't copy. Select the address instead." : ""}
      </span>
    </>
  );
}
