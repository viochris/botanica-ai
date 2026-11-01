import React, { useState } from 'react';
import {
  Calendar,
  Layers,
  HelpCircle,
  Calculator,
  Droplets,
  Sun,
  Thermometer,
  ShieldAlert,
  ArrowRight,
  Sprout,
  CheckCircle2,
} from 'lucide-react';

export const CareGuides: React.FC = () => {
  // Pot Soil Calculator state
  const [potDiameter, setPotDiameter] = useState<number>(8); // in inches
  const [plantType, setPlantType] = useState<'aroid' | 'succulent' | 'tropical' | 'herb'>('aroid');

  // Seasonal Checklist state
  const [activeSeason, setActiveSeason] = useState<'spring' | 'summer' | 'autumn' | 'winter'>('spring');

  // Soil Calculation formulas
  // Approximate cylindrical pot volume in Liters: V = pi * r^2 * h / 1000 where r, h in cm
  const diameterCm = potDiameter * 2.54;
  const radiusCm = diameterCm / 2;
  const heightCm = diameterCm * 0.9; // standard pot aspect ratio
  const volumeLiters = Math.round(((Math.PI * radiusCm * radiusCm * heightCm) / 1000) * 10) / 10;

  const getSoilRecipe = () => {
    switch (plantType) {
      case 'aroid':
        return {
          name: 'Chunky Aroid Blend (Monsteras, Philodendrons, Anthuriums)',
          organic: Math.round(volumeLiters * 0.4 * 10) / 10,
          bark: Math.round(volumeLiters * 0.3 * 10) / 10,
          perlite: Math.round(volumeLiters * 0.2 * 10) / 10,
          castings: Math.round(volumeLiters * 0.1 * 10) / 10,
          notes: 'Provides high oxygen circulation to roots while retaining gentle moisture.',
        };
      case 'succulent':
        return {
          name: 'Gritty Succulent & Cactus Mix (Sansevieria, Aloes, Echeverias)',
          organic: Math.round(volumeLiters * 0.3 * 10) / 10,
          bark: Math.round(volumeLiters * 0.1 * 10) / 10,
          perlite: Math.round(volumeLiters * 0.5 * 10) / 10,
          castings: Math.round(volumeLiters * 0.1 * 10) / 10,
          notes: 'Rapid drainage is paramount; prevents stagnant moisture around delicate taproots.',
        };
      case 'tropical':
        return {
          name: 'Moisture-Balanced Tropical Mix (Peace Lilies, Ferns, Calatheas)',
          organic: Math.round(volumeLiters * 0.55 * 10) / 10,
          bark: Math.round(volumeLiters * 0.15 * 10) / 10,
          perlite: Math.round(volumeLiters * 0.2 * 10) / 10,
          castings: Math.round(volumeLiters * 0.1 * 10) / 10,
          notes: 'Retains even moisture like a wrung-out sponge without choking aeration.',
        };
      case 'herb':
        return {
          name: 'Nutrient-Rich Edible Herb & Vegetable Soil',
          organic: Math.round(volumeLiters * 0.6 * 10) / 10,
          bark: Math.round(volumeLiters * 0.1 * 10) / 10,
          perlite: Math.round(volumeLiters * 0.15 * 10) / 10,
          castings: Math.round(volumeLiters * 0.15 * 10) / 10,
          notes: 'High organic matter and microbial activity to fuel fast edible foliage.',
        };
    }
  };

  const recipe = getSoilRecipe();

  const seasonalRoutines = {
    spring: {
      title: 'Spring Awakening (March – May)',
      tagline: 'Rapid vegetative growth, repotting season, and fertilizer reintroduction',
      items: [
        'Repot root-bound plants into containers 2 inches wider in diameter.',
        'Begin bi-weekly diluted fertilization as new shoots and leaf unfurls appear.',
        'Wipe winter dust off all broad foliage with a damp cloth to maximize solar absorption.',
        'Inspect leaf undersides for emerging pests awakened by warming temperatures.',
      ],
    },
    summer: {
      title: 'Summer Peak (June – August)',
      tagline: 'High transpiration, hydration diligence, and shielding from extreme midday heat',
      items: [
        'Increase watering frequency; test soil moisture every 3 to 4 days during heatwaves.',
        'Move sensitive foliage 2–3 feet back from south-facing windows to avoid leaf sunburn.',
        'Scout regularly for spider mites which multiply rapidly in warm, dry indoor air.',
        'Water early in the morning so roots can hydrate before intense afternoon solar heat.',
      ],
    },
    autumn: {
      title: 'Autumn Transition (September – November)',
      tagline: 'Bringing outdoor specimens inside, slowing fertilizers, and adjusting light',
      items: [
        'Bring outdoor potted plants indoors before nighttime ambient temperatures drop below 12°C (54°F).',
        'Quarantine and hose down returning plants to prevent bringing garden pests into the home.',
        'Taper off nitrogen-heavy fertilizers as growth cycles naturally decelerate.',
        'Reduce watering frequency by approximately 30–40% to match declining daylight hours.',
      ],
    },
    winter: {
      title: 'Winter Dormancy (December – February)',
      tagline: 'Dormancy preservation, artificial light compensation, and humidity defense',
      items: [
        'Allow soil to dry out significantly more between waterings; cold damp soil easily causes root rot.',
        'Keep plants away from direct blasts of forced-air heating vents and cold window drafts.',
        'Run an ultrasonic humidifier to counteract dry indoor winter air (aim for 50%+ humidity).',
        'Rotate plants weekly by 90 degrees to maintain even, upright posture towards dim low sun.',
      ],
    },
  };

  const currentRoutine = seasonalRoutines[activeSeason];

  const troubleshootingGuide = [
    {
      symptom: 'Yellowing lower leaves with soft mushy stems',
      cause: 'Overwatering & hypoxic root suffocation (early root rot)',
      remedy: 'Cease watering immediately. Check container drainage. Prune any brown mushy roots and repot in aerated soil.',
    },
    {
      symptom: 'Drooping foliage with bone-dry, shrunken soil',
      cause: 'Severe underwatering & cell turgor loss',
      remedy: 'Perform bottom-watering: place pot in a basin of lukewarm water for 30 minutes until soil surface is moist.',
    },
    {
      symptom: 'Crisp brown leaf margins and tips',
      cause: 'Dry indoor air (<40% humidity) or fluoride/chlorine sensitivity in tap water',
      remedy: 'Group plants together on a pebble tray, run a humidifier, and use filtered or settled room-temperature water.',
    },
    {
      symptom: 'Long spindly stems with pale small leaves',
      cause: 'Etiolation (insufficient light exposure)',
      remedy: 'Move plant closer to an unobstructed window with bright indirect sunlight or supplement with full-spectrum LED grow lights.',
    },
    {
      symptom: 'Fine silky webbing on leaf undersides with tiny yellow stippling',
      cause: 'Spider mites infestation',
      remedy: 'Wash leaves thoroughly with warm water, spray with cold-pressed organic neem oil or insecticidal soap every 5 days for 3 cycles.',
    },
  ];

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-12">
      {/* Page Title */}
      <div className="border-b border-stone-200 pb-5">
        <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900">
          Master Botanical Guides & Tools
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Horticultural formulas, seasonal schedules, and instant symptom diagnostics
        </p>
      </div>

      {/* Tool 1: Interactive Potting & Soil Calculator */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-stone-100 bg-stone-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-emerald-100 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">Potting Soil & Amendment Calculator</h2>
              <p className="text-xs text-stone-500">Calculate exact substrate volume and amendment recipe for your container</p>
            </div>
          </div>
          <span className="text-xs font-mono-nums bg-emerald-100 text-emerald-900 px-3 py-1 rounded-md font-semibold">
            Estimated Volume: {volumeLiters} Liters
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="md:col-span-5 space-y-5">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Pot Diameter: {potDiameter} inches ({diameterCm.toFixed(1)} cm)
              </label>
              <input
                type="range"
                min="4"
                max="20"
                step="1"
                value={potDiameter}
                onChange={(e) => setPotDiameter(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-800 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-stone-400 font-mono-nums mt-1">
                <span>4&quot; (Small)</span>
                <span>8&quot; (Standard)</span>
                <span>12&quot; (Floor)</span>
                <span>20&quot; (Planter)</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                Plant Family Category
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPlantType('aroid')}
                  className={`p-2.5 rounded-lg border text-left transition-colors ${
                    plantType === 'aroid'
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-semibold'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  Aroid / Monstera
                </button>
                <button
                  type="button"
                  onClick={() => setPlantType('succulent')}
                  className={`p-2.5 rounded-lg border text-left transition-colors ${
                    plantType === 'succulent'
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-semibold'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  Succulent & Cactus
                </button>
                <button
                  type="button"
                  onClick={() => setPlantType('tropical')}
                  className={`p-2.5 rounded-lg border text-left transition-colors ${
                    plantType === 'tropical'
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-semibold'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  Tropical Foliage
                </button>
                <button
                  type="button"
                  onClick={() => setPlantType('herb')}
                  className={`p-2.5 rounded-lg border text-left transition-colors ${
                    plantType === 'herb'
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-semibold'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  Edible Herb / Veg
                </button>
              </div>
            </div>
          </div>

          {/* Substrate Recipe Breakdown */}
          <div className="md:col-span-7 bg-stone-50 p-5 rounded-xl border border-stone-200 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900">{recipe.name}</h3>
              <p className="text-xs text-stone-500 mt-0.5">{recipe.notes}</p>
            </div>

            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-700 font-medium">Quality Organic Potting Soil:</span>
                <span className="font-mono-nums font-bold text-stone-900">{recipe.organic} Liters</span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-800 h-1.5 rounded-full"
                  style={{ width: `${(recipe.organic / volumeLiters) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-stone-700 font-medium">Orchid Bark Fines (Aeration):</span>
                <span className="font-mono-nums font-bold text-stone-900">{recipe.bark} Liters</span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-700 h-1.5 rounded-full"
                  style={{ width: `${(recipe.bark / volumeLiters) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-stone-700 font-medium">Coarse Perlite / Pumice (Drainage):</span>
                <span className="font-mono-nums font-bold text-stone-900">{recipe.perlite} Liters</span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-sky-600 h-1.5 rounded-full"
                  style={{ width: `${(recipe.perlite / volumeLiters) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-stone-700 font-medium">Worm Castings (Slow microbial nutrition):</span>
                <span className="font-mono-nums font-bold text-stone-900">{recipe.castings} Liters</span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-600 h-1.5 rounded-full"
                  style={{ width: `${(recipe.castings / volumeLiters) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tool 2: Seasonal Plant Care Roadmap */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">Seasonal Horticultural Calendar</h2>
              <p className="text-xs text-stone-500">Crucial interventions aligned with annual solar cycles</p>
            </div>
          </div>

          {/* Season Segmented Tabs (Horizontal scroll on mobile) */}
          <div className="flex items-center p-1 bg-stone-100 rounded-xl text-xs font-medium overflow-x-auto w-full sm:w-auto scrollbar-none">
            <button
              onClick={() => setActiveSeason('spring')}
              className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap text-center ${
                activeSeason === 'spring'
                  ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Spring
            </button>
            <button
              onClick={() => setActiveSeason('summer')}
              className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap text-center ${
                activeSeason === 'summer'
                  ? 'bg-white text-amber-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Summer
            </button>
            <button
              onClick={() => setActiveSeason('autumn')}
              className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap text-center ${
                activeSeason === 'autumn'
                  ? 'bg-white text-orange-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Autumn
            </button>
            <button
              onClick={() => setActiveSeason('winter')}
              className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap text-center ${
                activeSeason === 'winter'
                  ? 'bg-white text-sky-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Winter
            </button>
          </div>
        </div>

        {/* Season Content */}
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-stone-900">{currentRoutine.title}</h3>
            <p className="text-xs text-stone-500">{currentRoutine.tagline}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentRoutine.items.map((item, idx) => (
              <div
                key={idx}
                className="p-4 bg-stone-50/70 rounded-xl border border-stone-200/60 flex items-start gap-3"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span className="text-xs text-stone-700 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tool 3: Visual Symptom Troubleshooter */}
      <div className="space-y-4">
        <div>
          <h2 className="font-serif-display text-2xl font-bold text-stone-900">
            Rapid Leaf Symptom Troubleshooter
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Cross-reference leaf irregularities to find the physiological cause and solution
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs divide-y divide-stone-100 overflow-hidden">
          {troubleshootingGuide.map((item, idx) => (
            <div key={idx} className="p-5 sm:p-6 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{item.symptom}</span>
                </h3>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 self-start sm:self-auto">
                  {item.cause}
                </span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed pl-6">
                <span className="font-semibold text-stone-700">Immediate action:</span> {item.remedy}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
