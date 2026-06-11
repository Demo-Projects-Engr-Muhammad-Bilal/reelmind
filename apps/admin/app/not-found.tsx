"use client"

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export default function NotFound() {
          return (
                    <html>
                              <body>
                                        <h2>Page not found</h2>
                              </body>
                    </html>
          );
}
