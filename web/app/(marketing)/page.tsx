import { SignedIn, SignedOut } from '@clerk/nextjs';
import { ArrowRight, FileText, LayoutDashboard, RefreshCw, Wand2 } from 'lucide-react';
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
  <Box className="relative overflow-hidden">
    <Box
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] bg-gradient-to-b from-accent/60 via-background to-background"
    />
    <Box className="mx-auto max-w-5xl px-6">
      <Box
        as="section"
        className="flex flex-col items-center gap-6 py-20 text-center duration-700 animate-in fade-in slide-in-from-bottom-4 sm:py-28"
      >
        <Box
          as="span"
          className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
        >
          Apply to jobs faster
        </Box>
        <Heading className="max-w-3xl bg-gradient-to-br from-foreground via-foreground to-primary bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
          Autofill, tailor, and track your job applications — in one synced account.
        </Heading>
        <Text className="max-w-2xl text-lg text-muted-foreground">
          Apptly’s browser extension fills application forms and tailors your CV; this dashboard gives
          you the full view of everything you’ve applied to. Same Clerk login, same data, everywhere.
        </Text>
        <Box className="flex flex-wrap items-center justify-center gap-3">
          <SignedOut>
            <Button asChild size="lg" className="group">
              <Link href="/sign-up">
                Get started — it’s free
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/sign-in">I already have an account</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <Button asChild size="lg" className="group">
              <Link href="/dashboard">
                Open your dashboard
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </SignedIn>
        </Box>
      </Box>

      <Box as="section" className="grid gap-4 pb-24 sm:grid-cols-2">
        {features.map(({ icon: Icon, title, body }) => (
          <Card
            key={title}
            className="transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
          >
            <CardHeader>
              <Box className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" />
              </Box>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription>{body}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </Box>
    </Box>
  </Box>
);

export default LandingPage;
