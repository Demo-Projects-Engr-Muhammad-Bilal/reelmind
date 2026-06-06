import { ApiResponse } from "@/lib/api-response/api-response";
import { ZodSchema } from "zod";

export async function validateRequest(req: Request, schema: ZodSchema) {
          try {
                    const body = await req.json();
                    const validation = schema.safeParse(body);
                    if (!validation.success) {
                              return { error: ApiResponse.error(validation.error.issues[0].message, 400), data: null };
                    }
                    return { error: null, data: validation.data };
          } catch {
                    return { error: ApiResponse.error("Invalid Request Body", 400), data: null };
          }
}