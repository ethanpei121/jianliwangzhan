"use client";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { memo, useCallback, useMemo, useState, type RefObject } from "react";
import { Download, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ResumeValues } from "@/lib/schema";

type ExportActionsProps = {
  data: ResumeValues;
  previewRef: RefObject<HTMLDivElement>;
};

type ExportKind = "pdf" | "word";

const WORD_EXPORT_SCALE = 2.5;
const PDF_EXPORT_SCALE = 4.8;

const EXPORT_LABEL: Record<ExportKind, string> = {
  pdf: "PDF",
  word: "Word",
};

function getSafeFileBaseName(fullName: string) {
  const normalized = fullName.trim().replace(/[\\/:*?"<>|]/g, "");
  return normalized || "简历";
}

function getDateStamp() {
  const date = new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}${month}${day}`;
}

function triggerDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function waitForImages(root: HTMLElement) {
  const imageNodes = Array.from(root.querySelectorAll("img"));
  await Promise.all(
    imageNodes.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
            return;
          }
          const handleDone = () => {
            img.removeEventListener("load", handleDone);
            img.removeEventListener("error", handleDone);
            resolve();
          };
          img.addEventListener("load", handleDone, { once: true });
          img.addEventListener("error", handleDone, { once: true });
          setTimeout(handleDone, 3000);
        }),
    ),
  );
}

async function waitForFonts() {
  if (!("fonts" in document)) {
    return;
  }

  try {
    await document.fonts.ready;
  } catch {
    // Ignore font readiness failures and continue to avoid blocking export.
  }
}

async function renderPreviewCanvas(
  previewElement: HTMLDivElement,
  scale: number,
) {
  const host = document.createElement("div");
  const clonedPreview = previewElement.cloneNode(true) as HTMLDivElement;
  const previewWidth = previewElement.clientWidth;
  const previewHeight = previewElement.clientHeight;
  const a4Height = Math.ceil((previewWidth * 297) / 210);
  let targetHeight = Math.max(previewHeight, a4Height);

  host.style.position = "fixed";
  host.style.left = "-100000px";
  host.style.top = "0";
  host.style.width = `${previewWidth}px`;
  host.style.background = "#ffffff";
  host.style.overflow = "visible";
  host.style.pointerEvents = "none";
  host.style.zIndex = "-1";

  clonedPreview.style.height = "auto";
  clonedPreview.style.minHeight = "0";
  clonedPreview.style.maxHeight = "none";
  clonedPreview.style.overflow = "visible";
  clonedPreview.style.aspectRatio = "auto";
  clonedPreview.style.boxShadow = "none";
  clonedPreview.style.borderRadius = "0";

  const resumePage = clonedPreview.querySelector("[data-resume-preview]") as HTMLDivElement | null;
  if (resumePage) {
    resumePage.style.minHeight = "0";
    resumePage.style.height = "auto";
    resumePage.style.maxHeight = "none";
  }

  host.appendChild(clonedPreview);
  document.body.appendChild(host);

  try {
    targetHeight = Math.max(
      targetHeight,
      Math.ceil(clonedPreview.scrollHeight),
      resumePage ? Math.ceil(resumePage.scrollHeight) : 0,
      resumePage ? Math.ceil(resumePage.getBoundingClientRect().height) : 0,
    );

    host.style.height = `${targetHeight}px`;
    host.style.minHeight = `${targetHeight}px`;
    host.style.overflow = "hidden";
    clonedPreview.style.height = `${targetHeight}px`;
    clonedPreview.style.minHeight = `${targetHeight}px`;
    if (resumePage) {
      resumePage.style.height = `${targetHeight}px`;
      resumePage.style.minHeight = `${targetHeight}px`;
    }

    await waitForFonts();
    await waitForImages(clonedPreview);
    return await html2canvas(clonedPreview, {
      scale,
      width: previewWidth,
      height: targetHeight,
      windowWidth: previewWidth,
      windowHeight: targetHeight,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });
  } finally {
    document.body.removeChild(host);
  }
}

function buildWordDocument(fileBaseName: string, imageData: string) {
  const wordHtml = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
  <head>
    <meta charset="utf-8" />
    <meta name="ProgId" content="Word.Document" />
    <meta name="Generator" content="Resume Builder" />
    <meta name="Originator" content="Resume Builder" />
    <title>${fileBaseName}</title>
    <style>
      body { margin: 0; background: #ffffff; }
      .page { width: 794px; margin: 0 auto; }
      img { width: 100%; display: block; height: auto; }
    </style>
  </head>
  <body>
    <div class="page">
      <img src="${imageData}" alt="resume" />
    </div>
  </body>
</html>`;

  return new Blob(["\ufeff", wordHtml], {
    type: "application/msword;charset=utf-8",
  });
}

function saveCanvasAsPdf(canvas: HTMLCanvasElement, fileBaseName: string) {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
    compress: false,
    precision: 12,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const pagePixelHeight = Math.max(
    1,
    Math.ceil((canvas.width * pageHeight) / pageWidth),
  );
  const pageCanvas = document.createElement("canvas");
  const pageContext = pageCanvas.getContext("2d");
  if (!pageContext) {
    throw new Error("无法创建 PDF 渲染上下文");
  }

  pageCanvas.width = canvas.width;

  let renderedHeight = 0;
  let pageIndex = 0;

  while (renderedHeight < canvas.height) {
    const sliceHeight = Math.min(
      pagePixelHeight,
      canvas.height - renderedHeight,
    );

    pageCanvas.height = sliceHeight;
    pageContext.clearRect(0, 0, pageCanvas.width, sliceHeight);
    pageContext.drawImage(
      canvas,
      0,
      renderedHeight,
      canvas.width,
      sliceHeight,
      0,
      0,
      canvas.width,
      sliceHeight,
    );

    const imageData = pageCanvas.toDataURL("image/png", 1);
    const renderedPageHeight = (sliceHeight * pageWidth) / canvas.width;

    if (pageIndex > 0) {
      pdf.addPage();
    }
    pdf.addImage(imageData, "PNG", 0, 0, pageWidth, renderedPageHeight);

    renderedHeight += sliceHeight;
    pageIndex += 1;
  }

  pdf.save(`${fileBaseName}.pdf`);
}

export const ExportActions = memo(function ExportActions({
  data,
  previewRef,
}: ExportActionsProps) {
  const [exporting, setExporting] = useState<ExportKind | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const isBusy = exporting !== null;

  const fileBaseName = useMemo(() => {
    return `${getSafeFileBaseName(data.personalInfo.fullName)}_${getDateStamp()}`;
  }, [data.personalInfo.fullName]);

  // 两种导出共享同一套前置检查与错误/收尾处理，只差渲染产物这一步。
  const runExport = useCallback(
    async (
      kind: ExportKind,
      writeFile: (canvas: HTMLCanvasElement) => void,
    ) => {
      const previewElement = previewRef.current;
      if (!previewElement) {
        setErrorMessage("预览区域未加载完成，请稍后重试。");
        return;
      }

      setErrorMessage("");
      setExporting(kind);

      try {
        const canvas = await renderPreviewCanvas(
          previewElement,
          kind === "pdf" ? PDF_EXPORT_SCALE : WORD_EXPORT_SCALE,
        );
        writeFile(canvas);
      } catch {
        setErrorMessage(`${EXPORT_LABEL[kind]} 导出失败，请重试。`);
      } finally {
        setExporting(null);
      }
    },
    [previewRef],
  );

  const exportPdf = useCallback(() => {
    void runExport("pdf", (canvas) => {
      saveCanvasAsPdf(canvas, fileBaseName);
    });
  }, [fileBaseName, runExport]);

  const exportWord = useCallback(() => {
    void runExport("word", (canvas) => {
      const blob = buildWordDocument(fileBaseName, canvas.toDataURL("image/png", 1));
      triggerDownload(blob, `${fileBaseName}.doc`);
    });
  }, [fileBaseName, runExport]);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={exportPdf}
          disabled={isBusy}
        >
          <Download size={14} />
          {exporting === "pdf" ? "导出中..." : "导出 PDF"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={exportWord}
          disabled={isBusy}
        >
          <FileText size={14} />
          {exporting === "word" ? "导出中..." : "导出 Word"}
        </Button>
      </div>
      <p className="text-xs text-gray-500">导出与右侧预览保持一致，支持主题颜色与版式。</p>
      {errorMessage ? <p className="text-xs text-red-600">{errorMessage}</p> : null}
    </div>
  );
});
