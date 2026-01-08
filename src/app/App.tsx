import React, { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Plus, AlertCircle, Loader2 } from "lucide-react";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { analyzePdf, TypoDetection } from "../services/typoDetectorApi";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

// SVGs and Assets from Figma
import svgPaths from "../imports/svg-lboohywl3h";
import svgPathsSecondary from "../imports/svg-548mwxn9ze";

function Header({ onUpload, hasUploaded, errorMessage }: { onUpload: () => void, hasUploaded: boolean, errorMessage: string | null }) {
  return (
    <header className="fixed top-0 left-0 right-0 h-[72px] bg-background border-bYB border-border flex items-center justify-between px-6 z-50 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="h-5 w-[89.84px]">
            <svg className="block w-full h-full" viewBox="0 0 89.8408 20" fill="none">
              <path d={svgPaths.p3ea93380} fill="#E4002B" />
            </svg>
          </div>
          {/* Removed custom font, using default sans as per instructions */}
          <p className="font-medium text-primary text-[20px] tracking-widest leading-[20px]">labs</p>
        </div>
        {errorMessage && (
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {hasUploaded ? (
          null
        ) : (
          <button
            onClick={onUpload}
            className="w-9 h-9 bg-secondary hover:bg-secondary/80 transition-colors rounded-lgyb flex items-center justify-center text-primary"
          >
            <div className="w-5 h-5">
              <svg viewBox="0 0 20 20" fill="none" className="w-full h-full">
                <path d={svgPathsSecondary.p383246f0} fill="currentColor" />
                <path d={svgPathsSecondary.p3b5d80} fill="currentColor" />
              </svg>
            </div>
          </button>
        )}
      </div>
    </header>
  );
}

function ThumbnailSidebar({ file, numPages, selectedId, onSelect }: { file: File | null, numPages: number, selectedId: number, onSelect: (id: number) => void }) {
  return (
    <div className="fixed left-0 top-[72px] bottom-0 w-[210px] overflow-y-auto bg-background p-2 pt-7 flex flex-col gap-3 scrollbar-hide items-center border-r border-border">
      <Document file={file}>
        {Array.from(new Array(numPages), (_, index) => {
          const pageNum = index + 1;
          const isSelected = selectedId === pageNum;
          return (
            <div
              key={`thumb_${pageNum}`}
              onClick={() => {
                onSelect(pageNum);
                // Scroll to the corresponding page in the main view
                const mainView = document.querySelector('.flex-1.ml-\\[210px\\]');
                if (mainView) {
                  const pages = mainView.querySelectorAll('.react-pdf__Page');
                  const targetPage = pages[index];
                  if (targetPage) {
                    targetPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }
              }}
              className={`relative w-[164px] h-[220px] rounded-lg cursor-pointer transition-all border overflow-hidden shrink-0 bg-white mb-3 ${isSelected ? "border-2 border-primary" : "border-border hover:border-gray-300"
                }`}
            >
              <div className="w-full h-full overflow-hidden flex items-start justify-center pointer-events-none">
                <Page
                  pageNumber={pageNum}
                  width={164}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="max-h-full"
                />
              </div>
            </div>
          );
        })}
      </Document>
    </div>
  );
}

function RightSidebar({
  typos,
  isAnalyzing,
  selectedTypo,
  onTypoClick
}: {
  typos: TypoDetection[],
  isAnalyzing: boolean,
  selectedTypo: number | null,
  onTypoClick: (index: number) => void
}) {
  return (
    <div className="fixed right-0 top-[72px] bottom-0 w-[480px] bg-sidebar border-l border-border flex flex-col">
      <div className="relative flex items-center justify-between w-full px-7 pt-7 mb-3">
        <h2 className="text-lg font-medium text-foreground tracking-tight leading-6">AI Suggestions</h2>
        {isAnalyzing && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Analyzing...
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-7 pb-7">
        {typos.length === 0 ? (
          isAnalyzing ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Loader2 className="w-12 h-12 animate-spin text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">Analyzing PDF for typos...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">No typos found yet</p>
              <p className="text-xs text-muted-foreground mt-2">Upload a PDF to detect typos</p>
            </div>
          )
        ) : (
          <div className="space-y-3">
            {typos.map((typo, index) => (
              <div
                key={index}
                onClick={() => onTypoClick(index)}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:bg-white ${selectedTypo === index ? 'border-primary bg-white' : 'border-border bg-white'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground mb-1">
                      "{typo.text}"
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Suggestion: <span className="text-green-600 font-medium">{typo.suggestion}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


function PageWithTypoOverlay({
  pageNum,
  width,
  typos,
  activeTypo
}: {
  pageNum: number,
  width: number,
  typos: TypoDetection[],
  activeTypo: TypoDetection | null
}) {
  const [pageDimensions, setPageDimensions] = useState<{ width: number, height: number } | null>(null);
  const activeTypoRef = useRef<HTMLDivElement>(null);

  const onPageLoadSuccess = (page: any) => {
    setPageDimensions({ width: page.originalWidth, height: page.originalHeight });
  };

  useEffect(() => {
    if (activeTypo && activeTypoRef.current && activeTypo.pageNumber === pageNum) {
      activeTypoRef.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    }
  }, [activeTypo, pageNum]);

  return (
    <div className="relative">
      <Page
        pageNumber={pageNum}
        width={width}
        className="bg-white shadow-sm"
        onLoadSuccess={onPageLoadSuccess}
      />

      {/* Invisible anchor for active typo scrolling */}
      {pageDimensions && activeTypo && activeTypo.pageNumber === pageNum && activeTypo.boundingBox && (
        (() => {
          const scale = width / pageDimensions.width;
          const { x, y, width: boxW, height: boxH } = activeTypo.boundingBox;
          return (
            <div
              ref={activeTypoRef}
              className="absolute pointer-events-none"
              style={{
                left: 0,
                top: y * scale,
                width: '100%',
                height: boxH * scale,
                // Invisible but takes up space for positioning
                visibility: 'hidden'
              }}
            />
          );
        })()
      )}
    </div>
  );
}

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [selectedPage, setSelectedPage] = useState(1);
  const [typos, setTypos] = useState<TypoDetection[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedTypo, setSelectedTypo] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();

      setSelectedPage(1);
      setTypos([]);
      setSelectedTypo(null);
      setErrorMessage(null);

      console.log('📄 Uploading file:', selectedFile.name);
      console.log('📊 File size:', (selectedFile.size / 1024).toFixed(2), 'KB');

      // Only accept PDF files
      if (fileExtension !== 'pdf') {
        setErrorMessage('Only PDF files are supported. Please upload a PDF file.');
        return;
      }

      setFile(selectedFile);

      // Analyze PDF for typos
      setIsAnalyzing(true);
      try {
        console.log('🔍 Sending request to backend...');
        const response = await analyzePdf(selectedFile);
        console.log('✅ Backend response:', response);
        console.log('📋 Response details:', {
          status: response.status,
          totalPages: response.totalPages,
          typosCount: response.typos?.length || 0,
          firstTypo: response.typos?.[0]
        });

        if (response.status === 'success') {
          console.log(`🎯 Found ${response.typos.length} typos`);
          console.log('🎯 Typo details:', response.typos);
          setTypos(response.typos);

          if (response.typos.length === 0) {
            setErrorMessage('No typos found! The document appears to be well-written.');
            setTimeout(() => setErrorMessage(null), 5000);
          } else {
            setErrorMessage(`Found ${response.typos.length} potential typos! Check the right sidebar.`);
            setTimeout(() => setErrorMessage(null), 5000);
          }
        } else {
          console.error('❌ Analysis failed:', response.message);
          setErrorMessage('Analysis failed: ' + response.message);
        }
      } catch (error) {
        console.error('❌ Error analyzing file:', error);
        setErrorMessage('Failed to connect to backend. Make sure the backend server is running on port 8080.');
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const onDocumentLoadSuccess = useCallback(({ numPages: nextNumPages }: { numPages: number }) => {
    setNumPages(prev => prev === nextNumPages ? prev : nextNumPages);
  }, []);

  return (
    <div className="min-h-screen bg-sidebar">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,application/pdf"
      />

      <Header onUpload={handleUploadClick} hasUploaded={!!file} errorMessage={errorMessage} />

      <main className="pt-[72px] h-screen flex relative overflow-hidden">
        <AnimatePresence>
          {!file ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 bg-background"
            />
          ) : (
            <motion.div
              key="loaded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex w-full h-full"
            >
              {/* Thumbnails */}
              <ThumbnailSidebar
                file={file}
                numPages={numPages}
                selectedId={selectedPage}
                onSelect={setSelectedPage}
              />

              {/* Custom Scrollbar mimic - preserved from original but might need adjustment if real scrollbar is sufficient */}
              {/* <div className="fixed left-[210px] top-[108px] w-3 h-[392px] bg-[#dedede] rounded-full z-10" /> */}

              {/* Main Preview Area */}
              <div className="flex-1 ml-[210px] mr-[480px] p-7 overflow-y-auto overflow-x-hidden bg-[rgb(244,244,244)] min-h-full scrollbar-hide">
                <div className="mx-auto w-full max-w-[1218px] flex flex-col items-center">
                  <div className="w-full max-w-[947px] mb-9">
                    <Document file={file} onLoadSuccess={onDocumentLoadSuccess} className="flex flex-col items-center gap-4 py-8">
                      {Array.from(new Array(numPages), (_, index) => {
                        const pageNum = index + 1;
                        const pageTypos = typos.filter(t => t.pageNumber === pageNum);
                        const activeTypo = selectedTypo !== null ? typos[selectedTypo] : null;

                        return (
                          <PageWithTypoOverlay
                            key={`page_wrapper_${pageNum}`}
                            pageNum={pageNum}
                            width={947}
                            typos={pageTypos}
                            activeTypo={activeTypo}
                          />
                        );
                      })}
                    </Document>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <RightSidebar
                typos={typos}
                isAnalyzing={isAnalyzing}
                selectedTypo={selectedTypo}
                onTypoClick={setSelectedTypo}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}