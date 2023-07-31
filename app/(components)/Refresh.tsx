"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Refresh() {
  const [isBusy, setIsBusy] = useState(false);
  const router = useRouter();

  const handleRefresh = async () => {
    setIsBusy(true);
    try {
      await fetch("/api/revalidate", {
        method: "POST"
      });
      router.refresh();
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <Button
      className="bg-blue-500 hover:bg-blue-600 rounded-full w-12 h-12 p-0"
      title="Refresh"
      onClick={handleRefresh}
      disabled={isBusy}
    >
      <RefreshCw className={isBusy ? "animate-spin" : ""} />
    </Button>
  );
}
