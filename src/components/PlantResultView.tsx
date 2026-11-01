import React, { useState } from 'react';
import {
  Sun,
  Droplets,
  Sprout,
  Thermometer,
  CloudRain,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  BookmarkPlus,
  MessageSquare,
  Share2,
  ArrowLeft,
  ShieldAlert,
  Scissors,
  Layers,
  HelpCircle,
  Printer,
  Heart,
  Check,
} from 'lucide-react';
import { PlantIdentificationData } from '../types';
import { PlantIllustration } from './PlantIllustration';

interface PlantResultViewProps {
  plantData: PlantIdentificationData;
  photoUrl?: string;
  presetBadge?: string;
  onAddToGarden: (plantData: PlantIdentificationData, photoUrl?: string) => void;
  onAskBotanist: (plantData: PlantIdentificationData) => void;
  onScanAnother: () => void;
  isAlreadySaved?: boolean;
}

export const PlantResultView: React.FC<PlantResultViewProps> = ({
  plantData,
  photoUrl,
  presetBadge,
  onAddToGarden,
  onAskBotanist,
  onScanAnother,
  isAlreadySaved = false,
}) => {
  const [savedSuccess, setSavedSuccess] = useState(isAlreadySaved);
  const [copiedLink, setCopiedLink] = useState(false);

  const { careInstructions, healthAssessment } = plantData;

  const handleSave = () => {
    onAddToGarden(plantData, photoUrl);
    setSavedSuccess(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Botanica AI Care Guide: ${plantData.commonName} (${plantData.scientificName})\nWatering: ${careInstructions.watering.frequency}\nLight: ${careInstructions.sunlight.level}`
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-900',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
          label: 'Healthy & Thriving',
        };
      case 'needs_attention':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-900',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
          label: 'Needs Attention',
        };
      case 'diseased':
      case 'pest_infested':
        return {
          bg: 'bg-rose-50',
          border: 'border-rose-200',
          text: 'text-rose-900',
          icon: <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />,
          label: 'Action Required',
        };
      default:
        return {
          bg: 'bg-stone-50',
          border: 'border-stone-200',
          text: 'text-stone-900',
          icon: <CheckCircle2 className="w-5 h-5 text-stone-600 shrink-0" />,
          label: 'Evaluated',
        };
    }
  };

  const healthStyle = getStatusColor(healthAssessment.status);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto pb-20 md:pb-12">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={onScanAnother}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors py-1.5 self-start min-h-[40px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Scan Another Plant</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleShare}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors shadow-xs min-h-[40px]"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-stone-500" />}
            <span>{copiedLink ? 'Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors shadow-xs min-h-[40px]"
          >
            <Printer className="w-3.5 h-3.5 text-stone-500" />
            <span>Print</span>
          </button>

          <button
            onClick={handleSave}
            disabled={savedSuccess}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors shadow-xs min-h-[40px] ${
              savedSuccess
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-emerald-800 text-white hover:bg-emerald-900 active:scale-95'
            }`}
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved to Garden</span>
              </>
            ) : (
              <>
                <BookmarkPlus className="w-4 h-4" />
                <span>Save to Garden</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Floating Action Bar on Mobile Phones (Thumb Zone above bottom nav) */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 z-30 p-2.5 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-lg flex items-center gap-2 px-3">
        <button
          onClick={handleSave}
          disabled={savedSuccess}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold shadow-xs min-h-[44px] transition-all ${
            savedSuccess
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-emerald-800 text-white hover:bg-emerald-900 active:scale-95'
          }`}
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Saved in Garden</span>
            </>
          ) : (
            <>
              <BookmarkPlus className="w-4 h-4" />
              <span>Save to Garden</span>
            </>
          )}
        </button>

        <button
          onClick={() => onAskBotanist(plantData)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold bg-emerald-100 hover:bg-emerald-200 text-emerald-900 transition-colors shadow-xs min-h-[44px]"
        >
          <MessageSquare className="w-4 h-4 text-emerald-800" />
          <span>Ask Dr. Flora</span>
        </button>
      </div>

      {/* Hero Overview Header */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Left: Plant Visual */}
          <div className="md:col-span-5 bg-stone-100 relative min-h-[260px] md:min-h-full flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-stone-200">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={plantData.commonName}
                className="w-full h-full object-cover max-h-[360px] rounded-xl shadow-xs"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full max-w-[280px] aspect-square">
                <PlantIllustration badge={presetBadge || 'monstera'} className="w-full h-full object-contain" />
              </div>
            )}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-mono-nums font-semibold text-stone-800 border border-stone-200 shadow-xs">
              {plantData.confidence}% match confidence
            </div>
          </div>

          {/* Right: Botanical Taxonomy & Overview */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                <span>Family: {plantData.family}</span>
                <span aria-hidden="true">·</span>
                <span>Plantae</span>
                <span aria-hidden="true">·</span>
                <span>Analyzed by Gemini 4 Argon</span>
              </div>

              <div>
                <h1 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 tracking-tight">
                  {plantData.commonName}
                </h1>
                <p className="text-base sm:text-lg font-serif-display italic text-emerald-800 mt-1">
                  {plantData.scientificName}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pt-1">
                {plantData.summary}
              </p>
            </div>

            {/* Quick action: Chat with Dr. Flora about this plant */}
            <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-stone-50/60 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-4 sm:p-6">
              <div className="flex items-center gap-2.5 text-xs text-stone-600">
                <div className="w-7 h-7 rounded-full bg-emerald-800 text-emerald-100 flex items-center justify-center font-serif-display font-bold">
                  F
                </div>
                <div>
                  <span className="font-semibold text-stone-800">Have questions about this plant?</span>
                  <p className="text-[11px] text-stone-500">Dr. Flora is ready to discuss pruning, soil, or diagnostics.</p>
                </div>
              </div>
              <button
                onClick={() => onAskBotanist(plantData)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors whitespace-nowrap"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-800" />
                <span>Ask Dr. Flora</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Plant Health & Disease Diagnosis Card */}
      <div className={`rounded-2xl border p-6 sm:p-7 ${healthStyle.bg} ${healthStyle.border}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200/50">
          <div className="flex items-center gap-3">
            {healthStyle.icon}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Leaf & Health Diagnostic</span>
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                {healthAssessment.conditionTitle}
              </h2>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-white rounded-md border border-stone-200 shadow-2xs self-start sm:self-auto">
            {healthStyle.label}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
          {/* Symptoms observed */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Observed Symptoms</h3>
            {healthAssessment.symptoms.length > 0 ? (
              <ul className="space-y-1 text-xs text-stone-700">
                {healthAssessment.symptoms.map((symptom, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-1.5 shrink-0" />
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-stone-500">No abnormal lesions, pest traces, or discoloration observed.</p>
            )}
          </div>

          {/* Diagnosis rationale */}
          <div className="space-y-2 md:col-span-1">
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Botanical Diagnosis</h3>
            <p className="text-xs text-stone-700 leading-relaxed">
              {healthAssessment.diagnosis}
            </p>
          </div>

          {/* Actionable treatment */}
          <div className="space-y-2 md:col-span-1">
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">Recommended Treatment</h3>
            <p className="text-xs text-stone-800 leading-relaxed font-medium bg-white/70 p-3 rounded-lg border border-stone-200/60">
              {healthAssessment.treatment}
            </p>
          </div>
        </div>
      </div>

      {/* Comprehensive Care Matrix */}
      <div className="space-y-4">
        <div>
          <h2 className="font-serif-display text-2xl font-bold text-stone-900">
            Complete Care Matrix
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Horticultural parameters optimized for domestic cultivation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* 1. Sunlight */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">01 · Light Exposure</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <Sun className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">{careInstructions.sunlight.level}</h3>
              <p className="text-xs text-emerald-800 font-medium mt-0.5">{careInstructions.sunlight.hoursPerDay}</p>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              <span className="font-semibold text-stone-700">Best placement:</span> {careInstructions.sunlight.idealSpot}
            </p>
            {careInstructions.sunlight.warning && (
              <p className="text-[11px] text-amber-800 bg-amber-50/80 p-2 rounded border border-amber-200/60">
                {careInstructions.sunlight.warning}
              </p>
            )}
          </div>

          {/* 2. Watering */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">02 · Hydration Schedule</span>
              <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
                <Droplets className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">{careInstructions.watering.frequency}</h3>
              <p className="text-xs text-sky-800 font-medium mt-0.5">
                Every ~{careInstructions.watering.daysInterval} days on average
              </p>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              <span className="font-semibold text-stone-700">Moisture check:</span> {careInstructions.watering.soilCheckMethod}
            </p>
            {careInstructions.watering.waterQuality && (
              <p className="text-[11px] text-stone-500">
                {careInstructions.watering.waterQuality}
              </p>
            )}
          </div>

          {/* 3. Soil & Potting */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">03 · Substrate & Drainage</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
                <Sprout className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">{careInstructions.soil.type}</h3>
              {careInstructions.soil.idealPh && (
                <p className="text-xs text-stone-500 font-mono-nums mt-0.5">Target pH: {careInstructions.soil.idealPh}</p>
              )}
            </div>
            <div className="space-y-1.5 text-xs text-stone-600">
              <p><span className="font-semibold text-stone-700">Recipe:</span> {careInstructions.soil.recommendedMix}</p>
              <p className="text-[11px] text-stone-500">{careInstructions.soil.drainage}</p>
            </div>
          </div>

          {/* 4. Temperature */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">04 · Temperature</span>
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                <Thermometer className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">{careInstructions.temperature.idealRange}</h3>
              <p className="text-xs text-stone-500 mt-0.5">Minimum safe temp: {careInstructions.temperature.minTemp}</p>
            </div>
            <div className="text-xs text-stone-600 flex items-center gap-2">
              <span className="font-semibold text-stone-700">Frost hardy:</span>
              <span className={careInstructions.temperature.frostTolerant ? 'text-emerald-700 font-semibold' : 'text-stone-500'}>
                {careInstructions.temperature.frostTolerant ? 'Yes (Can overwinter outside)' : 'No (Bring indoors before frost)'}
              </span>
            </div>
          </div>

          {/* 5. Humidity */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">05 · Humidity</span>
              <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                <CloudRain className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">{careInstructions.humidity.level}</h3>
              <p className="text-xs text-teal-800 font-medium mt-0.5">Ideal: {careInstructions.humidity.percentage}</p>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              {careInstructions.humidity.mistingAdvice}
            </p>
          </div>

          {/* 6. Fertilization */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">06 · Feeding & Nutrients</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">{careInstructions.fertilizer.frequency}</h3>
              <p className="text-xs text-indigo-700 font-mono-nums font-semibold mt-0.5">{careInstructions.fertilizer.npkRatio}</p>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              {careInstructions.fertilizer.tips}
            </p>
          </div>

          {/* 7. Repotting & Pruning */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">07 · Repotting & Pruning</span>
              <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600">
                <Scissors className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">{careInstructions.repottingAndPruning.repottingInterval}</h3>
              <p className="text-xs text-stone-500 mt-0.5">Best timing: {careInstructions.repottingAndPruning.bestSeason}</p>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              {careInstructions.repottingAndPruning.pruningTips}
            </p>
          </div>

          {/* 8. Toxicity & Pet Safety */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-3 shadow-xs lg:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">08 · Toxicity & Safety (ASPCA Standards)</span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-stone-700">Canines (Dogs):</span>
                <span className={careInstructions.toxicity.toxicToDogs ? 'text-rose-700 font-semibold' : 'text-emerald-700 font-semibold'}>
                  {careInstructions.toxicity.toxicToDogs ? '⚠️ Toxic to Dogs' : '✓ Safe for Dogs'}
                </span>
              </div>
              <span className="text-stone-300">·</span>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-stone-700">Felines (Cats):</span>
                <span className={careInstructions.toxicity.toxicToCats ? 'text-rose-700 font-semibold' : 'text-emerald-700 font-semibold'}>
                  {careInstructions.toxicity.toxicToCats ? '⚠️ Toxic to Cats' : '✓ Safe for Cats'}
                </span>
              </div>
              <span className="text-stone-300">·</span>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-stone-700">Humans:</span>
                <span className={careInstructions.toxicity.toxicToHumans ? 'text-amber-700 font-semibold' : 'text-emerald-700 font-semibold'}>
                  {careInstructions.toxicity.toxicToHumans ? 'Mild Irritant / Inedible' : 'Non-toxic'}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {careInstructions.toxicity.details}
            </p>
          </div>
        </div>
      </div>

      {/* Extra Botanical Details: Propagation, Pests & Trivia */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {/* Propagation */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Propagation Methods
          </h3>
          <ul className="space-y-2 text-xs text-stone-700">
            {plantData.propagationMethods.map((method, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span>{method}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pests & Diseases */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Pests & Pathogens to Monitor
          </h3>
          <ul className="space-y-2 text-xs text-stone-700">
            {plantData.commonPestsAndDiseases.map((pest, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span>{pest}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Botanical Trivia */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Botanical Heritage & Trivia
          </h3>
          <ul className="space-y-2 text-xs text-stone-700">
            {plantData.funFacts.map((fact, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
