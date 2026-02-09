// src/app/layout.js
import "./globals.css";
import Script from "next/script";
import GlobalModalProvider from "@/components/GlobalModalProvider";
import BodyWrapper from "./BodyWrapper";

// Self-hosted fonts via next/font (auto-optimizes preloading, no manual link needed)
import { Inter, Poppins } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["400", "600", "700"],
});

// Global SEO base metadata (unchanged)
export const metadata = {
  title: {
    default: "Northern Patches America – Custom Patches USA | No Minimum Order",
    template: "%s | Northern Patches – Custom Patches USA",
  },
  description:
    "Premium custom patches USA – embroidered, PVC, chenille, woven & leather. " +
    "No minimum order, fast US production & shipping. " +
    "High-quality custom patches for jackets, hats, bags, military, sports teams & businesses.",
  keywords:
    "custom patches USA, custom embroidered patches USA, custom PVC patches no minimum, " +
    "custom chenille patches, custom woven patches USA, custom leather patches no minimum, " +
    "custom patches for jackets USA, custom military patches, custom sports team patches USA, " +
    "fast shipping patches USA, no minimum custom patches, patches for hats USA, " +
    "custom patches for bags USA",
  robots: "index, follow",
  alternates: {
    canonical: "https://northernpatches.com/",
  },
  openGraph: {
    title: "Northern Patches America – Custom Patches USA | No Minimum",
    description:
      "Design premium custom embroidered, PVC, chenille, woven & leather patches. " +
      "No minimum order, fast USA production & shipping. Free quote today!",
    url: "https://northernpatches.com/",
    siteName: "Northern Patches",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Custom patches gallery – Northern Patches USA",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Northern Patches America – Custom Patches USA",
    description:
      "Premium custom patches: embroidered, PVC, chenille & more. No minimum, fast US shipping.",
    images: ["/og-home.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${poppins.variable}`}>
      <head>
        {/* Google Analytics – only on public pages */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RQ99HQ5Z7T"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            if (!window.location.pathname.startsWith('/admin')) {
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-RQ99HQ5Z7T', {
                anonymize_ip: true,
                page_path: window.location.pathname,
                send_page_view: true
              });
            }
          `}
        </Script>

        {/* Force index – overrides any earlier noindex */}
        <meta name="robots" content="index, follow" />
      </head>

      <body className="antialiased overflow-x-hidden font-sans">
        <GlobalModalProvider>
          <BodyWrapper>{children}</BodyWrapper>
        </GlobalModalProvider>
      </body>
    </html>
  );
}