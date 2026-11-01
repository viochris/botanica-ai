export interface HealthAssessment {
  status: 'healthy' | 'needs_attention' | 'diseased' | 'pest_infested';
  conditionTitle: string;
  symptoms: string[];
  diagnosis: string;
  treatment: string;
}

export interface SunlightCare {
  level: string;
  hoursPerDay: string;
  idealSpot: string;
  warning?: string;
}

export interface WateringCare {
  frequency: string;
  daysInterval: number;
  soilCheckMethod: string;
  waterQuality?: string;
  seasonalTips?: string;
}

export interface SoilCare {
  type: string;
  drainage: string;
  recommendedMix: string;
  idealPh?: string;
}

export interface TemperatureCare {
  idealRange: string;
  minTemp: string;
  frostTolerant: boolean;
}

export interface HumidityCare {
  level: string;
  percentage: string;
  mistingAdvice: string;
}

export interface FertilizerCare {
  frequency: string;
  npkRatio: string;
  tips: string;
}

export interface RepottingCare {
  repottingInterval: string;
  bestSeason: string;
  pruningTips: string;
}

export interface ToxicityCare {
  toxicToDogs: boolean;
  toxicToCats: boolean;
  toxicToHumans: boolean;
  details: string;
}

export interface CareInstructions {
  sunlight: SunlightCare;
  watering: WateringCare;
  soil: SoilCare;
  temperature: TemperatureCare;
  humidity: HumidityCare;
  fertilizer: FertilizerCare;
  repottingAndPruning: RepottingCare;
  toxicity: ToxicityCare;
}

export interface PlantIdentificationData {
  commonName: string;
  scientificName: string;
  family: string;
  confidence: number;
  summary: string;
  healthAssessment: HealthAssessment;
  careInstructions: CareInstructions;
  funFacts: string[];
  commonPestsAndDiseases: string[];
  propagationMethods: string[];
}

export interface SavedGardenPlant {
  id: string;
  nickname: string;
  plantData: PlantIdentificationData;
  photoUrl?: string;
  photoType: 'custom' | 'preset' | 'svg';
  dateAdded: string;
  lastWatered: string; // ISO date
  waterIntervalDays: number;
  location: string; // e.g., 'Living Room Window', 'Balcony', 'Bedroom'
  notes?: string;
  healthLog?: Array<{
    date: string;
    note: string;
    status: string;
  }>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  modelUsed?: string;
  plantContext?: {
    commonName: string;
    scientificName: string;
  };
}

export interface SamplePlantPreset {
  id: string;
  name: string;
  scientificName: string;
  family: string;
  category: 'Tropical' | 'Succulent' | 'Flowering' | 'Herb' | 'Edible';
  difficulty: 'Easy' | 'Moderate' | 'Advanced';
  tagline: string;
  accentColor: string;
  svgBadge: string;
  data: PlantIdentificationData;
}
