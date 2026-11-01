import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Upload,
  Camera,
  Sparkles,
  AlertCircle,
  FileText,
  Search,
  CheckCircle2,
  X,
} from 'lucide-react';
import { SAMPLE_PLANTS } from '../data/samplePlants';
import { PlantIdentificationData, SamplePlantPreset } from '../types';
import { PlantIllustration } from './PlantIllustration';

interface PlantScannerProps {
  onScanComplete: (data: PlantIdentificationData, photoUrl?: string, modelUsed?: string) => void;
  onSelectSamplePreset: (preset: SamplePlantPreset) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  errorMessage: string | null;
  setErrorMessage: (msg: string | null) => void;
}

// Client-side image resizing helper (max 1024px side, JPEG 0.8 quality)
function resizeImage(dataUrl: string, maxDimension = 1024, quality = 0.8): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export const PlantScanner: React.FC<PlantScannerProps> = ({
  onScanComplete,
  onSelectSamplePreset,
  isLoading,
  setIsLoading,
  errorMessage,
  setErrorMessage,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [userNotes, setUserNotes] = useState('');
  const [analysisMode, setAnalysisMode] = useState<'general' | 'health'>('general');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const loadingSteps = [
    'Scanning leaf venation & structural morphology...',
    'Consulting Gemini botanical vision engine...',
    'Analyzing leaf chlorophyll, margins & potential pathogens...',
    'Synthesizing tailored sunlight, watering & soil care guide...',
  ];

  // Stop camera tracks helper
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  // Ensure camera streams are cleaned up on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // Camera start with automatic fallback to native device camera capture
  // Camera start with automatic fallback to native device camera capture
  const startCamera = async () => {
    setErrorMessage(null);

    // If getUserMedia is not supported in the current frame or browser, open native camera file capture
    if (!navigator?.mediaDevices?.getUserMedia) {
      cameraInputRef.current?.click();
      return;
    }

    try {
      setIsCameraActive(true);
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        });
      } catch {
        // Fallback for laptops/desktops with front-facing or standard webcams
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
      }
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((playErr) => {
          console.warn('Video playback was prevented or interrupted:', playErr);
        });
      }
    } catch (err: any) {
      console.warn('Live camera stream not permitted, falling back to native capture dialog:', err?.message || err);
      setIsCameraActive(false);
      // Fallback: Trigger device camera dialog directly on mobile
      if (cameraInputRef.current) {
        cameraInputRef.current.click();
      } else {
        setErrorMessage('Camera access was restricted by browser settings. Please upload a photo or select a plant preset.');
      }
    }
  };

  // Process image with server backend
  const processImage = async (imageBase64: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 1800);

    try {
      const notesWithMode = analysisMode === 'health'
        ? `Focus primarily on leaf health, spotting diseases, pest damage, and corrective treatment. Additional notes: ${userNotes}`
        : userNotes;

      const response = await fetch('/api/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          mimeType: 'image/jpeg',
          userNotes: notesWithMode,
        }),
      });

      clearInterval(stepInterval);

      if (!response.ok) {
        let errorMsg = '';
        try {
          const errData = await response.json();
          errorMsg = errData.error || errData.message;
        } catch {
          // Response body was not JSON (e.g. 404 HTML page)
        }
        if (!errorMsg) {
          if (response.status === 404) {
            errorMsg = 'API endpoint /api/identify not found (404). If running on Vercel, verify that serverless functions are active and GEMINI_API_KEY is configured in Vercel project environment variables.';
          } else if (response.status === 503) {
            errorMsg = 'Gemini API key is not configured on the server (503). Please set GEMINI_API_KEY in your environment or Vercel settings.';
          } else if (response.status === 413) {
            errorMsg = 'Image file size is too large to process. Please try a smaller photo.';
          } else {
            errorMsg = `Server returned error (${response.status}). Please try again or test with a sample plant.`;
          }
        }
        throw new Error(errorMsg);
      }

      const result = await response.json();
      if (!result.data || !result.data.commonName) {
        throw new Error('Could not identify plant clearly. Please try another angle or closer shot.');
      }

      onScanComplete(result.data, imageBase64, result.modelUsed);
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error('Scan error:', err);
      setErrorMessage(err.message || 'Plant analysis failed. Please try again with a clear photo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Snap photo from webcam and resize
  const capturePhoto = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const rawDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    stopCamera();

    const resizedUrl = await resizeImage(rawDataUrl, 1024, 0.8);
    processImage(resizedUrl);
  };

  // Handle file drop & select and resize
  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }
    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const rawResult = e.target?.result as string;
      const resized = await resizeImage(rawResult, 1024, 0.8);
      processImage(resized);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 px-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200/60 rounded-full text-emerald-800 text-[11px] sm:text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Multimodal Plant Vision Engine · Gemini Vision</span>
        </div>
        <h1 className="font-serif-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 text-balance">
          Identify Any Plant & Master Its Daily Care
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-stone-600 max-w-2xl mx-auto text-balance">
          Snap a photo of your houseplant, garden flora, or troubled leaf directly from your phone or desktop. Our botanical AI instantly diagnoses species, detects ailments, and creates custom care schedules.
        </p>
      </div>

      {/* Main Upload / Camera Card */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {/* Card Header & Mode Switch */}
        <div className="p-4 sm:p-6 border-b border-stone-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-stone-50/50">
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-stone-900">Upload or Snap Photo</h2>
            <p className="text-[11px] sm:text-xs text-stone-500">Phone Camera, Photo Gallery, or Web Upload (JPEG, PNG, WEBP)</p>
          </div>

          {/* Analysis focus toggle */}
          <div className="flex items-center p-1 bg-stone-200/70 rounded-lg text-xs font-medium w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setAnalysisMode('general')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md transition-colors whitespace-nowrap text-center ${
                analysisMode === 'general'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Full Identification
            </button>
            <button
              type="button"
              onClick={() => setAnalysisMode('health')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md transition-colors whitespace-nowrap text-center ${
                analysisMode === 'health'
                  ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Leaf Health Focus
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
          {/* Live Camera View */}
          {isCameraActive ? (
            <div className="relative rounded-xl overflow-hidden bg-black aspect-4/3 flex items-center justify-center">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={stopCamera}
                className="absolute top-4 right-4 p-2.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Close camera"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-6 left-0 right-0 flex justify-center px-4">
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="w-full sm:w-auto px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-full shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform min-h-[48px]"
                >
                  <Camera className="w-5 h-5" />
                  <span>Snap Photo & Analyze</span>
                </button>
              </div>
            </div>
          ) : (
            /* Upload Dropzone */
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => !isLoading && fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-6 sm:p-12 text-center transition-all cursor-pointer ${
                dragActive
                  ? 'border-emerald-600 bg-emerald-50/50 scale-[0.99]'
                  : 'border-stone-300 hover:border-emerald-600 hover:bg-stone-50/80 bg-stone-50/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />

              {isLoading ? (
                <div className="py-6 space-y-5">
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="w-16 h-16 rounded-full border-4 border-emerald-200 border-t-emerald-700 animate-spin" />
                    <Sparkles className="w-6 h-6 text-emerald-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <div className="space-y-1.5 px-2">
                    <p className="text-sm font-semibold text-stone-900">
                      {loadingSteps[loadingStep]}
                    </p>
                    <p className="text-xs text-stone-500 font-mono-nums">
                      Step {loadingStep + 1} of {loadingSteps.length} · Processing botanical photo
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-full bg-emerald-100/80 flex items-center justify-center text-emerald-800 shadow-xs">
                    <Camera className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-700" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm sm:text-base font-semibold text-stone-800">
                      Snap photo with your camera or browse files
                    </p>
                    <p className="text-[11px] sm:text-xs text-stone-500">
                      Frame clear leaves, blooms, or the whole pot in bright daylight
                    </p>
                  </div>

                  {/* Primary Touch Actions */}
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        startCamera();
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-all shadow-sm active:scale-95 min-h-[46px]"
                    >
                      <Camera className="w-4 h-4 text-emerald-300" />
                      <span>Take Photo (Camera)</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded-xl transition-all shadow-2xs active:scale-95 min-h-[46px]"
                    >
                      <Upload className="w-4 h-4 text-stone-600" />
                      <span>Upload Photo File</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Optional context notes */}
          <div className="space-y-1.5">
            <label htmlFor="userNotes" className="block text-xs font-medium text-stone-700">
              Optional Context or Symptoms (e.g., &quot;Leaves turning yellow after repotting&quot;)
            </label>
            <div className="relative">
              <input
                id="userNotes"
                type="text"
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                maxLength={380}
                placeholder="Add any observations, room lighting, or watering history..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-colors placeholder:text-stone-400 min-h-[42px]"
              />
            </div>
          </div>

          {/* Error Message Display with intelligent recovery actions */}
          {errorMessage && (
            <div className="p-4 bg-amber-50/95 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-900 text-xs">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-2.5 flex-1">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-stone-900 text-xs sm:text-sm">{errorMessage}</p>
                    <button
                      type="button"
                      onClick={() => setErrorMessage(null)}
                      className="p-1 text-stone-400 hover:text-stone-700 rounded transition-colors shrink-0"
                      title="Dismiss error"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-stone-600 mt-1 leading-relaxed">
                    {errorMessage.toLowerCase().includes('camera') || errorMessage.toLowerCase().includes('permission')
                      ? 'Camera access was blocked by your browser settings. You can grant camera permission in your browser address bar or select one of the recovery actions below:'
                      : errorMessage.includes('404')
                      ? 'The AI identification route was not found (404). If deployed on Vercel, ensure the API route is active and GEMINI_API_KEY is configured in Vercel project environment variables. You can still test immediately with a preset:'
                      : errorMessage.includes('503') || errorMessage.toLowerCase().includes('gemini_api_key')
                      ? 'The Gemini API key is missing or service is unavailable. Please verify your GEMINI_API_KEY. You can still test all plant intelligence features using any preset below:'
                      : 'You can retry uploading, open the camera, or instantly explore with a botanical preset:'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null);
                      onSelectSamplePreset(SAMPLE_PLANTS[0]);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold transition-colors shadow-xs min-h-[38px]"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Try Sample Plant (Instant)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null);
                      startCamera();
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-stone-300 hover:bg-stone-50 rounded-lg font-semibold text-stone-800 transition-colors shadow-2xs min-h-[38px]"
                  >
                    <Camera className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Open Camera</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null);
                      fileInputRef.current?.click();
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-stone-300 hover:bg-stone-50 rounded-lg font-semibold text-stone-800 transition-colors shadow-2xs min-h-[38px]"
                  >
                    <Upload className="w-3.5 h-3.5 text-stone-600" />
                    <span>Upload from Gallery</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instant Sample Plants Playground */}
      <div className="max-w-6xl mx-auto space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between gap-2 border-b border-stone-200 pb-2.5 px-1 sm:px-0">
          <div>
            <h2 className="font-serif-display text-lg sm:text-2xl font-bold text-stone-900">
              Popular Botanical Presets (1-Click Test)
            </h2>
            <p className="text-xs text-stone-600 hidden sm:block">
              Tap any plant to immediately explore full identification, leaf diagnostics, and care parameters
            </p>
          </div>
          <span className="text-[11px] text-stone-500 font-medium whitespace-nowrap bg-stone-100 px-2 py-0.5 rounded">
            Swipe 6 Specimens →
          </span>
        </div>

        <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto pb-3 pt-1 snap-x -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-none">
          {SAMPLE_PLANTS.map((plant) => (
            <div
              key={plant.id}
              onClick={() => onSelectSamplePreset(plant)}
              className="snap-start shrink-0 w-[145px] sm:w-auto group bg-white rounded-xl border border-stone-200 hover:border-emerald-700 hover:shadow-md transition-all cursor-pointer p-2.5 sm:p-3 flex flex-col justify-between select-none active:scale-95"
            >
              <div className="space-y-2">
                <div className="w-full aspect-square rounded-lg overflow-hidden bg-stone-100 flex items-center justify-center transition-transform group-hover:scale-[1.02]">
                  <PlantIllustration badge={plant.svgBadge} className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
                    {plant.name}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-stone-500 italic line-clamp-1">
                    {plant.scientificName}
                  </p>
                </div>
              </div>

              <div className="mt-2.5 pt-1.5 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-500">
                <span className="capitalize">{plant.category}</span>
                <span className="font-semibold text-emerald-700">
                  Inspect →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Value Pillars */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-2">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-800">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-stone-900">Taxonomic Botanical Precision</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Identifies genus, species binomial, and plant family using high-resolution morphological analysis.
          </p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-2">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-800">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-stone-900">Pathology & Symptom Diagnosis</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Detects overwatering edema, chlorosis, scorching, scale, spider mites, or fungal pathogens with organic treatments.
          </p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-2">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-800">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-stone-900">Actionable Care Schedules</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Exact soil mixes, watering interval in days, light window orientation, and pet toxicity alerts.
          </p>
        </div>
      </div>
    </div>
  );
};
