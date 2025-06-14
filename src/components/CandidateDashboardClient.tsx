
"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Icons } from '@/components/icons';
import type { Candidate, Stats } from '@/data/candidates';
import { ScoreGraph } from '@/components/ScoreGraph';
import { toTitleCase } from '@/lib/utils';
import { downloadCertificate } from '@/lib/pdfGenerator';
import { CertificateView } from '@/components/CertificateView';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';

const ALL_DISTRICTS_SELECT_VALUE = "_all_districts_";

interface CandidateDashboardClientProps {
  initialCandidates: Candidate[];
  initialStats: Stats;
}

export function CandidateDashboardClient({ initialCandidates, initialStats }: CandidateDashboardClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState<string>('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const [allCandidatesData, setAllCandidatesData] = useState<Candidate[]>(initialCandidates);
  const [currentStats, setCurrentStats] = useState<Stats | null>(initialStats);

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const { toast } = useToast();

  const certificateViewRef = useRef<HTMLDivElement>(null);

  const uniqueDistricts = useMemo(() => {
    const districtNames = new Set(
      allCandidatesData
        .map(c => c.district)
        .filter((d): d is string => typeof d === 'string' && d.trim() !== '')
        .map(d => toTitleCase(d))
    );
    return Array.from(districtNames).sort();
  }, [allCandidatesData]);

  useEffect(() => {
    let candidatesToSearch = allCandidatesData;

    if (selectedDistrictFilter) {
      candidatesToSearch = allCandidatesData.filter(candidate =>
        candidate.district && toTitleCase(candidate.district) === selectedDistrictFilter
      );
    }

    if (searchTerm.length > 1) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const suggestions = candidatesToSearch.filter(candidate =>
        candidate.name.toLowerCase().includes(lowerSearchTerm) ||
        (candidate.district && toTitleCase(candidate.district).toLowerCase().includes(lowerSearchTerm)) ||
        candidate.mobileNo.includes(searchTerm)
      ).slice(0, 10);
      setFilteredSuggestions(suggestions);
    } else {
      if (selectedDistrictFilter) {
        setFilteredSuggestions(candidatesToSearch.slice(0, 10));
      } else {
         setFilteredSuggestions(allCandidatesData.slice(0, 10));
      }
    }
  }, [searchTerm, selectedDistrictFilter, allCandidatesData]);


  const handleSelectCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setSearchTerm(candidate.name);
    setFilteredSuggestions([]);
  };

  const handleDownloadCertificate = async () => {
    if (!selectedCandidate) {
      toast({ variant: "destructive", title: "Error", description: "Please select a candidate first." });
      return;
    }
    if (!currentStats) {
      toast({ variant: "destructive", title: "Error", description: "Statistics data is not available." });
      return;
    }
     if (!certificateViewRef.current) {
      toast({ variant: "destructive", title: "Error", description: "Certificate template component (for chart) not ready." });
      return;
    }

    setIsGeneratingPdf(true);
    toast({ title: "Generating Certificate", description: "Please wait..." });
    try {
      await downloadCertificate(certificateViewRef.current, selectedCandidate, currentStats);
      toast({ title: "Success", description: "Certificate downloaded." });
    } catch (error) {
      console.error("Certificate download error:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not generate certificate. Check console for details." });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrictFilter(value);
    setSelectedCandidate(null);
  };

  if (!initialCandidates || initialCandidates.length === 0 || !initialStats) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <Icons.AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold text-destructive mb-2">Data Not Available</h2>
        <p className="text-lg text-muted-foreground text-center">
          Could not load candidate data. Please ensure 'CandidateData.xlsx' is correctly placed in the 'src/data' directory and is not empty.
        </p>
        <p className="text-sm text-muted-foreground mt-2">If the file is present, it might be empty or in an incorrect format. Check server logs for more details.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-background p-4 sm:p-6 md:p-8 font-body">
      <header className="w-full max-w-5xl mb-8 text-center">
        <div className="flex items-center justify-center space-x-3 sm:space-x-4 flex-wrap">

          <div className="text-right">
            <p className="poppins-bold text-3xl whitespace-nowrap">राज्य आनंद संस्थान</p>
            <p className="poppins-regular text-base whitespace-nowrap text-right">मध्यप्रदेश शासन</p>
          </div>

          <Image src="/iit-kgp-logo.png" alt="IIT Kharagpur Logo" width={60} height={60} className="rounded-sm" />

          <div className="text-left">
            <p className="poppins-semibold text-lg sm:text-xl whitespace-nowrap">Indian Institute of Technology, Kharagpur</p>
            <p className="poppins-regular text-sm sm:text-base whitespace-nowrap">भारतीय प्रौद्योगिकी संस्थान, खड़गपुर</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="poppins-medium text-3xl">Anandak Certificate Downloader</p>
          <p className="poppins-regular text-2xl">आनंदक प्रमाणपत्र डाउनलोडर</p>
        </div>
        <p className="text-muted-foreground mt-2 text-lg">Your Gateway to Professional Certification</p>
      </header>

      <main className="w-full max-w-4xl space-y-8">
        <Card className="shadow-xl relative animate-fade-in">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Find Your Certificate</CardTitle>
            <CardDescription>Search by name, district, or mobile number. Filter by district below.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <label htmlFor="district-select" className="block text-sm font-medium text-foreground mb-1">Filter by District:</label>
              <Select
                value={selectedDistrictFilter ? selectedDistrictFilter : ALL_DISTRICTS_SELECT_VALUE}
                onValueChange={(value) => {
                  if (value === ALL_DISTRICTS_SELECT_VALUE) {
                    handleDistrictChange('');
                  } else {
                    handleDistrictChange(value);
                  }
                }}
              >
                <SelectTrigger id="district-select" className="w-full">
                  <SelectValue placeholder="All Districts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_DISTRICTS_SELECT_VALUE}>
                    All Districts
                  </SelectItem>
                  {uniqueDistricts.map(district => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="relative">
              <div className="flex items-center space-x-2">
                <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter search term..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-base py-3 w-full"
                  aria-label="Search for candidate"
                />
                {searchTerm && (
                   <Button variant="ghost" size="icon" onClick={() => { setSearchTerm(''); setSelectedCandidate(null); }} aria-label="Clear search term">
                     <Icons.X className="h-5 w-5" />
                   </Button>
                )}
              </div>
              {searchTerm.length > 1 && (
                <ScrollArea className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto rounded-md border bg-card shadow-lg">
                  {filteredSuggestions.length > 0 ? (
                    <ul className="py-1">
                      {filteredSuggestions.map(candidate => (
                        <li
                          key={`${candidate.sNo}-${candidate.district}-${candidate.mobileNo}`}
                          onClick={() => handleSelectCandidate(candidate)}
                          className="px-3 py-2.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all duration-150 ease-in-out hover:shadow-md hover:scale-[1.02]"
                          role="option"
                          aria-selected={selectedCandidate?.sNo === candidate.sNo && selectedCandidate?.district === candidate.district && selectedCandidate?.mobileNo === candidate.mobileNo}
                        >
                          <p className="font-medium">{toTitleCase(candidate.name)}</p>
                          <p className="text-xs text-muted-foreground">{candidate.district ? toTitleCase(candidate.district) : 'N/A'} - {candidate.mobileNo}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-3 py-2.5 text-sm text-muted-foreground">No results found.</div>
                  )}
                </ScrollArea>
              )}
            </div>
          </CardContent>
        </Card>

        {selectedCandidate && currentStats && (
          <Card className="shadow-xl animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center">
                <Icons.User className="mr-3 h-7 w-7 text-primary" />
                {toTitleCase(selectedCandidate.name)}
              </CardTitle>
              <CardDescription className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 mt-1">
                <span className="flex items-center"><Icons.MapPin className="mr-1.5 h-4 w-4 text-muted-foreground" /> {selectedCandidate.district ? toTitleCase(selectedCandidate.district) : 'N/A'}</span>
                <span className="flex items-center"><Icons.Phone className="mr-1.5 h-4 w-4 text-muted-foreground" /> {selectedCandidate.mobileNo}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">Scores:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm">
                  {Object.entries(selectedCandidate.scores).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      <Icons.Star className="mr-2 h-4 w-4 text-yellow-500" />
                      <span className="font-medium capitalize">{key.replace('que', 'Que ')}:</span>
                      <span className="ml-1.5 text-foreground">{value}/3</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <p className="text-lg font-semibold">
                    Total Score: <span className="text-2xl text-primary font-bold">{selectedCandidate.totalScore}/18</span>
                  </p>
                  <p className="text-lg font-semibold mt-1 text-foreground">
                    Remarks: <span className="font-bold text-foreground">{selectedCandidate.remarks}</span>
                  </p>
                </div>
              </div>
              <div className="h-[300px] sm:h-[350px] w-full">
                <ScoreGraph selectedCandidate={selectedCandidate} stats={currentStats} />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleDownloadCertificate}
                disabled={isGeneratingPdf}
                className="w-full sm:w-auto text-base py-3 px-6 transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-105 active:scale-95"
              >
                {isGeneratingPdf ? (
                  <Icons.Spinner className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Icons.Download className="mr-2 h-5 w-5" />
                )}
                {isGeneratingPdf ? 'Generating...' : 'Download Certificate'}
              </Button>
            </CardFooter>
          </Card>
        )}
        {!selectedCandidate && (
           <Card className="shadow-xl text-center py-12 animate-fade-in">
             <CardContent>
               <Icons.Search className="mx-auto h-16 w-16 text-muted-foreground opacity-50 mb-4" />
               <p className="text-xl text-muted-foreground">Search for a candidate or select a district to view details. { allCandidatesData.length > 0 ? 'Showing initial suggestions from all districts.' : 'No candidate data loaded.'}</p>
             </CardContent>
           </Card>
        )}
      </main>

      {/* This div is for html2canvas to capture the chart from CertificateView */}
      {/* It's positioned off-screen. The CertificateView component itself is used for chart capture. */}
      <div ref={certificateViewRef} className="absolute -left-[9999px] -top-[9999px] opacity-0 pointer-events-none">
        {selectedCandidate && currentStats && (
            <CertificateView candidate={selectedCandidate} stats={currentStats} />
        )}
      </div>

      <footer className="w-full max-w-4xl mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Rajya Anand Sansthan. All rights reserved.</p>
        <p>Designed for transparent and accessible certification.</p>
      </footer>
    </div>
  );
}
