import React, { useState, useRef, useEffect } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Sliders,
  Download,
  RotateCcw,
  Sparkles,
  Sun,
  Contrast,
  Palette,
  Eye,
} from 'lucide-react';

interface ImageToolkitViewProps {
  onBackToHome: () => void;
  showToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export default function ImageToolkitView({ onBackToHome, showToast }: ImageToolkitViewProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState('edited-image.png');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [sepia, setSepia] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [blur, setBlur] = useState(0);
  const [hueRotate, setHueRotate] = useState(0);
  const [invert, setInvert] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imgElementRef = useRef<HTMLImageElement | null>(null);

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name.replace(/\.[^/.]+$/, '') + '-filtered.png');
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        setImageSrc(src);
        resetFilters();
        showToast('Image loaded! Adjust filters or download below.', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setSepia(0);
    setGrayscale(0);
    setBlur(0);
    setHueRotate(0);
    setInvert(0);
  };

  // Apply Presets
  const applyPreset = (preset: string) => {
    resetFilters();
    switch (preset) {
      case 'cyberpunk':
        setContrast(130);
        setSaturation(160);
        setHueRotate(280);
        setBrightness(105);
        break;
      case 'sepia':
        setSepia(80);
        setContrast(90);
        setBrightness(95);
        break;
      case 'noir':
        setGrayscale(100);
        setContrast(140);
        setBrightness(90);
        break;
      case 'golden':
        setHueRotate(30);
        setSaturation(130);
        setBrightness(105);
        break;
      case 'vivid':
        setContrast(125);
        setSaturation(145);
        setBrightness(102);
        break;
      default:
        break;
    }
    showToast(`Applied ${preset} preset!`, 'info');
  };

  // Draw to canvas with filters
  useEffect(() => {
    if (!imageSrc) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      imgElementRef.current = img;
      canvas.width = img.width;
      canvas.height = img.height;

      // Apply filter string to 2D context
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${sepia}%) grayscale(${grayscale}%) blur(${blur}px) hue-rotate(${hueRotate}deg) invert(${invert}%)`;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  }, [imageSrc, brightness, contrast, saturation, sepia, grayscale, blur, hueRotate, invert]);

  // Download image
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      showToast('Please upload an image first.', 'error');
      return;
    }
    const link = document.createElement('a');
    link.download = fileName;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('Image downloaded successfully!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 text-center space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>In-Browser Image Studio</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Image Toolkit
        </h2>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Crop, resize, or apply stunning photo filters to your AI creations right in your browser. Fast, private, and 100% free.
        </p>
      </div>

      {/* Upload Zone */}
      {!imageSrc ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 min-h-[260px] rounded-3xl bg-slate-900/60 p-8 flex flex-col items-center justify-center gap-4 cursor-pointer transition group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
            <Upload className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-white text-base">Click or Drag Image Here</h4>
            <p className="text-xs text-slate-400">Supports JPG, PNG, WebP, GIF up to 25MB</p>
          </div>
          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 text-xs font-bold border border-cyan-500/30"
          >
            Select From Computer / Phone
          </button>
        </div>
      ) : (
        /* Image Editor Active */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
          {/* Canvas Preview */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3 overflow-hidden flex items-center justify-center min-h-[320px] max-h-[460px]">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[440px] rounded-xl object-contain shadow-2xl"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Another Image</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition"
              >
                <Download className="w-4 h-4" />
                <span>Download Filtered Image</span>
              </button>
            </div>
          </div>

          {/* Filter Controls Sidebar */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-sm text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Adjust Effects
              </span>
              <button
                onClick={resetFilters}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
                title="Reset to original"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Instant Presets
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'cyberpunk', label: 'Cyberpunk' },
                  { id: 'noir', label: 'B&W Noir' },
                  { id: 'sepia', label: 'Vintage' },
                  { id: 'golden', label: 'Golden Hour' },
                  { id: 'vivid', label: 'Vivid HD' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => applyPreset(p.id)}
                    className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 text-xs font-semibold border border-slate-700/60 transition text-center"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-3.5 text-xs">
              {/* Brightness */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Brightness</span>
                  <span className="font-mono text-cyan-400">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="200"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              {/* Contrast */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Contrast</span>
                  <span className="font-mono text-cyan-400">{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="200"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              {/* Saturation */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Saturation</span>
                  <span className="font-mono text-cyan-400">{saturation}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="250"
                  value={saturation}
                  onChange={(e) => setSaturation(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              {/* Grayscale */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Black & White (Grayscale)</span>
                  <span className="font-mono text-cyan-400">{grayscale}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={grayscale}
                  onChange={(e) => setGrayscale(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              {/* Blur */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Soft Blur</span>
                  <span className="font-mono text-cyan-400">{blur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={blur}
                  onChange={(e) => setBlur(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <button
          onClick={onBackToHome}
          className="text-xs text-cyan-400 hover:underline font-semibold"
        >
          ← Back to Store Home
        </button>
      </div>
    </div>
  );
}
