import "./globals.css";
import Script from "next/script";
import GlobalModalProvider from "@/components/GlobalModalProvider";
import BodyWrapper from "./BodyWrapper";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-RQ99HQ5Z7T" strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RQ99HQ5Z7T');
          `}
        </Script>
      </head>
      <body className="antialiased overflow-x-hidden">
        <GlobalModalProvider>
          <BodyWrapper>{children}</BodyWrapper>
        </GlobalModalProvider>
      </body>
    </html>
  );
}