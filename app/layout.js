import "./globals.css";

export const metadata = {
  title: "RepoDoc — Understand Any GitHub Repo in Seconds",
  description:
    "Paste a public GitHub repository URL and get a structured, plain-English explanation of what the project does, how it's built, and how to get started.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Inter:wght@400;500&family=JetBrains+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
