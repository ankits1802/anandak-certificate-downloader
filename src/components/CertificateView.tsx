
// "use client";
// import type { Candidate, Stats } from '@/data/candidates';
// import { toTitleCase } from '@/lib/utils';
// import React from 'react';
// import { ScoreGraph } from './ScoreGraph'; 
// import Image from 'next/image';

// interface CertificateViewProps {
//   candidate: Candidate | null;
//   stats: Stats | null;
// }

// // A4 Landscape dimensions in pixels (approx @ 96 DPI)
// const A4_WIDTH_PX = 1122; 
// const A4_HEIGHT_PX = 794;

// export const CertificateView = React.forwardRef<HTMLDivElement, CertificateViewProps>(({ candidate, stats }, ref) => {
//   if (!candidate || !stats) {
//     return null;
//   }
  
//   const titleCasedName = toTitleCase(candidate.name);
//   const titleCasedDistrict = candidate.district ? toTitleCase(candidate.district) : 'N/A';
//   const currentDate = new Date().toLocaleDateString('en-GB', {
//     day: '2-digit',
//     month: 'long',
//     year: 'numeric',
//   });

//   return (
//     <div
//       ref={ref}
//       id="certificate-to-print"
//       className="bg-white text-black" 
//       style={{
//         width: `${A4_WIDTH_PX}px`,
//         height: `${A4_HEIGHT_PX}px`,
//         fontFamily: "'Poppins', 'Helvetica Neue', Helvetica, Arial, sans-serif",
//         border: '10px solid hsl(var(--primary))',
//         boxSizing: 'border-box',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         padding: '20px',
//       }}
//     >
//       {/* Header Section - Three Logo Layout */}
//       <div className="w-full flex justify-between items-center mb-6 px-4 relative">
//         {/* Left side: MP Emblem */}
//         <div className="flex-shrink-0">
//           <Image 
//             src="/mp-emblem.svg" 
//             alt="MP Government Emblem" 
//             width={60} 
//             height={60}
//             className="flex-shrink-0"
//             priority
//           />
//         </div>

//         {/* Center: Rajya Anand Logo (stretched horizontally and centered) */}
//         <div 
//           className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center"
//           style={{ 
//             width: '300px', 
//             height: '60px'
//           }}
//         >
//           <Image 
//             src="/rajya-anand-sansthan-logo.svg" 
//             alt="Rajya Anand Sansthan Logo" 
//             width={300} 
//             height={60}
//             className="w-full h-full object-contain"
//             style={{ 
//               objectFit: 'contain'
//             }}
//             priority
//           />
//         </div>

//         {/* Right side: IIT KGP Logo */}
//         <div className="flex-shrink-0">
//           <Image 
//             src="/iit-kgp-logo.svg" 
//             alt="IIT Kharagpur Logo" 
//             width={60} 
//             height={60}
//             className="flex-shrink-0"
//             priority
//           />
//         </div>
//       </div>

//       {/* Main Content Section */}
//       <div className="w-full flex flex-col items-center flex-grow justify-center px-4">
//         <h1 className="text-4xl font-bold mt-2 mb-4 text-center" style={{ color: 'hsl(var(--primary))', letterSpacing: '0.5px' }}>
//           Certificate of Achievement
//         </h1>
//         <p className="text-xl mt-3 mb-2 text-center">This certificate is proudly presented to</p>
//         <p className="text-3xl font-bold mt-1 mb-5 text-center" style={{ color: 'hsl(var(--accent))' }}>
//           {titleCasedName}
//         </p>
//         <p className="text-lg text-center">For successfully completing the evaluation held in</p>
//         <p className="text-xl font-semibold mt-1 mb-3 text-center">{titleCasedDistrict}</p>

//         <div className="grid grid-cols-2 gap-x-8 gap-y-3 w-full max-w-4xl my-4">
//           {/* Left Column for Scores & Remarks */}
//           <div className="space-y-3">
//             <h3 className="text-xl font-semibold text-left" style={{ color: 'hsl(var(--primary))' }}>Performance Details</h3>
            
//             {/* Modern Performance Table */}
//             <div className="w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
//               {/* Table Header */}
//               <div className="bg-gray-50 border-b border-gray-200 py-3">
//                 <h4 className="text-center font-semibold text-gray-700">Question Scores</h4>
//               </div>
              
//               {/* Score Rows */}
//               <div className="divide-y divide-gray-100">
//                 <div className="grid grid-cols-2 divide-x divide-gray-100">
//                   <div className="py-3 px-4 text-center bg-white">
//                     <span className="font-medium">Que 1:</span> {candidate.scores.que1}/3
//                   </div>
//                   <div className="py-3 px-4 text-center bg-white">
//                     <span className="font-medium">Que 2:</span> {candidate.scores.que2}/3
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 divide-x divide-gray-100">
//                   <div className="py-3 px-4 text-center bg-gray-25">
//                     <span className="font-medium">Que 3:</span> {candidate.scores.que3}/3
//                   </div>
//                   <div className="py-3 px-4 text-center bg-gray-25">
//                     <span className="font-medium">Que 4:</span> {candidate.scores.que4}/3
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 divide-x divide-gray-100">
//                   <div className="py-3 px-4 text-center bg-white">
//                     <span className="font-medium">Que 5:</span> {candidate.scores.que5}/3
//                   </div>
//                   <div className="py-3 px-4 text-center bg-white">
//                     <span className="font-medium">Que 6:</span> {candidate.scores.que6}/3
//                   </div>
//                 </div>
//               </div>
              
//               {/* Total Score Row */}
//               <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4">
//                 <div className="text-center">
//                   <span className="font-bold text-lg">Total Score: </span>
//                   <span className="font-bold text-xl">{candidate.totalScore}/18</span>
//                 </div>
//               </div>
//             </div>
            
//             <div className="text-left">
//               <p className="text-lg font-semibold">Remarks:</p>
//               <p className="text-xl font-bold mt-1" style={{ color: 'hsl(var(--accent))' }}>{candidate.remarks}</p>
//             </div>
//           </div>

//           {/* Right Column for Graph */}
//           <div className="w-full">
//             <h3 className="text-lg font-semibold text-center mb-2" style={{ color: 'hsl(var(--primary))' }}>
//               Performance Comparison
//             </h3>
//             <div 
//               className="score-graph-container w-full h-[200px] bg-white border rounded"
//               data-testid="score-graph"
//             >
//               <ScoreGraph selectedCandidate={candidate} stats={stats} />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Footer Section */}
//       <div className="w-full text-sm pt-4 px-4 mt-auto">
//         <div className="flex justify-between items-end">
//           <div>
//             <p>Date: {currentDate}</p>
//           </div>
//           <div className="text-center">
//             <div className="mb-1 mx-auto w-[120px] h-[40px] border border-gray-300 flex items-center justify-center text-gray-500 text-xs">
//               [Signature]
//             </div>
//             <p className="border-t border-gray-400 pt-1">Issuing Authority</p>
//           </div>
//           <div className="w-[120px]">
//           </div> 
//         </div>
//       </div>
//     </div>
//   );
// });

// CertificateView.displayName = "CertificateView";

"use client";
import type { Candidate, Stats } from '@/data/candidates';
import { toTitleCase } from '@/lib/utils';
import React from 'react';
import { ScoreGraph } from './ScoreGraph'; 
import Image from 'next/image';

interface CertificateViewProps {
  candidate: Candidate | null;
  stats: Stats | null;
}

// A4 Landscape dimensions in pixels (approx @ 96 DPI)
const A4_WIDTH_PX = 1122; 
const A4_HEIGHT_PX = 794;

export const CertificateView = React.forwardRef<HTMLDivElement, CertificateViewProps>(({ candidate, stats }, ref) => {
  if (!candidate || !stats) {
    return null;
  }
  
  const titleCasedName = toTitleCase(candidate.name);
  const titleCasedDistrict = candidate.district ? toTitleCase(candidate.district) : 'N/A';
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div
      ref={ref}
      id="certificate-to-print"
      className="bg-white text-black" 
      style={{
        width: `${A4_WIDTH_PX}px`,
        height: `${A4_HEIGHT_PX}px`,
        fontFamily: "'Poppins', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        border: '10px solid hsl(var(--primary))',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px',
      }}
    >
      {/* Header Section - Three Logo Layout */}
      <div className="w-full flex justify-between items-center mb-6 px-4 relative">
        {/* Left side: MP Emblem */}
        <div className="flex-shrink-0">
          <Image 
            src="/mp-emblem.svg" 
            alt="MP Government Emblem" 
            width={60} 
            height={60}
            className="flex-shrink-0"
            priority
          />
        </div>

        {/* Center: Rajya Anand Logo (stretched horizontally and centered) */}
        <div 
          className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center"
          style={{ 
            width: '300px', 
            height: '60px'
          }}
        >
          <Image 
            src="/rajya-anand-sansthan-logo.svg" 
            alt="Rajya Anand Sansthan Logo" 
            width={300} 
            height={60}
            className="w-full h-full object-contain"
            style={{ 
              objectFit: 'contain'
            }}
            priority
          />
        </div>

        {/* Right side: IIT Kharagpur Heading + IIT KGP Logo */}
        <div className="flex-shrink-0 flex items-center gap-2">
          <Image 
            src="/iit_kharagpur_heading.svg" 
            alt="IIT Kharagpur Heading" 
            width={120} 
            height={60}
            className="flex-shrink-0"
            priority
          />
          <Image 
            src="/iit-kgp-logo.svg" 
            alt="IIT Kharagpur Logo" 
            width={60} 
            height={60}
            className="flex-shrink-0"
            priority
          />
        </div>
      </div>

      {/* Main Content Section */}
      <div className="w-full flex flex-col items-center flex-grow justify-center px-4">
        <h1 className="text-4xl font-bold mt-2 mb-4 text-center" style={{ color: 'hsl(var(--primary))', letterSpacing: '0.5px' }}>
          Certificate of Achievement
        </h1>
        <p className="text-xl mt-3 mb-2 text-center">This certificate is proudly presented to</p>
        <p className="text-3xl font-bold mt-1 mb-5 text-center" style={{ color: 'hsl(var(--accent))' }}>
          {titleCasedName}
        </p>
        <p className="text-lg text-center">For successfully completing the evaluation held in</p>
        <p className="text-xl font-semibold mt-1 mb-3 text-center">{titleCasedDistrict}</p>

        <div className="grid grid-cols-2 gap-x-8 gap-y-3 w-full max-w-4xl my-4">
          {/* Left Column for Scores & Remarks */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-left" style={{ color: 'hsl(var(--primary))' }}>Performance Details</h3>
            
            {/* Modern Performance Table */}
            <div className="w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
              {/* Table Header */}
              <div className="bg-gray-50 border-b border-gray-200 py-3">
                <h4 className="text-center font-semibold text-gray-700">Question Scores</h4>
              </div>
              
              {/* Score Rows */}
              <div className="divide-y divide-gray-100">
                <div className="grid grid-cols-2 divide-x divide-gray-100">
                  <div className="py-3 px-4 text-center bg-white">
                    <span className="font-medium">Que 1:</span> {candidate.scores.que1}/3
                  </div>
                  <div className="py-3 px-4 text-center bg-white">
                    <span className="font-medium">Que 2:</span> {candidate.scores.que2}/3
                  </div>
                </div>
                <div className="grid grid-cols-2 divide-x divide-gray-100">
                  <div className="py-3 px-4 text-center bg-gray-25">
                    <span className="font-medium">Que 3:</span> {candidate.scores.que3}/3
                  </div>
                  <div className="py-3 px-4 text-center bg-gray-25">
                    <span className="font-medium">Que 4:</span> {candidate.scores.que4}/3
                  </div>
                </div>
                <div className="grid grid-cols-2 divide-x divide-gray-100">
                  <div className="py-3 px-4 text-center bg-white">
                    <span className="font-medium">Que 5:</span> {candidate.scores.que5}/3
                  </div>
                  <div className="py-3 px-4 text-center bg-white">
                    <span className="font-medium">Que 6:</span> {candidate.scores.que6}/3
                  </div>
                </div>
              </div>
              
              {/* Total Score Row */}
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4">
                <div className="text-center">
                  <span className="font-bold text-lg">Total Score: </span>
                  <span className="font-bold text-xl">{candidate.totalScore}/18</span>
                </div>
              </div>
            </div>
            
            <div className="text-left">
              <p className="text-lg font-semibold">Remarks:</p>
              <p className="text-xl font-bold mt-1" style={{ color: 'hsl(var(--accent))' }}>{candidate.remarks}</p>
            </div>
          </div>

          {/* Right Column for Graph */}
          <div className="w-full">
            <h3 className="text-lg font-semibold text-center mb-2" style={{ color: 'hsl(var(--primary))' }}>
              Performance Comparison
            </h3>
            <div 
              className="score-graph-container w-full h-[200px] bg-white border rounded"
              data-testid="score-graph"
            >
              <ScoreGraph selectedCandidate={candidate} stats={stats} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="w-full text-sm pt-4 px-4 mt-auto">
        <div className="flex justify-between items-end">
          <div>
            <p>Date: {currentDate}</p>
          </div>
          <div className="text-center">
            <div className="mb-1 mx-auto w-[120px] h-[40px] border border-gray-300 flex items-center justify-center text-gray-500 text-xs">
              [Signature]
            </div>
            <p className="border-t border-gray-400 pt-1">Issuing Authority</p>
          </div>
          <div className="w-[120px]">
          </div> 
        </div>
      </div>
    </div>
  );
});

CertificateView.displayName = "CertificateView";
