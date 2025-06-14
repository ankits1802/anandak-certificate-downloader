
import { loadCandidatesFromExcel } from '@/lib/excelDataReader';
import path from 'path';

export interface Candidate {
  sNo: number;
  name: string;
  district: string;
  mobileNo: string;
  scores: {
    que1: number;
    que2: number;
    que3: number;
    que4: number;
    que5: number;
    que6: number;
  };
  totalScore: number;
  remarks: string;
}

export interface Stats {
  overallAverage: number;
  overallHigh: number;
  districtStats: {
    [district: string]: {
      average: number;
      high: number;
    };
  };
}

// Define the path to the Excel file, relative to the project root
// User must place their 'CandidateData.xlsx' file here.
const EXCEL_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'CandidateData.xlsx');

export const calculateStats = (data: Candidate[]): Stats => {
  if (!data || data.length === 0) {
    return {
      overallAverage: 0,
      overallHigh: 0,
      districtStats: {},
    };
  }

  const overallTotalScoreSum = data.reduce((sum, candidate) => sum + candidate.totalScore, 0);
  const overallAverage = data.length > 0 ? parseFloat((overallTotalScoreSum / data.length).toFixed(2)) : 0;
  
  // Ensure overallHigh is at least 0, even if all scores are negative (though unlikely here) or data is empty
  const overallHigh = data.length > 0 ? Math.max(0, ...data.map(candidate => candidate.totalScore)) : 0;

  const districtScores: { [district: string]: number[] } = {};
  data.forEach(candidate => {
    const districtKey = candidate.district && candidate.district.trim() !== '' ? candidate.district : "Unknown District";
    if (!districtScores[districtKey]) {
      districtScores[districtKey] = [];
    }
    districtScores[districtKey].push(candidate.totalScore);
  });

  const districtStats: Stats['districtStats'] = {};
  for (const district in districtScores) {
    const scores = districtScores[district];
    if (scores.length > 0) {
        const sum = scores.reduce((acc, score) => acc + score, 0);
        districtStats[district] = {
        average: parseFloat((sum / scores.length).toFixed(2)),
        high: Math.max(0, ...scores),
        };
    } else {
        // This case should ideally not be hit if districtKey logic is sound
        districtStats[district] = { average: 0, high: 0}; 
    }
  }
  return { overallAverage, overallHigh, districtStats };
};

async function initializeData(): Promise<{ candidates: Candidate[]; statistics: Stats }> {
  let candidates: Candidate[] = [];
  try {
    // Check if the file exists before trying to load
    // fs.existsSync can't be used directly in a way that Next.js likes for all contexts
    // excelDataReader will handle the warning if file not found.
    candidates = await loadCandidatesFromExcel(EXCEL_FILE_PATH);
  } catch (error) {
    console.error("Error during data initialization from Excel:", error);
    candidates = []; // Fallback to empty array
  }
  
  const statistics = calculateStats(candidates);
  return { candidates, statistics };
}

// Note: Using top-level await. This means this module will be an async module.
// Next.js handles this for server-side modules/builds.
const dataInitialization = await initializeData();

export const candidatesData: Candidate[] = dataInitialization.candidates;
export const statsData: Stats = dataInitialization.statistics;
