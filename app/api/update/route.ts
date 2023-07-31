import { getAdminApiUrl, postApiCall } from "@/lib/api";
import { UpdateVatRequestDtoSchema } from "@/lib/model";
import { NextRequest } from "next/server";

export function POST(request: NextRequest) {
  return postApiCall({
    url: getAdminApiUrl("update"),
    payloadFromRequestJson: UpdateVatRequestDtoSchema.parse
  })(request);
}
