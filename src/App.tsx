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
import { PlantIdentificationData, SavedGardenPlant, SamplePlantPreset } from './types';
import { Sprout } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'scan' | 'garden' | 'chat' | 'guides'>('scan');
  const [currentResult, setCurrentResult] = useState<{
    data: PlantIdentificationData;
    photoUrl?: string;
    presetBadge?: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Chat focus context
  const [chatPlantContext, setChatPlantContext] = useState<PlantIdentificationData | null>(null);

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

  // Save to localStorage on garden changes
  useEffect(() => {
    try {
      localStorage.setItem('botanica_garden_plants', JSON.stringify(gardenPlants));
    } catch (e) {
      console.error('Failed to persist garden plants:', e);
    }
  }, [gardenPlants]);

  // Handle successful plant identification from scanner
  const handleScanComplete = (data: PlantIdentificationData, photoUrl?: string) => {
    setCurrentResult({
      data,
      photoUrl,
    });
    setChatPlantContext(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle selection of a curated sample plant preset
  const handleSelectSamplePreset = (preset: SamplePlantPreset) => {
    setCurrentResult({
      data: preset.data,
      presetBadge: preset.svgBadge,
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
      lastWatered: new Date().toISOString(), // watered today upon adding
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

  // Mark all plants due for watering as watered
  const handleWaterAll = () => {
    setGardenPlants((prev) =>
      prev.map((plant) => ({
        ...plant,
        lastWatered: new Date().toISOString(),
      }))
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

        {/* Tab 3: Multi-turn Botanist Chat ("Dr. Flora") */}
        {activeTab === 'chat' && (
          <BotanistChat
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
            <span>Powered by Gemini 4 Argon & Gemini 3.8 Flash</span>
            <span aria-hidden="true">·</span>
            <span>ASPCA Pet Toxicity Standards</span>
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
