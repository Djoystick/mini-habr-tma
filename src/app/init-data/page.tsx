import dynamic from 'next/dynamic';

const InitDataClient = dynamic(
  () => import('./InitDataClient'),
  { ssr: false }
);

export default function Page() {
  return <InitDataClient />;
}
