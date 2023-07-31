import { formatDate } from "@/lib/utils";
import { Clock } from "lucide-react";

export function ExpirationDate({ data: date }: { data: Date }) {
  const isExpired = date < new Date();
  const formattedDate = formatDate(date);
  return isExpired ? (
    <div
      title="Expired"
      className="flex items-center gap-2 bg-yellow-200 text-yellow-700 p-2 rounded-lg shadow-md"
    >
      <Clock /> {formattedDate}
    </div>
  ) : (
    formattedDate
  );
}
