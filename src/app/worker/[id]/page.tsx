import { WorkerProfileClient } from '@/components/worker-profile-client';

export function generateStaticParams() {
  return [
    { id: 'w-1' },
    { id: 'w-2' },
    { id: 'w-3' },
    { id: 'w-4' },
    { id: 'w-5' },
    { id: 'w-6' },
    { id: 'w-7' },
    { id: 'w-8' },
  ];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <WorkerProfileClient id={id} />;
}
