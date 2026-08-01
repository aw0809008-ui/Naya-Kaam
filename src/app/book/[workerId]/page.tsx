import { BookClient } from '@/components/book-client';

export function generateStaticParams() {
  return [
    { workerId: 'w-1' },
    { workerId: 'w-2' },
    { workerId: 'w-3' },
    { workerId: 'w-4' },
    { workerId: 'w-5' },
    { workerId: 'w-6' },
    { workerId: 'w-7' },
    { workerId: 'w-8' },
  ];
}

interface PageProps {
  params: Promise<{ workerId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { workerId } = await params;
  return <BookClient workerId={workerId} />;
}
