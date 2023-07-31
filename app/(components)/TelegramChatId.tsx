import { cfg } from "@/lib/cfg";
import { Award } from "lucide-react";

export function TelegramChatId({ data }: { data: string }) {
  return cfg.admin?.tgChatId === data ? (
    <span
      className="p-2 rounded-lg bg-blue-500 text-white inline-flex shadow-md"
      title="Admin"
    >
      <Award />
      {data}
    </span>
  ) : (
    <span>{data}</span>
  );
}
