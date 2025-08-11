'use client';

import dynamic from 'next/dynamic';

// Import DashboardPage with SSR disabled to avoid window/document issues
const DashboardPage = dynamic(
  () => import('./DashboardPage'),
  { ssr: false }
);

export default DashboardPage;
