export default function GlobalError({ error }: { error: Error }) {
          console.error("Global error caught:", error);
          return (
                    <html>
                              <body>
                                        <h2>Something went wrong.</h2>
                              </body>
                    </html>
          );
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
