"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Film, Play, ZoomIn, ExternalLink, X } from "lucide-react";

interface NasaPhoto {
  src: string;
  title: string;
  badge: string;
  badgeColor: string;
  desc: string;
  nasaId: string;
  nasaUrl: string;
}

export default function NASAOfficialFootage() {
  const t = useTranslations("footage");
  const [selectedImage, setSelectedImage] = useState<NasaPhoto | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const nasaPhotos: NasaPhoto[] = [
    {
      src: "/media/nasa/saffire-iv-pmma-flame.jpg",
      title: t("photos.pmma.title"),
      badge: t("photos.pmma.badge"),
      badgeColor: "text-[#76b900] border-[#76b900]/40",
      desc: t("photos.pmma.desc"),
      nasaId: "jsc2023e046631",
      nasaUrl: "https://images.nasa.gov/details/jsc2023e046631",
    },
    {
      src: "/media/nasa/saffire-iv-fabric-flame.jpg",
      title: t("photos.fabric.title"),
      badge: t("photos.fabric.badge"),
      badgeColor: "text-[#df6500] border-[#df6500]/40",
      desc: t("photos.fabric.desc"),
      nasaId: "jsc2023e046375",
      nasaUrl: "https://images.nasa.gov/details/jsc2023e046375",
    },
    {
      src: "/media/nasa/bass-ii-acrylic-flame.jpg",
      title: t("photos.sphere.title"),
      badge: t("photos.sphere.badge"),
      badgeColor: "text-[#00b0ff] border-[#00b0ff]/40",
      desc: t("photos.sphere.desc"),
      nasaId: "iss040e072900",
      nasaUrl: "https://images.nasa.gov/details/iss040e072900",
    },
    {
      src: "/media/nasa/bass-ii-reduced-o2-flame.jpg",
      title: t("photos.reducedO2.title"),
      badge: t("photos.reducedO2.badge"),
      badgeColor: "text-[#e040fb] border-[#e040fb]/40",
      desc: t("photos.reducedO2.desc"),
      nasaId: "iss040e086481",
      nasaUrl: "https://images.nasa.gov/details/iss040e086481",
    },
  ];

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#333333] pb-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 bg-black border border-[#76b900] text-[#76b900] text-[10px] font-bold uppercase tracking-wider mb-2">
            <Film className="h-3 w-3" />
            <span>{t("eyebrow")}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {t("title")}
          </h2>
          <p className="text-xs text-[#a7a7a7] mt-1">
            {t.rich("subtitle", { b: (chunks) => <strong>{chunks}</strong> })}
          </p>
        </div>
        <span className="text-[10px] font-mono text-[#898989] shrink-0">
          {t("archive")}
        </span>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Video 1: Saffire-V */}
        <div className="bg-[#1a1a1a] border border-[#333333] p-4 space-y-3 relative">
          <div className="corner-square" />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Play className="h-4 w-4 text-[#76b900]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                {t("video1Title")}
              </h3>
            </div>
            <span className="px-1.5 py-0.5 text-[9px] font-mono bg-black border border-[#76b900]/40 text-[#76b900]">
              {t("officialVideo")}
            </span>
          </div>
          <div className="relative rounded overflow-hidden bg-black border border-[#222222]">
            <video
              src="/media/nasa/saffire-v-pmma-flame.mp4"
              controls
              preload="metadata"
              className="w-full aspect-video object-cover"
            />
          </div>
          <div className="space-y-1 font-sans">
            <p className="text-[11px] text-[#cccccc] leading-relaxed">
              {t("video1Desc")}
            </p>
            <div className="flex items-center justify-between text-[10px] font-mono text-[#757575] pt-1 border-t border-[#2a2a2a]">
              <span>ID: GRC-2021-CN-00008</span>
              <a
                href="https://images.nasa.gov/details/GRC-2021-CN-00008"
                target="_blank"
                rel="noreferrer"
                className="text-[#76b900] hover:underline"
              >
                {t("viewOnNasa")}
              </a>
            </div>
          </div>
        </div>

        {/* Video 2: SoFIE-GEL */}
        <div className="bg-[#1a1a1a] border border-[#333333] p-4 space-y-3 relative">
          <div className="corner-square" />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Play className="h-4 w-4 text-[#00b0ff]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                {t("video2Title")}
              </h3>
            </div>
            <span className="px-1.5 py-0.5 text-[9px] font-mono bg-black border border-[#00b0ff]/40 text-[#00b0ff]">
              {t("officialVideo")}
            </span>
          </div>
          <div className="relative rounded overflow-hidden bg-black border border-[#222222]">
            <video
              src="/media/nasa/sofie-flame-extinction.mp4"
              controls
              preload="metadata"
              className="w-full aspect-video object-cover"
            />
          </div>
          <div className="space-y-1 font-sans">
            <p className="text-[11px] text-[#cccccc] leading-relaxed">
              {t("video2Desc")}
            </p>
            <div className="flex items-center justify-between text-[10px] font-mono text-[#757575] pt-1 border-t border-[#2a2a2a]">
              <span>ID: SoFIE-GEL</span>
              <a
                href="https://images.nasa.gov/details/SoFIE-GEL"
                target="_blank"
                rel="noreferrer"
                className="text-[#00b0ff] hover:underline"
              >
                {t("viewOnNasa")}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* High-Res Photo Gallery (Clickable / Expandable Lightbox) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {nasaPhotos.map((photo, pIdx) => (
          <div
            key={pIdx}
            onClick={() => setSelectedImage(photo)}
            className="group bg-[#141414] hover:bg-[#1a1a1a] border border-[#333333] hover:border-[#76b900] p-2.5 space-y-2 cursor-pointer transition-all duration-200 select-none"
          >
            <div className="relative aspect-video sm:aspect-square bg-black overflow-hidden border border-[#2a2a2a] group-hover:border-[#76b900]/60">
              <img
                src={photo.src}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Hover Overlay with Zoom Indicator */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <span className="px-2 py-1 bg-black/90 border border-[#76b900] text-[#76b900] text-[10px] font-mono font-bold flex items-center space-x-1 shadow-lg transform -translate-y-1 group-hover:translate-y-0 transition-transform">
                  <ZoomIn className="h-3.5 w-3.5" />
                  <span>{t("enlarge")}</span>
                </span>
              </div>
              <span className={`absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/85 text-[9px] font-mono border ${photo.badgeColor}`}>
                {photo.badge}
              </span>
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-white group-hover:text-[#76b900] transition-colors uppercase leading-snug">
                {photo.title}
              </h4>
              <p className="text-[10px] text-[#898989] leading-tight mt-0.5 line-clamp-2">
                {photo.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal for NASA Photo Enlargement */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-[#111111] border-2 border-[#76b900] shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col max-h-[94vh] overflow-hidden rounded-[2px]"
          >
            <div className="corner-square border-[#76b900]" />

            {/* Modal Header */}
            <div className="p-3 sm:p-4 bg-[#1a1a1a] border-b border-[#333333] flex items-center justify-between select-none">
              <div className="flex items-center space-x-2.5 min-w-0">
                <span className={`text-[10px] font-mono px-2 py-0.5 bg-black border shrink-0 ${selectedImage.badgeColor}`}>
                  {selectedImage.badge}
                </span>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white truncate">
                  {selectedImage.title}
                </h3>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <a
                  href={selectedImage.src}
                  target="_blank"
                  rel="noreferrer"
                  title={t("lightbox.openOriginal")}
                  className="p-1.5 text-[#898989] hover:text-[#76b900] hover:bg-black transition-colors border border-[#333333]"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-1.5 text-[#898989] hover:text-white hover:bg-[#262626] transition-colors border border-[#333333]"
                  title={t("lightbox.closeEsc")}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Enlarged Image Display */}
            <div className="flex-1 bg-black p-2 sm:p-4 flex items-center justify-center overflow-hidden min-h-[300px]">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="max-h-[60vh] sm:max-h-[68vh] w-auto max-w-full object-contain border border-[#222222] shadow-2xl"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 bg-[#141414] border-t border-[#333333] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <p className="text-[#cccccc] text-[11px] sm:text-xs leading-relaxed max-w-2xl">
                  {selectedImage.desc}
                </p>
                <div className="flex items-center space-x-3 text-[10px] font-mono text-[#898989]">
                  <span>{t("nasaId")}: <strong className="text-[#76b900]">{selectedImage.nasaId}</strong></span>
                  <span>•</span>
                  <span>{t("publicDomain")}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 shrink-0 w-full sm:w-auto justify-end">
                <a
                  href={selectedImage.nasaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#1a1a1a] hover:bg-black text-[#76b900] hover:text-white border border-[#76b900]/40 text-[11px] font-mono font-bold uppercase transition-colors"
                >
                  <span>NASA.gov</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="px-3.5 py-1.5 bg-[#76b900] hover:bg-[#5a8d00] text-black font-bold uppercase text-[11px] tracking-wider transition-colors"
                >
                  {t("lightbox.close")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
