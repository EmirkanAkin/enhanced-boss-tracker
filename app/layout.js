import { Cinzel, Inter } from 'next/font/google';
import './globals.css';

// Fontları indirirken ağırlıklarını ve CSS değişken isimlerini zorunlu tutuyoruz
const cinzel = Cinzel({ 
  subsets: ['latin'], 
  weight: ['400', '600', '700', '900'],
  variable: '--font-cinzel' 
});

const inter = Inter({ 
  subsets: ['latin'], 
  weight: ['400', '500', '700'],
  variable: '--font-inter' 
});

export const metadata = {
  title: 'Compendium of the Fallen',
  description: 'A dark fantasy boss tracker',
};

export default function RootLayout({ children }) {
  return (
    // Değişkenleri HTML'e gömüyoruz ki tüm sayfalarda 'font-serif' komutu çalışsın
    <html lang="en" className={`${cinzel.variable} ${inter.variable}`}>
      <body className="font-sans text-gray-300 antialiased selection:bg-[#d4af37] selection:text-black">
        {children}
      </body>
    </html>
  );
}