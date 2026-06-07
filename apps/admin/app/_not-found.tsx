export default function NotFound() {
          return (
                    <html>
                              <body>
                                        <h2>Page not found.</h2>
                              </body>
                    </html>
          );
}

// Prevent Next.js from trying to prerender this page
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
