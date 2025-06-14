// "use client";

// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import type { Candidate, Stats } from '@/data/candidates';
// import { toTitleCase } from './utils';

// // --- HSL to RGB Converter ---
// function hslToRgb(h: number, s: number, l: number): [number, number, number] {
//   s /= 100;
//   l /= 100;
//   const k = (n: number) => (n + h / 30) % 12;
//   const a = s * Math.min(l, 1 - l);
//   const f = (n: number) =>
//     l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
//   return [255 * f(0), 255 * f(8), 255 * f(4)];
// }

// // --- Constants for PDF ---
// const A4_WIDTH_PT = 841.89; // 297mm
// const A4_HEIGHT_PT = 595.28; // 210mm
// const MARGIN_PT = 36; // 0.5 inch margin

// const PRIMARY_COLOR_RGB = hslToRgb(27, 100, 50);
// const ACCENT_COLOR_RGB = hslToRgb(33, 90, 55);
// const TEXT_COLOR_RGB: [number, number, number] = [20, 14, 8].map(v => v * 2.55) as [number,number,number];
// const LIGHT_TEXT_COLOR_RGB: [number, number, number] = [128,128,128];

// // PDF Render Sizes
// const MP_EMBLEM_SIZE = { width: 60, height: 60 };
// const RAJYA_ANAND_SIZE = { width: 288, height: 144 }; // Wider for horizontal stretch
// const IIT_KGP_SIZE = { width: 60, height: 60 };

// // High-quality SVG to PNG conversion
// async function svgToPng(svgPath: string, width: number, height: number): Promise<string> {
//   try {
//     const response = await fetch(svgPath);
//     if (!response.ok) {
//       throw new Error(`Failed to fetch SVG: ${response.statusText}`);
//     }
//     let svgText = await response.text();
    
//     // For rajya-anand-sansthan-logo.svg, modify for better centering
//     if (svgPath.includes('rajya-anand-sansthan-logo.svg')) {
//       svgText = svgText.replace(
//         '<svg', 
//         '<svg preserveAspectRatio="xMidYMid meet" style="display: block; margin: 0 11vw; width: 100%; height: 100%;"'
//       );
//     }
    
//     // Wait for fonts to load
//     await document.fonts.ready;
    
//     // Create a canvas element with high resolution
//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');
//     if (!ctx) {
//       throw new Error('Failed to get canvas context');
//     }
    
//     // Use much higher scale for better quality
//     const scale = 6;
//     canvas.width = width * scale;
//     canvas.height = height * scale;
    
//     // Enable high-quality rendering
//     ctx.imageSmoothingEnabled = true;
//     ctx.imageSmoothingQuality = 'high';
//     ctx.scale(scale, scale);
    
//     // Create an image element and load the SVG
//     const img = new Image();
//     const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
//     const url = URL.createObjectURL(svgBlob);
    
//     return new Promise((resolve, reject) => {
//       img.onload = () => {
//         // Clear canvas with white background for better visibility
//         ctx.fillStyle = 'white';
//         ctx.fillRect(0, 0, width, height);
        
//         // Center the image on canvas
//         const imgAspectRatio = img.naturalWidth / img.naturalHeight;
//         const canvasAspectRatio = width / height;
        
//         let drawWidth = width;
//         let drawHeight = height;
//         let drawX = 0;
//         let drawY = 0;
        
//         if (svgPath.includes('rajya-anand-sansthan-logo.svg')) {
//           // For Rajya Anand logo, stretch to fill width but maintain centering
//           drawWidth = width;
//           drawHeight = height;
//           drawX = 0;
//           drawY = 0;
//         } else {
//           // For other logos, maintain aspect ratio and center
//           if (imgAspectRatio > canvasAspectRatio) {
//             drawHeight = width / imgAspectRatio;
//             drawY = (height - drawHeight) / 2;
//           } else {
//             drawWidth = height * imgAspectRatio;
//             drawX = (width - drawWidth) / 2;
//           }
//         }
        
//         // Draw the SVG image with high quality
//         ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        
//         // Convert to PNG data URL with maximum quality
//         const pngDataUrl = canvas.toDataURL('image/png', 1.0);
//         URL.revokeObjectURL(url);
//         resolve(pngDataUrl);
//       };
      
//       img.onerror = () => {
//         URL.revokeObjectURL(url);
//         reject(new Error('Failed to load SVG image'));
//       };
      
//       img.src = url;
//     });
//   } catch (error) {
//     console.error(`Error converting SVG to PNG: ${svgPath}`, error);
//     // Return a fallback 1x1 transparent PNG
//     return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
//   }
// }

// const toast = (options: { variant?: "default" | "destructive", title: string, description: string }) => {
//   console.log(`TOAST: ${options.title} - ${options.description} (Variant: ${options.variant || 'default'})`);
// };

// export const downloadCertificate = async (
//   certificateViewElement: HTMLElement | null,
//   candidate: Candidate | null,
//   stats: Stats | null
// ) => {
//   console.log("[PDFGenerator] Initiating certificate generation with centered Rajya Anand logo.");
  
//   if (!candidate) {
//     console.error('[PDFGenerator] Critical Error: Candidate object is null. Aborting PDF generation.');
//     toast({ variant: "destructive", title: "Error", description: "Candidate data missing for PDF." });
//     return;
//   }
  
//   if (!certificateViewElement) {
//     console.error('[PDFGenerator] Critical Error: Certificate view element (for chart) is null. Aborting PDF generation.');
//     toast({ variant: "destructive", title: "Error", description: "Certificate template missing for PDF." });
//     return;
//   }
  
//   if (!stats) {
//     console.warn('[PDFGenerator] Warning: Stats object is null. Chart might be affected.');
//   }

//   // Convert SVG files to high-quality PNG
//   console.log("[PDFGenerator] Converting SVG files to high-quality PNG...");
//   const [mpEmblemDataUri, rajyaAnandLogoDataUri, iitKgpLogoDataUri] = await Promise.all([
//     svgToPng('/mp-emblem.svg', MP_EMBLEM_SIZE.width, MP_EMBLEM_SIZE.height),
//     // svgToPng('/rajya-anand-sansthan-logo.svg', RAJYA_ANAND_SIZE.width, RAJYA_ANAND_SIZE.height),
//     svgToPng('/rj-logo.svg', RAJYA_ANAND_SIZE.width, RAJYA_ANAND_SIZE.height),
//     svgToPng('/iit-kgp-logo.svg', IIT_KGP_SIZE.width, IIT_KGP_SIZE.height)
//   ]);
//   console.log("[PDFGenerator] SVG conversion completed.");

//   const pdf = new jsPDF({
//     orientation: 'landscape',
//     unit: 'pt',
//     format: [A4_WIDTH_PT, A4_HEIGHT_PT],
//   });

//   // Use Helvetica as default font
//   const setFont = (weight: 'normal' | 'bold' = 'normal') => {
//     pdf.setFont('Helvetica', weight);
//   };

//   // --- Draw Border ---
//   pdf.setDrawColor(...PRIMARY_COLOR_RGB);
//   pdf.setLineWidth(10);
//   pdf.rect(5, 5, A4_WIDTH_PT - 10, A4_HEIGHT_PT - 10);
//   pdf.setLineWidth(1);

//   // --- Header Section - Three Logo Layout ---
//   const headerY = MARGIN_PT;
  
//   // Left side: MP Emblem
//   const leftSideX = MARGIN_PT;
//   try {
//     pdf.addImage(mpEmblemDataUri, 'PNG', leftSideX, headerY, MP_EMBLEM_SIZE.width, MP_EMBLEM_SIZE.height);
//   } catch (e) {
//     console.error("[PDFGenerator] Error adding MP Emblem PNG to PDF:", e);
//   }

//   // Center: Rajya Anand Logo (horizontally stretched and centered)
//   const rajyaAnandX = (A4_WIDTH_PT - RAJYA_ANAND_SIZE.width) / 2; // Center horizontally
//   try {
//     pdf.addImage(rajyaAnandLogoDataUri, 'PNG', rajyaAnandX, headerY, RAJYA_ANAND_SIZE.width, RAJYA_ANAND_SIZE.height);
//   } catch (e) {
//     console.error("[PDFGenerator] Error adding Rajya Anand Logo PNG to PDF:", e);
//   }

//   // Right side: IIT KGP Logo
//   const iitLogoX = A4_WIDTH_PT - MARGIN_PT - IIT_KGP_SIZE.width;
//   try {
//     pdf.addImage(iitKgpLogoDataUri, 'PNG', iitLogoX, headerY, IIT_KGP_SIZE.width, IIT_KGP_SIZE.height);
//   } catch (e) {
//     console.error("[PDFGenerator] Error adding IIT KGP logo PNG to PDF:", e);
//   }
  
//   const mainContentYStart = headerY + Math.max(MP_EMBLEM_SIZE.height, RAJYA_ANAND_SIZE.height, IIT_KGP_SIZE.height) + 30;
//   let currentY = mainContentYStart;

//   // --- Certificate Text ---
//   setFont('bold');
//   pdf.setFontSize(28);
//   pdf.setTextColor(...PRIMARY_COLOR_RGB);
//   pdf.text("Certificate of Achievement", A4_WIDTH_PT / 2, currentY, { align: 'center' });
//   currentY += 35;

//   setFont();
//   pdf.setFontSize(14);
//   pdf.setTextColor(...TEXT_COLOR_RGB);
//   pdf.text("This certificate is proudly presented to", A4_WIDTH_PT / 2, currentY, { align: 'center' });
//   currentY += 30;

//   // Candidate Name
//   setFont('bold');
//   pdf.setFontSize(22);
//   pdf.setTextColor(...ACCENT_COLOR_RGB);
//   pdf.text(toTitleCase(candidate.name), A4_WIDTH_PT / 2, currentY, { align: 'center' });
//   currentY += 30;

//   setFont();
//   pdf.setFontSize(12);
//   pdf.setTextColor(...TEXT_COLOR_RGB);
//   pdf.text("For successfully completing the evaluation held in", A4_WIDTH_PT / 2, currentY, { align: 'center' });
//   currentY += 20;

//   // District Name
//   setFont('bold');
//   pdf.setFontSize(14);
//   pdf.setTextColor(...TEXT_COLOR_RGB);
//   pdf.text(toTitleCase(candidate.district), A4_WIDTH_PT / 2, currentY, { align: 'center' });
//   currentY += 40;

//   // --- Performance Details and Chart ---
//   const columnStartY = currentY;
//   const leftColumnX = MARGIN_PT + 30;
//   const rightColumnX = A4_WIDTH_PT / 2 + 10;
//   const columnWidth = (A4_WIDTH_PT / 2) - MARGIN_PT - 40;

//   let perfDetailsY = columnStartY;
//   setFont('bold');
//   pdf.setFontSize(14);
//   pdf.setTextColor(...PRIMARY_COLOR_RGB);
//   pdf.text("Performance Details", leftColumnX, perfDetailsY);
//   perfDetailsY += 20;

//   // --- Modern Performance Table ---
//   const scores = candidate.scores;
//   const tableX = leftColumnX - 5;
//   const tableWidth = columnWidth - 10;
//   const cellHeight = 20;
//   const cellPadding = 5;
  
//   // Table styling
//   const headerBgColor: [number, number, number] = [245, 247, 250];
//   const cellBgColor: [number, number, number] = [255, 255, 255];
//   const borderColor: [number, number, number] = [226, 232, 240];
  
//   // Draw table header
//   pdf.setFillColor(...headerBgColor);
//   pdf.setDrawColor(...borderColor);
//   pdf.setLineWidth(0.5);
//   pdf.rect(tableX, perfDetailsY, tableWidth, cellHeight, 'FD');
  
//   // Header text
//   setFont('bold');
//   pdf.setFontSize(11);
//   pdf.setTextColor(...TEXT_COLOR_RGB);
//   pdf.text("Question Scores", tableX + tableWidth / 2, perfDetailsY + cellHeight / 2 + 2, { align: 'center' });
  
//   perfDetailsY += cellHeight;
  
//   // Score rows data
//   const scoreData = [
//     [`Que 1: ${scores.que1}/3`, `Que 2: ${scores.que2}/3`],
//     [`Que 3: ${scores.que3}/3`, `Que 4: ${scores.que4}/3`],
//     [`Que 5: ${scores.que5}/3`, `Que 6: ${scores.que6}/3`]
//   ];
  
//   // Draw score rows
//   setFont();
//   pdf.setFontSize(10);
//   pdf.setTextColor(...TEXT_COLOR_RGB);
  
//   for (let i = 0; i < scoreData.length; i++) {
//     const rowY = perfDetailsY + (i * cellHeight);
    
//     // Alternate row background
//     if (i % 2 === 0) {
//       pdf.setFillColor(...cellBgColor);
//     } else {
//       pdf.setFillColor(248, 250, 252);
//     }
    
//     // Draw row background
//     pdf.rect(tableX, rowY, tableWidth, cellHeight, 'FD');
    
//     // Draw cell borders
//     pdf.setDrawColor(...borderColor);
//     pdf.line(tableX, rowY, tableX + tableWidth, rowY); // Top border
//     pdf.line(tableX, rowY + cellHeight, tableX + tableWidth, rowY + cellHeight); // Bottom border
//     pdf.line(tableX, rowY, tableX, rowY + cellHeight); // Left border
//     pdf.line(tableX + tableWidth, rowY, tableX + tableWidth, rowY + cellHeight); // Right border
//     pdf.line(tableX + tableWidth / 2, rowY, tableX + tableWidth / 2, rowY + cellHeight); // Middle border
    
//     // Add text centered in cells
//     const leftCellX = tableX + (tableWidth / 4);
//     const rightCellX = tableX + (3 * tableWidth / 4);
//     const textY = rowY + cellHeight / 2 + 2;
    
//     pdf.text(scoreData[i][0], leftCellX, textY, { align: 'center' });
//     pdf.text(scoreData[i][1], rightCellX, textY, { align: 'center' });
//   }
  
//   perfDetailsY += scoreData.length * cellHeight;
  
//   // Total Score row with special styling
//   const totalRowY = perfDetailsY;
//   pdf.setFillColor(...ACCENT_COLOR_RGB);
//   pdf.rect(tableX, totalRowY, tableWidth, cellHeight + 5, 'FD');
  
//   // Total score text
//   setFont('bold');
//   pdf.setFontSize(12);
//   pdf.setTextColor(255, 255, 255);
//   pdf.text(`Total Score: ${candidate.totalScore}/18`, tableX + tableWidth / 2, totalRowY + (cellHeight + 5) / 2 + 2, { align: 'center' });
  
//   perfDetailsY += cellHeight + 15;

//   // Remarks section
//   pdf.setTextColor(...TEXT_COLOR_RGB);
//   pdf.setFontSize(12);
//   setFont('bold');
//   pdf.text("Remarks:", leftColumnX, perfDetailsY);
//   perfDetailsY += 15;
//   pdf.setFontSize(14);
//   setFont('bold');
//   pdf.setTextColor(...ACCENT_COLOR_RGB);
//   pdf.text(candidate.remarks, leftColumnX, perfDetailsY, { maxWidth: columnWidth - 20 });

//   // --- Enhanced Chart Rendering ---
//   let chartY = columnStartY;
//   setFont('bold');
//   pdf.setFontSize(12);
//   pdf.setTextColor(...PRIMARY_COLOR_RGB);
//   pdf.text("Performance Comparison", rightColumnX, chartY);
//   chartY += 15;

//   // Look for chart with multiple possible selectors
//   const chartSelectors = [
//     '[data-testid="score-graph"]',
//     '.score-graph-container',
//     '[class*="recharts-responsive-container"]',
//     '.recharts-wrapper'
//   ];
  
//   let chartContainerElement: HTMLElement | null = null;
//   for (const selector of chartSelectors) {
//     chartContainerElement = certificateViewElement?.querySelector(selector) as HTMLElement | null;
//     if (chartContainerElement) {
//       console.log(`[PDFGenerator] Chart element found with selector: ${selector}`);
//       break;
//     }
//   }

//   if (chartContainerElement) {
//     try {
//       console.log("[PDFGenerator] Chart element found, preparing capture...");
      
//       // Ensure chart is visible and properly rendered
//       const computedStyle = window.getComputedStyle(chartContainerElement);
//       console.log('Chart visibility:', computedStyle.visibility);
//       console.log('Chart display:', computedStyle.display);
//       console.log('Chart dimensions:', {
//         width: chartContainerElement.offsetWidth,
//         height: chartContainerElement.offsetHeight
//       });
      
//       // Wait for chart to fully render
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       // Force a re-render by triggering resize event
//       window.dispatchEvent(new Event('resize'));
//       await new Promise(resolve => setTimeout(resolve, 800));
      
//       // Scroll the chart into view to ensure it's rendered
//       chartContainerElement.scrollIntoView({ behavior: 'instant', block: 'center' });
//       await new Promise(resolve => setTimeout(resolve, 500));
      
//       console.log("[PDFGenerator] Attempting html2canvas for chart...");
//       const canvas = await html2canvas(chartContainerElement, {
//         scale: 2, // Reduced scale for better compatibility
//         useCORS: true,
//         logging: true, // Enable logging for debugging
//         backgroundColor: 'white',
//         allowTaint: true, // Allow tainted canvas
//         foreignObjectRendering: false, // Disable for better SVG compatibility
//         ignoreElements: (element) => {
//           // Skip problematic elements
//           return element.tagName === 'IFRAME' || element.tagName === 'SCRIPT';
//         },
//         width: chartContainerElement.offsetWidth,
//         height: chartContainerElement.offsetHeight,
//         windowWidth: window.innerWidth,
//         windowHeight: window.innerHeight,
//         scrollX: 0,
//         scrollY: 0,
//       });
      
//       console.log(`[PDFGenerator] Chart captured successfully: ${canvas.width}x${canvas.height}`);
      
//       if (canvas.width > 0 && canvas.height > 0) {
//         const chartImgData = canvas.toDataURL('image/png', 1.0);
//         const chartHeight = 120;
//         const chartWidth = (canvas.width / canvas.height) * chartHeight;
        
//         // Add the chart image to PDF
//         pdf.addImage(
//           chartImgData, 
//           'PNG', 
//           rightColumnX, 
//           chartY, 
//           Math.min(chartWidth, columnWidth), 
//           chartHeight
//         );
        
//         console.log("[PDFGenerator] Chart successfully added to PDF");
//       } else {
//         throw new Error('Canvas has zero dimensions');
//       }
//     } catch (e) {
//       console.error("[PDFGenerator] Error rendering chart to PDF:", e);
//       setFont(); 
//       pdf.setTextColor(...TEXT_COLOR_RGB);
//       pdf.text("[Chart rendering failed]", rightColumnX + 20, chartY + 60);
//     }
//   } else {
//     console.warn("[PDFGenerator] Chart element not found in CertificateView for PDF generation.");
//     setFont(); 
//     pdf.setTextColor(...TEXT_COLOR_RGB);
//     pdf.text("[Chart element not found]", rightColumnX + 20, chartY + 60);
//   }

//   // --- Footer ---
//   const footerY = A4_HEIGHT_PT - MARGIN_PT - 30;
//   setFont();
//   pdf.setFontSize(10);
//   pdf.setTextColor(...TEXT_COLOR_RGB);

//   const genDate = new Date().toLocaleDateString('en-GB', {
//     day: '2-digit',
//     month: 'long',
//     year: 'numeric',
//   });
//   pdf.text(`Date: ${genDate}`, MARGIN_PT + 20, footerY + 15);

//   // Signature Placeholder
//   const signatureWidth = 120;
//   const signatureHeight = 40;
//   const signatureX = A4_WIDTH_PT / 2 - signatureWidth / 2;
//   const signatureY = footerY - 15;
  
//   setFont(); 
//   pdf.text("[Signature]", signatureX + (signatureWidth/2) - 20, signatureY + (signatureHeight/2));
//   pdf.setDrawColor(...LIGHT_TEXT_COLOR_RGB);
//   pdf.line(signatureX, signatureY + signatureHeight + 3, signatureX + signatureWidth, signatureY + signatureHeight + 3);
//   setFont();
//   pdf.text("Issuing Authority", A4_WIDTH_PT / 2, signatureY + signatureHeight + 15, { align: 'center' });

//   // --- Filename and Save ---
//   let safeCandidateName = 'Certificate';
//   if (candidate && candidate.name && typeof candidate.name === 'string') {
//     safeCandidateName = candidate.name;
//   } else {
//     console.warn('[PDFGenerator] Candidate name is missing or invalid; using default filename.');
//   }
  
//   const cleanName = safeCandidateName.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, '_');
//   const fileName = `${toTitleCase(cleanName)}_Certificate.pdf`;

//   try {
//     if (!candidate) {
//       console.error('[PDFGenerator] Candidate data became null before saving PDF. Aborting save.');
//       toast({ variant: "destructive", title: "Error", description: "Critical data missing, cannot save PDF." });
//       return;
//     }
//     pdf.save(fileName);
//     console.log(`[PDFGenerator] Certificate for ${safeCandidateName} saved as ${fileName}`);
//     toast({ variant: "default", title: "Success", description: "Certificate downloaded successfully!" });
//   } catch(e) {
//     console.error("[PDFGenerator] Error saving PDF:", e);
//     toast({ variant: "destructive", title: "PDF Save Error", description: "Could not save the PDF." });
//   }
// };

"use client";

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { Candidate, Stats } from '@/data/candidates';
import { toTitleCase } from './utils';

// --- HSL to RGB Converter ---
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [255 * f(0), 255 * f(8), 255 * f(4)];
}

// --- Constants for PDF ---
const A4_WIDTH_PT = 841.89; // 297mm
const A4_HEIGHT_PT = 595.28; // 210mm
const MARGIN_PT = 36; // 0.5 inch margin

const PRIMARY_COLOR_RGB = hslToRgb(27, 100, 50);
const ACCENT_COLOR_RGB = hslToRgb(33, 90, 55);
const TEXT_COLOR_RGB: [number, number, number] = [20, 14, 8].map(v => v * 2.55) as [number,number,number];
const LIGHT_TEXT_COLOR_RGB: [number, number, number] = [128,128,128];

// PDF Render Sizes
const MP_EMBLEM_SIZE = { width: 60, height: 60 };
const RAJYA_ANAND_SIZE = { width: 288, height: 144 }; // Wider for horizontal stretch
const IIT_HEADING_SIZE = { width: 168, height: 84 }; // w: 120, h: 60
const IIT_KGP_SIZE = { width: 60, height: 60 };

// High-quality SVG to PNG conversion
async function svgToPng(svgPath: string, width: number, height: number): Promise<string> {
  try {
    const response = await fetch(svgPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch SVG: ${response.statusText}`);
    }
    let svgText = await response.text();
    
    // For rajya-anand-sansthan-logo.svg, modify for better centering
    if (svgPath.includes('rajya-anand-sansthan-logo.svg')) {
      svgText = svgText.replace(
        '<svg', 
        '<svg preserveAspectRatio="xMidYMid meet" style="display: block; margin: 0 11vw; width: 100%; height: 100%;"'
      );
    }
    
    // Wait for fonts to load
    await document.fonts.ready;
    
    // Create a canvas element with high resolution
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }
    
    // Use much higher scale for better quality
    const scale = 6;
    canvas.width = width * scale;
    canvas.height = height * scale;
    
    // Enable high-quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.scale(scale, scale);
    
    // Create an image element and load the SVG
    const img = new Image();
    const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        // Clear canvas with white background for better visibility
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        
        // Center the image on canvas
        const imgAspectRatio = img.naturalWidth / img.naturalHeight;
        const canvasAspectRatio = width / height;
        
        let drawWidth = width;
        let drawHeight = height;
        let drawX = 0;
        let drawY = 0;
        
        if (svgPath.includes('rajya-anand-sansthan-logo.svg')) {
          // For Rajya Anand logo, stretch to fill width but maintain centering
          drawWidth = width;
          drawHeight = height;
          drawX = 0;
          drawY = 0;
        } else {
          // For other logos, maintain aspect ratio and center
          if (imgAspectRatio > canvasAspectRatio) {
            drawHeight = width / imgAspectRatio;
            drawY = (height - drawHeight) / 2;
          } else {
            drawWidth = height * imgAspectRatio;
            drawX = (width - drawWidth) / 2;
          }
        }
        
        // Draw the SVG image with high quality
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        
        // Convert to PNG data URL with maximum quality
        const pngDataUrl = canvas.toDataURL('image/png', 1.0);
        URL.revokeObjectURL(url);
        resolve(pngDataUrl);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load SVG image'));
      };
      
      img.src = url;
    });
  } catch (error) {
    console.error(`Error converting SVG to PNG: ${svgPath}`, error);
    // Return a fallback 1x1 transparent PNG
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
  }
}

const toast = (options: { variant?: "default" | "destructive", title: string, description: string }) => {
  console.log(`TOAST: ${options.title} - ${options.description} (Variant: ${options.variant || 'default'})`);
};

export const downloadCertificate = async (
  certificateViewElement: HTMLElement | null,
  candidate: Candidate | null,
  stats: Stats | null
) => {
  console.log("[PDFGenerator] Initiating certificate generation with centered Rajya Anand logo.");
  
  if (!candidate) {
    console.error('[PDFGenerator] Critical Error: Candidate object is null. Aborting PDF generation.');
    toast({ variant: "destructive", title: "Error", description: "Candidate data missing for PDF." });
    return;
  }
  
  if (!certificateViewElement) {
    console.error('[PDFGenerator] Critical Error: Certificate view element (for chart) is null. Aborting PDF generation.');
    toast({ variant: "destructive", title: "Error", description: "Certificate template missing for PDF." });
    return;
  }
  
  if (!stats) {
    console.warn('[PDFGenerator] Warning: Stats object is null. Chart might be affected.');
  }

  // Convert SVG files to high-quality PNG
  console.log("[PDFGenerator] Converting SVG files to high-quality PNG...");
  const [mpEmblemDataUri, rajyaAnandLogoDataUri, iitHeadingDataUri, iitKgpLogoDataUri] = await Promise.all([
    svgToPng('/mp-emblem.svg', MP_EMBLEM_SIZE.width, MP_EMBLEM_SIZE.height),
    // svgToPng('/rajya-anand-sansthan-logo.svg', RAJYA_ANAND_SIZE.width, RAJYA_ANAND_SIZE.height),
    svgToPng('/rj-logo.svg', RAJYA_ANAND_SIZE.width, RAJYA_ANAND_SIZE.height),
    svgToPng('/iit_kharagpur_heading.svg', IIT_HEADING_SIZE.width, IIT_HEADING_SIZE.height),
    svgToPng('/iit-kgp-logo.svg', IIT_KGP_SIZE.width, IIT_KGP_SIZE.height)
  ]);
  console.log("[PDFGenerator] SVG conversion completed.");

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: [A4_WIDTH_PT, A4_HEIGHT_PT],
  });

  // Use Helvetica as default font
  const setFont = (weight: 'normal' | 'bold' = 'normal') => {
    pdf.setFont('Helvetica', weight);
  };

  // --- Draw Border ---
  pdf.setDrawColor(...PRIMARY_COLOR_RGB);
  pdf.setLineWidth(10);
  pdf.rect(5, 5, A4_WIDTH_PT - 10, A4_HEIGHT_PT - 10);
  pdf.setLineWidth(1);

  // --- Header Section - Three Logo Layout ---
  const headerY = MARGIN_PT;
  
  // Left side: MP Emblem
  const leftSideX = MARGIN_PT;
  try {
    pdf.addImage(mpEmblemDataUri, 'PNG', leftSideX, headerY, MP_EMBLEM_SIZE.width, MP_EMBLEM_SIZE.height);
  } catch (e) {
    console.error("[PDFGenerator] Error adding MP Emblem PNG to PDF:", e);
  }

  // Center: Rajya Anand Logo (horizontally stretched and centered)
  const rajyaAnandX = (A4_WIDTH_PT - RAJYA_ANAND_SIZE.width) / 2; // Center horizontally
  const rajyaAnandY = headerY + 25; // Move down by 25 points from header baseline
  try {
    // pdf.addImage(rajyaAnandLogoDataUri, 'PNG', rajyaAnandX, headerY, RAJYA_ANAND_SIZE.width, RAJYA_ANAND_SIZE.height);
    pdf.addImage(rajyaAnandLogoDataUri, 'PNG', rajyaAnandX, rajyaAnandY, RAJYA_ANAND_SIZE.width, RAJYA_ANAND_SIZE.height);
  } catch (e) {
    console.error("[PDFGenerator] Error adding Rajya Anand Logo PNG to PDF:", e);
  }

  // Right side: IIT Kharagpur Heading + IIT KGP Logo
  const iitHeadingX = A4_WIDTH_PT - MARGIN_PT - IIT_HEADING_SIZE.width - IIT_KGP_SIZE.width - 10; // 10pt gap between heading and logo
  const iitHeadingY = headerY - 10; // Move 20 points upward
  const iitLogoX = A4_WIDTH_PT - MARGIN_PT - IIT_KGP_SIZE.width;
  
  try {
    // pdf.addImage(iitHeadingDataUri, 'PNG', iitHeadingX, headerY, IIT_HEADING_SIZE.width, IIT_HEADING_SIZE.height);
    pdf.addImage(iitHeadingDataUri, 'PNG', iitHeadingX, iitHeadingY, IIT_HEADING_SIZE.width, IIT_HEADING_SIZE.height);
  } catch (e) {
    console.error("[PDFGenerator] Error adding IIT Kharagpur Heading PNG to PDF:", e);
  }
  
  try {
    pdf.addImage(iitKgpLogoDataUri, 'PNG', iitLogoX, headerY, IIT_KGP_SIZE.width, IIT_KGP_SIZE.height);
  } catch (e) {
    console.error("[PDFGenerator] Error adding IIT KGP logo PNG to PDF:", e);
  }
  
  const mainContentYStart = headerY + Math.max(MP_EMBLEM_SIZE.height, RAJYA_ANAND_SIZE.height, IIT_HEADING_SIZE.height, IIT_KGP_SIZE.height) + 30;
  let currentY = mainContentYStart;

  // --- Certificate Text ---
  setFont('bold');
  pdf.setFontSize(28);
  pdf.setTextColor(...PRIMARY_COLOR_RGB);
  pdf.text("Certificate of Achievement", A4_WIDTH_PT / 2, currentY, { align: 'center' });
  currentY += 35;

  setFont();
  pdf.setFontSize(14);
  pdf.setTextColor(...TEXT_COLOR_RGB);
  pdf.text("This certificate is proudly presented to", A4_WIDTH_PT / 2, currentY, { align: 'center' });
  currentY += 30;

  // Candidate Name
  setFont('bold');
  pdf.setFontSize(22);
  pdf.setTextColor(...ACCENT_COLOR_RGB);
  pdf.text(toTitleCase(candidate.name), A4_WIDTH_PT / 2, currentY, { align: 'center' });
  currentY += 30;

  setFont();
  pdf.setFontSize(12);
  pdf.setTextColor(...TEXT_COLOR_RGB);
  pdf.text("For successfully completing the evaluation held in", A4_WIDTH_PT / 2, currentY, { align: 'center' });
  currentY += 20;

  // District Name
  setFont('bold');
  pdf.setFontSize(14);
  pdf.setTextColor(...TEXT_COLOR_RGB);
  pdf.text(toTitleCase(candidate.district), A4_WIDTH_PT / 2, currentY, { align: 'center' });
  currentY += 40;

  // --- Performance Details and Chart ---
  const columnStartY = currentY;
  const leftColumnX = MARGIN_PT + 30;
  const rightColumnX = A4_WIDTH_PT / 2 + 10;
  const columnWidth = (A4_WIDTH_PT / 2) - MARGIN_PT - 40;

  let perfDetailsY = columnStartY;
  setFont('bold');
  pdf.setFontSize(14);
  pdf.setTextColor(...PRIMARY_COLOR_RGB);
  pdf.text("Performance Details", leftColumnX, perfDetailsY);
  perfDetailsY += 20;

  // --- Modern Performance Table ---
  const scores = candidate.scores;
  const tableX = leftColumnX - 5;
  const tableWidth = columnWidth - 10;
  const cellHeight = 20;
  const cellPadding = 5;
  
  // Table styling
  const headerBgColor: [number, number, number] = [245, 247, 250];
  const cellBgColor: [number, number, number] = [255, 255, 255];
  const borderColor: [number, number, number] = [226, 232, 240];
  
  // Draw table header
  pdf.setFillColor(...headerBgColor);
  pdf.setDrawColor(...borderColor);
  pdf.setLineWidth(0.5);
  pdf.rect(tableX, perfDetailsY, tableWidth, cellHeight, 'FD');
  
  // Header text
  setFont('bold');
  pdf.setFontSize(11);
  pdf.setTextColor(...TEXT_COLOR_RGB);
  pdf.text("Question Scores", tableX + tableWidth / 2, perfDetailsY + cellHeight / 2 + 2, { align: 'center' });
  
  perfDetailsY += cellHeight;
  
  // Score rows data
  const scoreData = [
    [`Que 1: ${scores.que1}/3`, `Que 2: ${scores.que2}/3`],
    [`Que 3: ${scores.que3}/3`, `Que 4: ${scores.que4}/3`],
    [`Que 5: ${scores.que5}/3`, `Que 6: ${scores.que6}/3`]
  ];
  
  // Draw score rows
  setFont();
  pdf.setFontSize(10);
  pdf.setTextColor(...TEXT_COLOR_RGB);
  
  for (let i = 0; i < scoreData.length; i++) {
    const rowY = perfDetailsY + (i * cellHeight);
    
    // Alternate row background
    if (i % 2 === 0) {
      pdf.setFillColor(...cellBgColor);
    } else {
      pdf.setFillColor(248, 250, 252);
    }
    
    // Draw row background
    pdf.rect(tableX, rowY, tableWidth, cellHeight, 'FD');
    
    // Draw cell borders
    pdf.setDrawColor(...borderColor);
    pdf.line(tableX, rowY, tableX + tableWidth, rowY); // Top border
    pdf.line(tableX, rowY + cellHeight, tableX + tableWidth, rowY + cellHeight); // Bottom border
    pdf.line(tableX, rowY, tableX, rowY + cellHeight); // Left border
    pdf.line(tableX + tableWidth, rowY, tableX + tableWidth, rowY + cellHeight); // Right border
    pdf.line(tableX + tableWidth / 2, rowY, tableX + tableWidth / 2, rowY + cellHeight); // Middle border
    
    // Add text centered in cells
    const leftCellX = tableX + (tableWidth / 4);
    const rightCellX = tableX + (3 * tableWidth / 4);
    const textY = rowY + cellHeight / 2 + 2;
    
    pdf.text(scoreData[i][0], leftCellX, textY, { align: 'center' });
    pdf.text(scoreData[i][1], rightCellX, textY, { align: 'center' });
  }
  
  perfDetailsY += scoreData.length * cellHeight;
  
  // Total Score row with special styling
  const totalRowY = perfDetailsY;
  pdf.setFillColor(...ACCENT_COLOR_RGB);
  pdf.rect(tableX, totalRowY, tableWidth, cellHeight + 5, 'FD');
  
  // Total score text
  setFont('bold');
  pdf.setFontSize(12);
  pdf.setTextColor(255, 255, 255);
  pdf.text(`Total Score: ${candidate.totalScore}/18`, tableX + tableWidth / 2, totalRowY + (cellHeight + 5) / 2 + 2, { align: 'center' });
  
  perfDetailsY += cellHeight + 15;

  // Add additional spacing before remarks (positive y-axis distance)
  perfDetailsY += 10; // Add 25 points of extra space

  // Remarks section
  pdf.setTextColor(...TEXT_COLOR_RGB);
  pdf.setFontSize(12);
  setFont('bold');
  pdf.text("Remarks:", leftColumnX, perfDetailsY);
  perfDetailsY += 15;
  pdf.setFontSize(14);
  setFont('bold');
  pdf.setTextColor(...ACCENT_COLOR_RGB);
  pdf.text(candidate.remarks, leftColumnX, perfDetailsY, { maxWidth: columnWidth - 20 });

  // --- Enhanced Chart Rendering ---
  let chartY = columnStartY;
  setFont('bold');
  pdf.setFontSize(12);
  pdf.setTextColor(...PRIMARY_COLOR_RGB);
  pdf.text("Performance Comparison", rightColumnX, chartY);
  chartY += 15;

  // Look for chart with multiple possible selectors
  const chartSelectors = [
    '[data-testid="score-graph"]',
    '.score-graph-container',
    '[class*="recharts-responsive-container"]',
    '.recharts-wrapper'
  ];
  
  let chartContainerElement: HTMLElement | null = null;
  for (const selector of chartSelectors) {
    chartContainerElement = certificateViewElement?.querySelector(selector) as HTMLElement | null;
    if (chartContainerElement) {
      console.log(`[PDFGenerator] Chart element found with selector: ${selector}`);
      break;
    }
  }

  if (chartContainerElement) {
    try {
      console.log("[PDFGenerator] Chart element found, preparing capture...");
      
      // Ensure chart is visible and properly rendered
      const computedStyle = window.getComputedStyle(chartContainerElement);
      console.log('Chart visibility:', computedStyle.visibility);
      console.log('Chart display:', computedStyle.display);
      console.log('Chart dimensions:', {
        width: chartContainerElement.offsetWidth,
        height: chartContainerElement.offsetHeight
      });
      
      // Wait for chart to fully render
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Force a re-render by triggering resize event
      window.dispatchEvent(new Event('resize'));
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Scroll the chart into view to ensure it's rendered
      chartContainerElement.scrollIntoView({ behavior: 'instant', block: 'center' });
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log("[PDFGenerator] Attempting html2canvas for chart...");
      const canvas = await html2canvas(chartContainerElement, {
        scale: 2, // Reduced scale for better compatibility
        useCORS: true,
        logging: true, // Enable logging for debugging
        backgroundColor: 'white',
        allowTaint: true, // Allow tainted canvas
        foreignObjectRendering: false, // Disable for better SVG compatibility
        ignoreElements: (element) => {
          // Skip problematic elements
          return element.tagName === 'IFRAME' || element.tagName === 'SCRIPT';
        },
        width: chartContainerElement.offsetWidth,
        height: chartContainerElement.offsetHeight,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        scrollX: 0,
        scrollY: 0,
      });
      
      console.log(`[PDFGenerator] Chart captured successfully: ${canvas.width}x${canvas.height}`);
      
      if (canvas.width > 0 && canvas.height > 0) {
        const chartImgData = canvas.toDataURL('image/png', 1.0);
        const chartHeight = 120;
        const chartWidth = (canvas.width / canvas.height) * chartHeight;
        
        // Add the chart image to PDF
        pdf.addImage(
          chartImgData, 
          'PNG', 
          rightColumnX, 
          chartY, 
          Math.min(chartWidth, columnWidth), 
          chartHeight
        );
        
        console.log("[PDFGenerator] Chart successfully added to PDF");
      } else {
        throw new Error('Canvas has zero dimensions');
      }
    } catch (e) {
      console.error("[PDFGenerator] Error rendering chart to PDF:", e);
      setFont(); 
      pdf.setTextColor(...TEXT_COLOR_RGB);
      pdf.text("[Chart rendering failed]", rightColumnX + 20, chartY + 60);
    }
  } else {
    console.warn("[PDFGenerator] Chart element not found in CertificateView for PDF generation.");
    setFont(); 
    pdf.setTextColor(...TEXT_COLOR_RGB);
    pdf.text("[Chart element not found]", rightColumnX + 20, chartY + 60);
  }

  // --- Footer ---
  const footerY = A4_HEIGHT_PT - MARGIN_PT - 30;
  setFont();
  pdf.setFontSize(10);
  pdf.setTextColor(...TEXT_COLOR_RGB);

  const genDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  pdf.text(`Date: ${genDate}`, MARGIN_PT + 20, footerY + 25);

  // Signature Placeholder
  const signatureWidth = 120;
  const signatureHeight = 40;
  const signatureX = A4_WIDTH_PT / 2 - signatureWidth / 2;
  const signatureY = footerY - 15;
  
  setFont(); 
  pdf.text("[Signature]", signatureX + (signatureWidth/2) - 20, signatureY + (signatureHeight/2));
  pdf.setDrawColor(...LIGHT_TEXT_COLOR_RGB);
  pdf.line(signatureX, signatureY + signatureHeight + 3, signatureX + signatureWidth, signatureY + signatureHeight + 3);
  setFont();
  pdf.text("Issuing Authority", A4_WIDTH_PT / 2, signatureY + signatureHeight + 15, { align: 'center' });

  // --- Filename and Save ---
  let safeCandidateName = 'Certificate';
  if (candidate && candidate.name && typeof candidate.name === 'string') {
    safeCandidateName = candidate.name;
  } else {
    console.warn('[PDFGenerator] Candidate name is missing or invalid; using default filename.');
  }
  
  const cleanName = safeCandidateName.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, '_');
  const fileName = `${toTitleCase(cleanName)}_Certificate.pdf`;

  try {
    if (!candidate) {
      console.error('[PDFGenerator] Candidate data became null before saving PDF. Aborting save.');
      toast({ variant: "destructive", title: "Error", description: "Critical data missing, cannot save PDF." });
      return;
    }
    pdf.save(fileName);
    console.log(`[PDFGenerator] Certificate for ${safeCandidateName} saved as ${fileName}`);
    toast({ variant: "default", title: "Success", description: "Certificate downloaded successfully!" });
  } catch(e) {
    console.error("[PDFGenerator] Error saving PDF:", e);
    toast({ variant: "destructive", title: "PDF Save Error", description: "Could not save the PDF." });
  }
};
