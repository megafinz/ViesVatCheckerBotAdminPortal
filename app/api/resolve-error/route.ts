import { getAdminApiUrl, postApiCall } from "@/lib/api";
import { VatRequestErrorDtoSchema } from "@/lib/model";
import { NextRequest } from "next/server";

export function POST(request: NextRequest) {
  return postApiCall({
    url: getAdminApiUrl("resolveError"),
    payloadFromRequestJson: VatRequestErrorDtoSchema.parse
  })(request);
}
