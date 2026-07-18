import "./globals.css";

export const metadata = {
  title: "Veritas by IQgrads — Authorised Pearson Partner",
  description: "Hands-on, industry-aligned training to a globally trusted Pearson standard, with placement support until you're in your career.",
  openGraph: {
    type: "website",
    title: "Veritas by IQgrads — Authorised Pearson Partner",
    description: "Hands-on, industry-aligned training to a globally trusted Pearson standard, with placement support until you're in your career.",
    url: "https://www.veritasbyiqgrads.com/",
    images: [{ url: "https://www.veritasbyiqgrads.com/assets/img/og-cover.jpg" }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "Veritas by IQgrads",
              "url": "https://www.veritasbyiqgrads.com/",
              "description": "An Authorised Pearson Partner delivering hands-on, industry-aligned training to a globally trusted standard.",
              "parentOrganization": { "@type": "Organization", "name": "IQgrads" }
            })
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
