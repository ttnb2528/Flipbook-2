// App.jsx
import HTMLFlipBook from "react-pageflip";
import PdfToImages from "./components/PdfToImages.jsx";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

const App = () => {
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [page, setPage] = useState(0);
  const book = useRef(null);
  const flipSound = useRef(null);

  const totalPages = pages.length;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", checkMobile);
    checkMobile();
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    flipSound.current = new Audio("public/pageturn.mp3");
  }, []);

  const handlePageFlip = (e) => {
    if (flipSound.current) flipSound.current.play();
    setPage(e.data);
  };

  const handlePdfLoad = (loadedPages) => {
    setPages(loadedPages);
    setIsLoading(false);
  };

  const goToFirstPage = () => {
    book.current.pageFlip().flip(0);
    setPage(0);
  };

  const prevPage = () => {
    book.current.pageFlip().flipPrev();
  };

  const nextPage = () => {
    book.current.pageFlip().flipNext();
  };

  const goToPage = (index) => {
    book.current.pageFlip().flip(index);
    setPage(index);
  };

  const downloadPage = (index) => {
    const a = document.createElement("a");
    a.href = pages[index];
    a.download = `page-${index + 1}.png`;
    a.click();
  };

  const width = isMobile ? 200 : 300;
  const height = isMobile ? 500 : 750;

  return (
    <div className="w-[97vw] min-h-screen flex flex-col items-center justify-center relative">
      {isLoading && (
        <div className="absolute text-xl font-semibold animate-pulse">
          Loading menu...
        </div>
      )}

      <PdfToImages
        pdfUrl="public/Menu_Dejavu_20.06.pdf"
        onLoad={handlePdfLoad}
      />

      {!isLoading && pages.length > 0 && (
        <>
          <HTMLFlipBook
            width={width}
            height={height}
            size="fixed"
            minWidth={200}
            maxWidth={300}
            minHeight={500}
            maxHeight={750}
            maxShadowOpacity={0.8}
            showCover={true}
            mobileScrollSupport={false}
            onFlip={handlePageFlip}
            className="menu-book"
            ref={book}
            startPage={0}
            drawShadow={true}
            flippingTime={isMobile ? 700 : 100}
            usePortrait={false}
            startZIndex={100}
            autoSize={false}
            clickEventForward={true}
            useMouseEvents={true}
            swipeDistance={50}
            showPageCorners={true}
            disableFlipByClick={false}
            style={{
              width: `${width}px`,
              height: `${height}px`,
              overflow: "hidden",
            }}
          >
            {pages.map((imgSrc, index) => (
              <div key={index} className="page">
                <img
                  src={imgSrc}
                  loading="lazy"
                  alt={`Page ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
            ))}
          </HTMLFlipBook>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={goToFirstPage}
              className="rounded-full border-amber-700 text-amber-700 hover:bg-amber-100"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={prevPage}
              disabled={page === 0}
              className="rounded-full border-amber-700 text-amber-700 hover:bg-amber-100 disabled:opacity-50"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <span className="text-amber-700 font-medium">
              {page + 1} / {totalPages}
            </span>

            <Button
              variant="outline"
              size="icon"
              onClick={nextPage}
              disabled={page === totalPages - 1}
              className="rounded-full border-amber-700 text-amber-700 hover:bg-amber-100 disabled:opacity-50"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            <select
              onChange={(e) => goToPage(Number(e.target.value))}
              value={page}
              className="rounded border px-2 py-1"
            >
              {pages.map((_, idx) => (
                <option key={idx} value={idx}>
                  Trang {idx + 1}
                </option>
              ))}
            </select>

            <Button onClick={() => downloadPage(page)}>
              Tải trang hiện tại
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
