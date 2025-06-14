// import type {Metadata} from 'next';
// import './globals.css';
// import { Toaster } from "@/components/ui/toaster";

// export const metadata: Metadata = {
//   title: 'CertiPort',
//   description: 'Generate and download certificates',
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <head>
//         <link rel="preconnect" href="https://fonts.googleapis.com" />
//         <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
//         <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
//       </head>
//       <body className="font-body antialiased">
//         {children}
//         <Toaster />
//       </body>
//     </html>
//   );
// }

import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

export const metadata: Metadata = {
  title: 'CertiPort',
  description: 'Generate and download certificates',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}

