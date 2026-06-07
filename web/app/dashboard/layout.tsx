import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Box } from '@apptly/ui';
import { Providers } from '../providers';
import { DashboardNav } from './nav';

const DashboardLayout = ({ children }: { children: ReactNode }) => (
  <Providers>
    <Box className="flex min-h-screen flex-col">
      <Box
        as="header"
        className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-6 py-3"
      >
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Apptly
        </Link>
        <UserButton />
      </Box>

      <Box className="mx-auto flex w-full max-w-6xl flex-1 gap-8 px-6 py-8">
        <Box as="aside" className="hidden w-48 shrink-0 sm:block">
          <DashboardNav />
        </Box>
        <Box as="main" className="min-w-0 flex-1">
          {children}
        </Box>
      </Box>
    </Box>
  </Providers>
);

export default DashboardLayout;
