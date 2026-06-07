"use client";

import { useEffect, useState } from "react";
import { browserSupabase } from "@/lib/supabaseBrowser";

/** Greets the signed-in producer by name (falls back to a demo name). */
export function ProducerGreeting() {
  const [name, setName] = useState("אלי");
  useEffect(() => {
    const sb = browserSupabase();
    if (!sb) return;
    sb.auth.getUser().then(({ data }) => {
      const email = data.user?.email;
      const meta = (data.user?.user_metadata as { full_name?: string } | undefined)?.full_name;
      if (meta) setName(meta);
      else if (email) setName(email.split("@")[0]);
    });
  }, []);
  return <>{name}</>;
}
