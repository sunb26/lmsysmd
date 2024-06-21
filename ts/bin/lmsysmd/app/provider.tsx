"use client";

import { ClerkProvider } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { TransportProvider } from "@connectrpc/connect-query";
import { createConnectTransport } from "@connectrpc/connect-web";
import { NextUIProvider } from "@nextui-org/react";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ThemeProvider, useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

export default function Provider({ children }: { children: ReactNode }) {
  const router = useRouter();
  return (
    <TransportProvider transport={connectTransport}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
      >
        <NextUIProvider navigate={router.push}>
          <ThemeProvider attribute="class">
            <ThemeDependent>{children}</ThemeDependent>
          </ThemeProvider>
        </NextUIProvider>
      </PersistQueryClientProvider>
    </TransportProvider>
  );
}

function ThemeDependent({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  return (
    <ClerkProvider
      appearance={{
        baseTheme: resolvedTheme === "dark" ? dark : undefined,
        elements: { userButtonAvatarBox: "w-[40px] h-[40px]" },
      }}
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      {children}
    </ClerkProvider>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: Number.POSITIVE_INFINITY,
      staleTime: Number.POSITIVE_INFINITY,
    },
  },
});

const persister = createSyncStoragePersister({
  storage: typeof window !== "undefined" ? window.localStorage : undefined,
});

const connectTransport = createConnectTransport({
  baseUrl: "/",
  jsonOptions: { ignoreUnknownFields: true },
  useBinaryFormat: true,
  useHttpGet: true,
});
