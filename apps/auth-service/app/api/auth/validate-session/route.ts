import { withAuth } from "@/lib/utils/with-auth";
import { ApiResponse } from "@/lib/api-response/api-response";

export const GET = withAuth(async (req, user) => {
          return ApiResponse.success({ valid: true, user }, "Session is valid");
});