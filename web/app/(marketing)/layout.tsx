import { SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Box, Button, Text } from '@apptly/ui';

const MarketingLayout = ({ children }: { children: ReactNode }) => (
  <Box className="flex min-h-screen flex-col">
    <Box as="header" className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
      <Box as="nav" className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Apptly
        </Link>
        <Box className="flex items-center gap-2">
          <SignedOut>
            <Button asChild variant="ghost" size="sm">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/sign-up">Get started</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <Button asChild size="sm">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </SignedIn>
        </Box>
      </Box>
    </Box>

    <Box as="main" className="flex-1">
      {children}
    </Box>

    <Box as="footer" className="border-t">
      <Box className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-6 py-6 text-sm text-muted-foreground sm:flex-row">
        <Text as="span">© {new Date().getFullYear()} Apptly</Text>
        <Box
          as="a"
          href="https://github.com/mabubakr1113/apptly"
          target="_blank"
          rel="noreferrer"
          className="hover:text-foreground"
        >
          Open source on GitHub
        </Box>
      </Box>
    </Box>
  </Box>
);

export default MarketingLayout;
