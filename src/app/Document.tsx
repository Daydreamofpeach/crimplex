import { ReactNode } from 'react';

import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';

import { cn } from '@/lib/utils';

import Providers from './Providers';
import Viewport from './Viewport';

const inter = Inter({ subsets: ['latin'] });

const Document = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,viewport-fit=cover"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={cn('relative h-full font-sans antialiased', inter.className)}
        suppressHydrationWarning
      >
        <Providers>
          <Viewport>
            <Toaster richColors position="top-center" duration={3000} />
            {children}
          </Viewport>
        </Providers>
      </body>
    </html>
  );
};

export default Document;