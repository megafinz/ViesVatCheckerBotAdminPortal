import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function useApiCall(
  url:
    | "/api/check"
    | "/api/uncheck"
    | "/api/resolve-error"
    | "/api/remove-error"
    | "/api/update"
) {
  const [isBusy, setIsBusy] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  return {
    isBusy,
    execute: async <TPayload>(params: {
      payload: TPayload;
      onSuccess?: () => void;
    }) => {
      setIsBusy(true);
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json"
          },
          body: JSON.stringify(params.payload)
        });
        if (response.ok) {
          const json = await response.json();
          toast({
            title: "Success",
            description: `${json.success}`
          });
          router.refresh();
          if (params.onSuccess) {
            params.onSuccess();
          }
        } else {
          const json = await response.json();
          toast({
            title: "Failure",
            description: `${json.error || json}`,
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Failure",
          description: `${error}`,
          variant: "destructive"
        });
      } finally {
        setIsBusy(false);
      }
    }
  };
}
