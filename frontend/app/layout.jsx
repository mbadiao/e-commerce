import { Poppins } from "next/font/google";
import "./globals.css";
import { Footer, NavBar } from "./components";
import { Toaster } from "@/components/ui/toaster"
const poppins = Poppins({ subsets: ["latin"], weight: ["100", "400", "600"] });

export const metadata = {
  title: "MyShop",
  description:
    "MyShop is your go-to marketplace for finding and buying clothes. Discover the latest trends and timeless classics all in one place.",
  keywords: "e-commerce, fashion, shopping, clothes, marketplace",
  authors: 'mbaye diao',
  openGraph: {
    title: "MyShop",
    description: "Discover and buy the latest fashion trends at MyShop.",
    url: "https://www.myshop.com",
    type: "website",
    images: [
      {
        url: "https://www.myshop.com/images/og-image.jpg",
        width: 800,
        height: 600,
        alt: "MyShop Homepage",
      },
    ],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="author" content={metadata.authors.name} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:type" content={metadata.openGraph.type} />
        {metadata.openGraph.images.map((image, index) => (
          <meta key={index} property="og:image" content={image.url} />
        ))}
        <meta name="viewport" content={`${viewport.width}, initial-scale=${viewport.initialScale}`} />
      </head>
      <body className={poppins.className}>
        <NavBar />
        {children}
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
