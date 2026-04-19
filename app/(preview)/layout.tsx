import "./globals.css";
import { BotIdClient } from "botid/client";
import { Metadata } from "next";
import { Toaster } from "sonner";

const protectedRoutes = [
  {
    path: "/api/chat",
    method: "POST",
  },
];

export const metadata: Metadata = {
  metadataBase: new URL("https://ai-sdk-preview-use-object.vercel.app/"),
  title: "Schema Generation Preview",
  description: "Experimental preview of schema generation with useObject hook.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <BotIdClient protect={protectedRoutes} />
      </head>
      <body>
        <Toaster position="top-center" richColors />
        {children}
      </body>
    </html>
  );
}
