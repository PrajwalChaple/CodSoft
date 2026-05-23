import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "Trendify — Premium E-Commerce Store",
  description: "Shop the latest trends in headphones, laptops, bags, shoes and more. Premium quality products at unbeatable prices with free shipping.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
