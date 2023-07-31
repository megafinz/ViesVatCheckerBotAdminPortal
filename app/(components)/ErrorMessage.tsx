import { Button } from "@/components/ui/button";
import { RefreshCw, Skull } from "lucide-react";

export function ErrorMessage(props: {
  title?: string;
  message: string;
  reset: () => void;
}) {
  return (
    <div className="rounded-lg bg-red-200 text-red-600 flex items-center gap-6 p-6">
      <Skull size={48} className="row-span-2" />
      <div className="grow">
        <h2 className="text-xl">
          <b>{props.title || "Something went wrong!"}</b>
        </h2>
        <p>{props.message}</p>
      </div>
      <Button className="inline-flex gap-2" onClick={props.reset}>
        <RefreshCw />
        Try Again
      </Button>
    </div>
  );
}
