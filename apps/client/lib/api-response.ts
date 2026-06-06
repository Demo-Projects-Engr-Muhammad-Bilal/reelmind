import { NextResponse } from "next/server";

export class ApiResponse {
          static success(data: any, message = "Success", status = 200) {
                    return NextResponse.json({ success: true, message, ...data }, { status });
          }

          static error(error: string, status = 400) {
                    return NextResponse.json({ success: false, error }, { status });
          }
}