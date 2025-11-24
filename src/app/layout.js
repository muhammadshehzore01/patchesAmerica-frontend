// frontend\src\app\layout.js
import "./globals.css";
import BodyWrapper from "./BodyWrapper";
import GlobalModalProvider from "@/components/GlobalModalProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="font-poppins">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>

      <body
        className="relative min-h-screen antialiased text-white
        bg-gradient-to-b from-[#00033D] via-[#0600AB] to-[#0033FF]
        selection:bg-white/20 selection:text-white/90"
      >
        {/* 👇 Entire App Wrapped With Modal Provider */}
        <GlobalModalProvider>
          <BodyWrapper>{children}</BodyWrapper>
        </GlobalModalProvider>
      </body>
    </html>
  );
}
