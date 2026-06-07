'use client';

import { FileText, LayoutGrid, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, cn } from '@apptly/ui';
import { isNavLinkActive } from './nav.helpers';

const links = [
  { href: '/dashboard', label: 'Tracker', icon: LayoutGrid },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
  { href: '/dashboard/documents', label: 'Documents', icon: FileText },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export const DashboardNav = () => {
  const pathname = usePathname();
  return (
    <Box as="nav" className="flex flex-col gap-1">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            isNavLinkActive(pathname, href)
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
          )}
        >
          <Icon className="size-4" />
          {label}
        </Link>
      ))}
    </Box>
  );
};
