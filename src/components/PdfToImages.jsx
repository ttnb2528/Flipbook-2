// PdfToImages.jsx
import { useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker?worker";

// Gắn worker
pdfjsLib.GlobalWorkerOptions.workerPort = new pdfjsWorker();

const PdfToImages = ({ pdfUrl, onLoad }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        // Tải PDF qua fetch trước để đảm bảo preload nhanh hơn
        const response = await fetch(pdfUrl);
        const arrayBuffer = await response.arrayBuffer();

        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        const tasks = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          tasks.push(
            pdf.getPage(i).then(async (page) => {
              const scale = 3; // Nét hơn
              const viewport = page.getViewport({ scale });
              const canvas = document.createElement("canvas");
              const context = canvas.getContext("2d");

              canvas.width = viewport.width;
              canvas.height = viewport.height;

              await page.render({ canvasContext: context, viewport }).promise;
              return canvas.toDataURL(); // base64 ảnh
            })
          );
        }

        const pages = await Promise.all(tasks);
        setImages(pages);
        if (onLoad) onLoad(pages);
      } catch (error) {
        console.error("Lỗi khi tải PDF:", error);
      }
    };

    loadPdf();
  }, [pdfUrl, onLoad]);

  return null; // Không hiển thị, chỉ xử lý và truyền ảnh về cho App
};

export default PdfToImages;
