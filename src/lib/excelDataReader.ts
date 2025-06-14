
'use server';

import * as XLSX from 'xlsx';
import fs from 'fs';
// import path from 'path'; // path is not used directly in this function
import type { Candidate } from '@/data/candidates';

function determineRemarks(totalScore: number): string {
  if (totalScore >= 15) return "Excellent Performance";
  if (totalScore >= 9) return "Good Performance";
  return "Needs Improvement";
}

export async function loadCandidatesFromExcel(filePath: string): Promise<Candidate[]> {
    console.log(`[ExcelReader] Attempting to load candidates from Excel file: ${filePath}`);
    const allParsedCandidates: Candidate[] = [];
    
    if (!fs.existsSync(filePath)) {
        console.warn(`[ExcelReader] CRITICAL: File not found: ${filePath}. Please ensure 'CandidateData.xlsx' is in the 'src/data' directory.`);
        return [];
    }

    try {
        const buf = fs.readFileSync(filePath);
        const workbook = XLSX.read(buf, { type: 'buffer', cellDates: true });
        const sheetNames = workbook.SheetNames;
        console.log(`[ExcelReader] Found ${sheetNames.length} sheet(s): ${sheetNames.join(', ')}. Data processing starts from the second sheet.`);

        let sNoCounter = 1;

        // Iterate through sheets, skipping the first one (index 0)
        for (let i = 1; i < sheetNames.length; i++) {
            const sheetName = sheetNames[i];
            const district = sheetName.trim();
            console.log(`[ExcelReader] Processing sheet: "${sheetName}" (District: "${district}")`);
            
            if (!district) {
                console.warn(`[ExcelReader] Skipping sheet with blank name at index ${i}.`);
                continue;
            }

            const worksheet = workbook.Sheets[sheetName];
            if (!worksheet) {
                console.warn(`[ExcelReader] Worksheet "${sheetName}" could not be loaded from the workbook.`);
                continue;
            }
            
            // header: 1 creates an array of arrays. defval: null ensures empty cells are null.
            const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null });
            console.log(`[ExcelReader] Sheet "${sheetName}" has ${jsonData.length -1} data rows (excluding header). Expecting columns: A=S.No(ignored), B=Name, C=District(ignored), D=Mobile, E-J=Que.1-6`);


            if (jsonData.length <= 1) { // Only header row or empty
                console.warn(`[ExcelReader] Skipping empty or header-only sheet: "${sheetName}"`);
                continue;
            }
            
            // jsonData[0] is the header row. Data starts from jsonData[1].
            // Expected column indices:
            // Name: 1 (Column B in Excel)
            // Mobile: 3 (Column D in Excel)
            // Scores start: 4 (Column E, Que.1) to 9 (Column J, Que.6)

            for (let j = 1; j < jsonData.length; j++) { // Start from j=1 to skip header row
                const row = jsonData[j];
                const rowIndexForLog = j + 1; // 1-based index for logging (Excel row number)

                if (!row || row.length === 0 || row.every(cell => cell === null || String(cell).trim() === '')) {
                    // console.log(`[ExcelReader] Skipping empty row ${rowIndexForLog} in sheet "${sheetName}".`);
                    continue;
                }

                // Ensure row has enough elements before trying to access them.
                // Minimum expected columns for Name (idx 1) and Mobile (idx 3), Scores (idx 4-9)
                const nameValue = row.length > 1 ? row[1] : null;
                const mobileNoValue = row.length > 3 ? row[3] : null;

                const name = nameValue ? String(nameValue).trim() : null;
                const mobileNo = mobileNoValue ? String(mobileNoValue).trim() : null;

                if ((!name || name === '') && (!mobileNo || mobileNo === '')) {
                    // console.log(`[ExcelReader] Skipping row ${rowIndexForLog} in sheet "${sheetName}" due to missing name AND mobile.`);
                    continue;
                }

                const scores: Candidate['scores'] = { que1: 0, que2: 0, que3: 0, que4: 0, que5: 0, que6: 0 };
                let allQuestionsOriginallyNAOrEmpty = true;
                let totalScore = 0;

                for (let k = 1; k <= 6; k++) {
                    const scoreCellIndex = 3 + k; // Que.1 at index 4 (Column E), ..., Que.6 at index 9 (Column J)
                    const scoreCellRawValue = (row.length > scoreCellIndex) ? row[scoreCellIndex] : null;
                    let currentScore = 0;

                    if (scoreCellRawValue !== null && String(scoreCellRawValue).trim() !== '') {
                        const cellValueString = String(scoreCellRawValue).trim();
                        const upperCaseValue = cellValueString.toUpperCase();

                        if (upperCaseValue !== 'NA') {
                            allQuestionsOriginallyNAOrEmpty = false; // There's some input for this question
                            const parsedScore = parseInt(cellValueString, 10);

                            if (!isNaN(parsedScore)) {
                                // Successfully parsed a number
                                if (parsedScore >= 1 && parsedScore <= 3) {
                                    currentScore = parsedScore;
                                } else {
                                    console.log(`[ExcelReader] INFO: Score value "${parsedScore}" for Que.${k} in row ${rowIndexForLog} (Sheet: "${sheetName}", Candidate: "${name || 'N/A'}") is out of expected range (1-3). Treating as 0.`);
                                    currentScore = 0; // Score is numeric but out of 1-3 range
                                }
                            } else {
                                // Not a number (e.g., "text", or a phone number string that parseInt fails on for very long numbers if not careful, but typically text)
                                console.log(`[ExcelReader] INFO: Non-numeric, non-NA value "${cellValueString}" for Que.${k} in row ${rowIndexForLog} (Sheet: "${sheetName}", Candidate: "${name || 'N/A'}"). Treating as 0.`);
                                currentScore = 0; 
                            }
                        }
                        // If 'NA', currentScore remains 0. allQuestionsOriginallyNAOrEmpty is not set to false by 'NA' itself.
                    }
                    // If scoreCellRawValue is null or empty string, currentScore remains 0.
                    
                    scores[`que${k}` as keyof Candidate['scores']] = currentScore;
                    totalScore += currentScore;
                }

                if (allQuestionsOriginallyNAOrEmpty) {
                    // console.log(`[ExcelReader] Skipping row ${rowIndexForLog} in sheet "${sheetName}" (Candidate: ${name || 'N/A'}) as all question scores were NA or empty.`);
                    continue;
                }
                
                const remarks = determineRemarks(totalScore);

                allParsedCandidates.push({
                    sNo: sNoCounter++,
                    name: name || 'N/A', // Default to 'N/A' if name was null/empty but mobile was present
                    district: district,
                    mobileNo: mobileNo || 'N/A', // Default to 'N/A' if mobile was null/empty but name was present
                    scores,
                    totalScore,
                    remarks,
                });
            }
        }
    } catch (error) {
        console.error("[ExcelReader] CRITICAL: Error reading or processing Excel file:", error);
        return []; // Return empty array on critical error
    }
    
    if (allParsedCandidates.length === 0) {
        console.warn("[ExcelReader] WARNING: No valid candidate data found after processing all sheets. Please check Excel file structure, content, and previous logs for skipped rows/sheets. Ensure 'CandidateData.xlsx' is in 'src/data/' and subsequent sheets contain data matching the expected column layout.");
    } else {
        console.log(`[ExcelReader] Successfully loaded and processed ${allParsedCandidates.length} candidates from Excel.`);
    }
    return allParsedCandidates;
}
