import { SignedIn, SignedOut } from '@clerk/nextjs';
import { FileText, LayoutDashboard, RefreshCw, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { Box, Button, Card, CardDescription, CardHeader, CardTitle, Heading, Text } from '@apptly/ui';

const features = [
  {
    icon: Wand2,
    title: 'Autofill applications',
    body: 'The browser extension reads each form and fills it from your saved profile — you review, then submit.',
  },
  {
    icon: FileText,
    title: 'Tailored CV & cover letter',
    body: 'Generate keyword-matched CV tweaks and a cover letter per posting, using your own LLM key.',
  },
  {
    icon: LayoutDashboard,
    title: 'Track every application',
    body: 'Company, role, status and notes for each job — sortable and searchable in one dashboard.',
  },
  {
    icon: RefreshCw,
    title: 'Synced to one account',
    body: 'Sign in once with Clerk. The extension and this web app share the same data, kept in sync.',
  },
];

const LandingPage = () => (
  <Box className="mx-auto max-w-5xl px-6">
    <Box as="section" className="flex flex-col items-center gap-6 py-20 text-center sm:py-28">
      <Box as="span" className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
        Apply to jobs faster
      </Box>
      <Heading className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
        Autofill, tailor, and track your job applications — in one synced account.
      </Heading>
      <Text className="max-w-2xl text-lg text-muted-foreground">
        Apptly’s browser extension fills application forms and tailors your CV; this dashboard gives
        you the full view of everything you’ve applied to. Same Clerk login, same data, everywhere.
      </Text>
      <Box className="flex flex-wrap items-center justify-center gap-3">
        <SignedOut>
          <Button asChild size="lg">
            <Link href="/sign-up">Get started — it’s free</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/sign-in">I already have an account</Link>
          </Button>
        </SignedOut>
        <SignedIn>
          <Button asChild size="lg">
            <Link href="/dashboard">Open your dashboard</Link>
          </Button>
        </SignedIn>
      </Box>
    </Box>

    <Box as="section" className="grid gap-4 pb-24 sm:grid-cols-2">
      {features.map(({ icon: Icon, title, body }) => (
        <Card key={title}>
          <CardHeader>
            <Icon className="mb-2 size-5 text-primary" />
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{body}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </Box>
  </Box>
);

export default LandingPage;
