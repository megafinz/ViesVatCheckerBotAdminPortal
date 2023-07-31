import { getApiUrl, postApiCall } from "@/lib/api";
import { VatRequestDtoSchema } from "@/lib/model";
import { NextRequest } from "next/server";

export function POST(request: NextRequest) {
  return postApiCall({
    url: getApiUrl("check"),
    payloadFromRequestJson: VatRequestDtoSchema.parse
  })(request);
}
