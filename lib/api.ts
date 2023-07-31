import { cfg } from "@/lib/cfg";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export function getApiUrl(action: "check" | "uncheck" | "list" | "uncheckAll") {
  return `${cfg.api.azure.common.url}/${action}?code=${cfg.api.azure.common.authCode}`;
}

export function getAdminApiUrl(
  action: "list" | "listErrors" | "resolveError" | "removeError" | "update"
) {
  return `${cfg.api.azure.admin.url}/${action}?code=${cfg.api.azure.admin.authCode}`;
}

// TODO: catch parsing errors.
// TODO: retries.
export function postApiCall<TPayload>(params: {
  url: string;
  payloadFromRequestJson: (json: string) => TPayload;
  payloadToResponseJson?: (payload: TPayload) => string;
  pathToRevalidate?: string;
}) {
  return async (request: NextRequest) => {
    const json = await request.json();
    const payload = params.payloadFromRequestJson(json);
    const response = await fetch(params.url, {
      method: "POST",
      body: params.payloadToResponseJson
        ? params.payloadToResponseJson(payload)
        : JSON.stringify(payload)
    });
    if (response.ok) {
      revalidatePath(params.pathToRevalidate || "/");
      const text = await response.text();
      return NextResponse.json({ success: text });
    } else {
      const error = await response.text();
      return NextResponse.json({ error: error }, { status: response.status });
    }
  };
}
