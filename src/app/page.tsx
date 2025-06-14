
// This is now a Server Component (no "use client")

import { candidatesData, statsData } from '@/data/candidates';
import { CandidateDashboardClient } from '@/components/CandidateDashboardClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Anandak Screening Certificate Generator',
  description: 'Generate and download certificates',
};

export default async function Home() {
  // By importing candidatesData and statsData here in an RSC,
  // the top-level await in candidates.ts will be handled correctly by Next.js.
  const currentCandidates = candidatesData;
  const currentStats = statsData;

  // If there's an issue loading data (e.g., Excel file not found),
  // candidatesData might be empty and statsData might be minimal.
  // The client component can handle displaying a message if needed,
  // or we could add more robust error handling here.

  return (
    <CandidateDashboardClient 
      initialCandidates={currentCandidates} 
      initialStats={currentStats} 
    />
  );
}
