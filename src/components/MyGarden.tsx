import React, { useState } from 'react';
import {
  Droplets,
  Plus,
  Trash2,
  Calendar,
  Check,
  AlertCircle,
  ExternalLink,
  Search,
  Filter,
  Sparkles,
  MapPin,
  Clock,
} from 'lucide-react';
import { SavedGardenPlant, PlantIdentificationData } from '../types';
import { PlantIllustration } from './PlantIllustration';

interface MyGardenProps {
  plants: SavedGardenPlant[];
  onWaterPlant: (plantId: string) => void;
  onWaterAll: () => void;
  onRemovePlant: (plantId: string) => void;
  onViewPlantDetails: (plantData: PlantIdentificationData, photoUrl?: string) => void;
  onAddNewScan: () => void;
}

export const MyGarden: React.FC<MyGardenProps> = ({
  plants,
  onWaterPlant,
  onWaterAll,
  onRemovePlant,
  onViewPlantDetails,
  onAddNewScan,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'needs_water' | 'healthy'>('all');

  // Calculate watering urgency for a plant
  const getWaterStatus = (plant: SavedGardenPlant) => {
    const last = new Date(plant.lastWatered).getTime();
    const now = Date.now();
    const daysSinceWatered = Math.floor((now - last) / (1000 * 60 * 60 * 24));
    const daysRemaining = plant.waterIntervalDays - daysSinceWatered;

    if (daysRemaining <= 0) {
      return {
        urgent: true,
        label: 'Needs water today!',
        daysText: daysRemaining === 0 ? 'Due today' : `${Math.abs(daysRemaining)}d overdue`,
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        badge: 'Water Due',
      };
    } else if (daysRemaining === 1) {
      return {
        urgent: false,
        label: 'Water tomorrow',
        daysText: 'In 1 day',
        color: 'text-sky-700 bg-sky-50 border-sky-200',
        badge: 'Tomorrow',
      };
    } else {
      return {
        urgent: false,
        label: `Water in ${daysRemaining} days`,
        daysText: `In ${daysRemaining} days`,
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        badge: 'Hydrated',
      };
    }
  };

  const filteredPlants = plants.filter((p) => {
    const matchesSearch =
      p.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.plantData.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.plantData.scientificName.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterMode === 'needs_water') {
      const status = getWaterStatus(p);
      return status.urgent;
    }
    if (filterMode === 'healthy') {
      return p.plantData.healthAssessment.status === 'healthy';
    }
    return true;
  });

  const dueForWaterCount = plants.filter((p) => getWaterStatus(p).urgent).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Garden Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900">
            My Plant Collection & Schedule
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Track hydration intervals, health assessments, and daily care routines
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {dueForWaterCount > 0 && (
            <button
              onClick={onWaterAll}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-sky-900 bg-sky-100 hover:bg-sky-200 rounded-xl transition-colors whitespace-nowrap shadow-xs min-h-[42px]"
            >
              <Droplets className="w-3.5 h-3.5 text-sky-700" />
              <span>Water All Due ({dueForWaterCount})</span>
            </button>
          )}

          <button
            onClick={onAddNewScan}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors whitespace-nowrap shadow-xs min-h-[42px]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Plant</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by plant nickname or species..."
            className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 min-h-[42px]"
          />
        </div>

        {/* Filter Tabs (Horizontal scroll on mobile) */}
        <div className="flex items-center p-1 bg-stone-100 rounded-xl text-xs font-medium overflow-x-auto w-full sm:w-auto scrollbar-none">
          <button
            onClick={() => setFilterMode('all')}
            className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap text-center ${
              filterMode === 'all'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All Plants ({plants.length})
          </button>
          <button
            onClick={() => setFilterMode('needs_water')}
            className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap text-center flex items-center justify-center gap-1.5 ${
              filterMode === 'needs_water'
                ? 'bg-white text-amber-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>Needs Water</span>
            {dueForWaterCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>
          <button
            onClick={() => setFilterMode('healthy')}
            className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap text-center ${
              filterMode === 'healthy'
                ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Thriving
          </button>
        </div>
      </div>

      {/* Plant Grid */}
      {filteredPlants.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <Droplets className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-stone-900">No plants match this view</h3>
            <p className="text-xs text-stone-500">
              {plants.length === 0
                ? "You haven't saved any plants yet. Scan your first plant or pick from our botanical presets!"
                : 'Try adjusting your search terms or filter.'}
            </p>
          </div>
          {plants.length === 0 && (
            <button
              onClick={onAddNewScan}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors shadow-xs"
            >
              Scan a Plant Now
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPlants.map((plant) => {
            const waterStatus = getWaterStatus(plant);

            return (
              <div
                key={plant.id}
                className="bg-white rounded-2xl border border-stone-200 hover:border-emerald-700/60 transition-all shadow-xs overflow-hidden flex flex-col justify-between"
              >
                {/* Plant Card Header */}
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200/60 flex items-center justify-center">
                        {plant.photoUrl ? (
                          <img
                            src={plant.photoUrl}
                            alt={plant.nickname}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <PlantIllustration badge="monstera" className="w-full h-full object-contain" />
                        )}
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-stone-900 line-clamp-1">
                          {plant.nickname}
                        </h2>
                        <p className="text-xs text-stone-500 italic line-clamp-1">
                          {plant.plantData.scientificName}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemovePlant(plant.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                      title="Remove from garden"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Watering Urgency Indicator */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${waterStatus.color}`}>
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 shrink-0" />
                      <div>
                        <p className="font-semibold">{waterStatus.label}</p>
                        <p className="text-[11px] opacity-80">
                          Cycle: Every {plant.waterIntervalDays} days
                        </p>
                      </div>
                    </div>
                    <span className="font-mono-nums font-semibold text-xs">
                      {waterStatus.daysText}
                    </span>
                  </div>

                  {/* Mini Care Specs */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-stone-600 bg-stone-50/70 p-3 rounded-xl">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-stone-400 uppercase font-semibold">Sunlight</span>
                      <p className="font-medium text-stone-800 line-clamp-1">
                        {plant.plantData.careInstructions.sunlight.level}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-stone-400 uppercase font-semibold">Location</span>
                      <p className="font-medium text-stone-800 line-clamp-1">
                        {plant.location || 'Indoor Window'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 bg-stone-50/60 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onViewPlantDetails(plant.plantData, plant.photoUrl)}
                    className="text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-950 transition-colors inline-flex items-center gap-1 min-h-[44px] px-2"
                  >
                    <span>Care Guide</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onWaterPlant(plant.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-sky-900 bg-sky-100 hover:bg-sky-200 rounded-xl transition-all shadow-2xs active:scale-95 min-h-[44px]"
                  >
                    <Check className="w-4 h-4 text-sky-700" />
                    <span>Watered Today</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
