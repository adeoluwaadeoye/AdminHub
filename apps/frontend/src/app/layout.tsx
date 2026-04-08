// import "./globals.css";
// import { Inter, Space_Grotesk } from "next/font/google";
// import { ThemeProvider } from "@/components/providers/theme-provider";
// import { Toaster } from "sonner";
// import Header from "@/components/layout/Header";
// import Footer from "@/components/layout/Footer";
// import AuthInitializer from "@/components/providers/AuthInitializer";

// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-inter",
// });

// const spaceGrotesk = Space_Grotesk({
//   subsets: ["latin"],
//   variable: "--font-space",
// });

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en" suppressHydrationWarning> {/* ✅ fixed — was "en suppressHydrationWarning" */}
//       <body
//         className={`${inter.variable} ${spaceGrotesk.variable} font-body antialiased bg-gray-50 dark:bg-background`}
//       >
//         <ThemeProvider>

//           {/*fetchUser on load — separate client component */}
//           <AuthInitializer />

//           <div className="flex flex-col min-h-screen">

//             {/* HEADER — fixed, sits above everything */}
//             <Header />

//             {/* MAIN — pt-24 clears the fixed header (header is h-16 + top-3) */}
//             <main className="flex-1 pt-24">
//               <div className="mx-auto w-full max-w-7xl px-4 md:px-8 pt-2">
//                 {children}
//               </div>
//             </main>

//             {/* FOOTER */}
//             <Footer />

//             <Toaster
//               position="top-right"
//               richColors
//               closeButton
//               expand={false}
//             />

//           </div>
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }

import "./globals.css";
import { Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AuthInitializer from "@/components/providers/AuthInitializer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-body antialiased bg-gray-50 dark:bg-background`}
      >
        <ThemeProvider>
          <AuthInitializer />

          <div className="flex flex-col">

            <Header />

            {/* pt-24 clears the fixed header */}
            <main className="flex-1 pt-24">
              {children}
            </main>

            <Footer />

            <Toaster
              position="top-right"
              richColors
              closeButton
              expand={false}
            />

          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}