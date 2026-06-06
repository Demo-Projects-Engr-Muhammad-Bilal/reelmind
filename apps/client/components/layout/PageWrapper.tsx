// apps/web/src/components/PageWrapper.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
          const pathname = usePathname();
          // Hum route change aur BFCache dono ko handle karne ke liye key use karenge
          const [renderKey, setRenderKey] = useState(pathname);

          useEffect(() => {
                    const handlePageShow = (event: PageTransitionEvent) => {
                              // event.persisted ka matlab hai page browser ki cache se load hua hai (Back button)
                              if (event.persisted) {
                                        // Yeh line React ko force karegi ke wo saari animations dobara chalaye
                                        setRenderKey(`${pathname}-${Date.now()}`);
                              }
                    };

                    window.addEventListener("pageshow", handlePageShow);
                    return () => window.removeEventListener("pageshow", handlePageShow);
          }, [pathname]);

          // key change hone se andar mojood har component bilkul fresh start hoga
          return <div key={renderKey} className="w-full flex flex-col">{children}</div>;
}