/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { PlantScanner } from './components/PlantScanner';
import { PlantResultView } from './components/PlantResultView';
import { BotanistChat } from './components/BotanistChat';
import { MyGarden } from './components/MyGarden';
import { CareGuides } from './components/CareGuides';
import { SAMPLE_PLANTS } from './data/samplePlants';
import { PlantIdentificationData, SavedGardenPlant, SamplePlantPreset, ChatMessage } from './types';
import { Sprout, AlertCircle, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'scan' | 'garden' | 'chat' | 'guides'>('scan');
  const [currentResult, setCurrentResult] = useState<{
    data: PlantIdentificationData;
    photoUrl?: string;
    presetBadge?: string;
    modelUsed?: string;
    isPreset?: boolean;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [storageWarning, setStorageWarning] = useState<string | null>(null);

  // Chat focus context & lifted messages state across tab switches
  const [chatPlantContext, setChatPlantContext] = useState<PlantIdentificationData | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      role: 'model',
      content:
        "Hello, green thumb! I'm **Dr. Flora**, your master horticulturist and botanical companion. Whether you're troubleshooting yellowing foliage, designing an organic potting blend, planning seasonal pruning, or caring for your windowsill collection, I'm here to help. What's growing in your world today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.8-flash',
    },
  ]);

  // User's saved garden collection (persisted to localStorage)
  const [gardenPlants, setGardenPlants] = useState<SavedGardenPlant[]>(() => {
    try {
      const saved = localStorage.getItem('botanica_garden_plants');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load garden plants from localStorage:', e);
    }
    // Seed initial demo collection with 2 popular specimens
    const monstera = SAMPLE_PLANTS[0];
    const snake = SAMPLE_PLANTS[2];
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    const twentyDaysAgo = new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString();

    return [
      {
        id: 'garden-demo-1',
        nickname: 'Living Room Monstera',
        plantData: monstera.data,
        photoType: 'preset',
        dateAdded: new Date().toISOString(),
        lastWatered: threeDaysAgo,
        waterIntervalDays: monstera.data.careInstructions.watering.daysInterval,
        location: 'Living Room East Window',
        notes: 'Produces a new split leaf every 3 weeks.',
      },
      {
        id: 'garden-demo-2',
        nickname: 'Hallway Snake Plant',
        plantData: snake.data,
        photoType: 'preset',
        dateAdded: new Date().toISOString(),
        lastWatered: twentyDaysAgo,
        waterIntervalDays: snake.data.careInstructions.watering.daysInterval,
        location: 'Bedroom Shelf',
        notes: 'Low light corner survivor.',
      },
    ];
  });

  // Save to localStorage on garden changes with visible user warning on failure
  useEffect(() => {
    try {
      localStorage.setItem('botanica_garden_plants', JSON.stringify(gardenPlants));
      setStorageWarning(null);
    } catch (e) {
      console.error('Failed to persist garden plants to localStorage:', e);
      setStorageWarning('Warning: Could not save plant collection to browser storage. Storage quota may be exceeded.');
    }
  }, [gardenPlants]);

  // Handle successful plant identification from scanner
  const handleScanComplete = (data: PlantIdentificationData, photoUrl?: string, modelUsed?: string) => {
    setCurrentResult({
      data,
      photoUrl,
      modelUsed,
      isPreset: false,
    });
    setChatPlantContext(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle selection of a curated sample plant preset
  const handleSelectSamplePreset = (preset: SamplePlantPreset) => {
    setCurrentResult({
      data: preset.data,
      presetBadge: preset.svgBadge,
      isPreset: true,
    });
    setChatPlantContext(preset.data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add plant to "My Garden" collection
  const handleAddToGarden = (plantData: PlantIdentificationData, photoUrl?: string) => {
    const newPlant: SavedGardenPlant = {
      id: `plant-${Date.now()}`,
      nickname: plantData.commonName,
      plantData,
      photoUrl,
      photoType: photoUrl ? 'custom' : 'preset',
      dateAdded: new Date().toISOString(),
      lastWatered: new Date().toISOString(),
      waterIntervalDays: plantData.careInstructions.watering.daysInterval || 7,
      location: 'Indoor Window',
    };

    setGardenPlants((prev) => [newPlant, ...prev]);
  };

  // Mark single plant as watered today
  const handleWaterPlant = (plantId: string) => {
    setGardenPlants((prev) =>
      prev.map((plant) =>
        plant.id === plantId
          ? { ...plant, lastWatered: new Date().toISOString() }
          : plant
      )
    );
  };

  // Mark ONLY plants due or overdue for watering as watered
  const handleWaterAll = () => {
    const now = Date.now();
    setGardenPlants((prev) =>
      prev.map((plant) => {
        const last = new Date(plant.lastWatered).getTime();
        const daysSinceWatered = Math.floor((now - last) / (1000 * 60 * 60 * 24));
        const isDueOrOverdue = (plant.waterIntervalDays - daysSinceWatered) <= 0;
        return isDueOrOverdue
          ? { ...plant, lastWatered: new Date().toISOString() }
          : plant;
      })
    );
  };

  // Remove plant from garden
  const handleRemovePlant = (plantId: string) => {
    setGardenPlants((prev) => prev.filter((p) => p.id !== plantId));
  };

  // View plant details from My Garden
  const handleViewPlantDetails = (plantData: PlantIdentificationData, photoUrl?: string) => {
    setCurrentResult({
      data: plantData,
      photoUrl,
      isPreset: !photoUrl,
    });
    setChatPlantContext(plantData);
    setActiveTab('scan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Jump directly to Botanist Chat with current plant context
  const handleAskBotanist = (plantData: PlantIdentificationData) => {
    setChatPlantContext(plantData);
    setActiveTab('chat');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick Action in Top Nav
  const handleQuickScanClick = () => {
    setCurrentResult(null);
    setActiveTab('scan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf9] text-stone-900 font-sans-body">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        gardenCount={gardenPlants.length}
        onQuickScanClick={handleQuickScanClick}
      />

      {/* Visible LocalStorage warning banner if persistence fails */}
      {storageWarning && (
        <div className="bg-rose-50 border-b border-rose-200 px-4 py-2.5 text-xs text-rose-900 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-medium">{storageWarning}</span>
            <button
              onClick={() => setStorageWarning(null)}
              className="ml-auto p-1 text-rose-600 hover:text-rose-900"
              title="Dismiss warning"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Viewport with mobile thumb padding */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-10 pb-24 md:pb-12">
        {/* Tab 1: Plant Scanner & Care Result View */}
        {activeTab === 'scan' && (
          <div>
            {currentResult ? (
              <PlantResultView
                plantData={currentResult.data}
                photoUrl={currentResult.photoUrl}
                presetBadge={currentResult.presetBadge}
                modelUsed={currentResult.modelUsed}
                isPreset={currentResult.isPreset}
                onAddToGarden={handleAddToGarden}
                onAskBotanist={handleAskBotanist}
                onScanAnother={() => setCurrentResult(null)}
                isAlreadySaved={gardenPlants.some(
                  (p) => p.plantData.commonName === currentResult.data.commonName
                )}
              />
            ) : (
              <PlantScanner
                onScanComplete={handleScanComplete}
                onSelectSamplePreset={handleSelectSamplePreset}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
              />
            )}
          </div>
        )}

        {/* Tab 2: My Garden & Watering Tracker */}
        {activeTab === 'garden' && (
          <MyGarden
            plants={gardenPlants}
            onWaterPlant={handleWaterPlant}
            onWaterAll={handleWaterAll}
            onRemovePlant={handleRemovePlant}
            onViewPlantDetails={handleViewPlantDetails}
            onAddNewScan={() => {
              setCurrentResult(null);
              setActiveTab('scan');
            }}
          />
        )}

        {/* Tab 3: Multi-turn Botanist Chat ("Dr. Flora") with persistent messages state */}
        {activeTab === 'chat' && (
          <BotanistChat
            messages={chatMessages}
            setMessages={setChatMessages}
            currentPlantContext={chatPlantContext}
            onClearPlantContext={() => setChatPlantContext(null)}
          />
        )}

        {/* Tab 4: Care Guides & Potting Calculator */}
        {activeTab === 'guides' && <CareGuides />}
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-stone-200 bg-white py-8 mt-auto text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-700" />
            <span className="font-serif-display font-bold text-stone-800">Botanica AI</span>
            <span aria-hidden="true">·</span>
            <span>Scientific plant identification & domestic horticulture companion</span>
          </div>

          <div className="flex items-center gap-4 text-stone-600">
            <span>Powered by Gemini</span>
            <span aria-hidden="true">·</span>
            <span>AI-generated guidance</span>
            <span aria-hidden="true">·</span>
            <a
              href="https://github.com/viochris/botanica-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-700 hover:text-emerald-700 underline underline-offset-2 transition-colors font-medium"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar (Thumb Zone) */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        gardenCount={gardenPlants.length}
      />
    </div>
  );
}
