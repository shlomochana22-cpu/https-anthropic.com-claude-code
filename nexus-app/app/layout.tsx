import type { Metadata } from "next";
import { Varela_Round } from "next/font/google";
import "./globals.css";

const varela = Varela_Round({
  weight: "400",
  subsets: ["latin", "hebrew"],
  variable: "--font-varela",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nexusevents.co.il"),
  title: "NEXUS | פורטל חיי הלילה",
  description: "אירועים, כרטיסים וניהול הפקות — NEXUS Events",
  openGraph: {
    title: "NEXUS | פורטל חיי הלילה",
    description: "אירועים, כרטיסים וניהול הפקות",
    url: "https://nexusevents.co.il",
    siteName: "NEXUS Events",
    locale: "he_IL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className={`dark ${varela.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-background text-on-surface antialiased">
        {children}
      </body>
    </html>
  );
}
