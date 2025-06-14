
"use client";

import type { Candidate, Stats } from '@/data/candidates';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ScoreGraphProps {
  selectedCandidate: Candidate;
  stats: Stats;
}

export function ScoreGraph({ selectedCandidate, stats }: ScoreGraphProps) {
  const candidateDistrictStats = stats.districtStats[selectedCandidate.district] || { average: 0, high: 0 };

  const data = [
    {
      name: 'Scores',
      "Your Score": selectedCandidate.totalScore,
      "District Avg.": parseFloat(candidateDistrictStats.average.toFixed(2)),
      "Overall Avg.": parseFloat(stats.overallAverage.toFixed(2)),
      "District High": candidateDistrictStats.high,
      "Overall High": stats.overallHigh,
    },
  ];

  return (
    <Card className="shadow-lg w-full h-full">
      <CardHeader className="p-4">
        <CardTitle className="font-headline text-lg text-center">Performance Snapshot</CardTitle>
      </CardHeader>
      <CardContent className="p-2 pt-0 h-[calc(100%-4rem)]"> {/* Adjust height based on header */}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
            barCategoryGap="10%" // Adjust this to control how much space the category of bars takes up
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--foreground))" tick={{ fontSize: 12 }} />
            <YAxis stroke="hsl(var(--foreground))" domain={[0, 18]} allowDataOverflow={false} tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                color: 'hsl(var(--card-foreground))',
                borderRadius: 'var(--radius)',
                fontSize: '12px', 
              }}
            />
            <Legend wrapperStyle={{ color: 'hsl(var(--foreground))', fontSize: '10px', paddingTop: '5px' }} />
            <Bar dataKey="Your Score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="District Avg." fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} /> {/* Muted Green */}
            <Bar dataKey="Overall Avg." fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="District High" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Overall High" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} /> {/* Changed to Muted Green */}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

