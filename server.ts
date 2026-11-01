import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Increase payload limit for high-resolution plant photos
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Initialize Google GenAI client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for delay in backoff
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// JSON Schema for structured plant identification & care instructions
const plantAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    commonName: {
      type: Type.STRING,
      description: 'The widely accepted common name of the plant.',
    },
    scientificName: {
      type: Type.STRING,
      description: 'The full botanical Latin binomial (Genus species).',
    },
    family: {
      type: Type.STRING,
      description: 'Botanical family name (e.g. Araceae, Fabaceae).',
    },
    confidence: {
      type: Type.NUMBER,
      description: 'Estimated identification confidence score between 1 and 100.',
    },
    summary: {
      type: Type.STRING,
      description: 'A vivid, engaging 2-3 sentence overview of this plant and its native habitat.',
    },
    healthAssessment: {
      type: Type.OBJECT,
      properties: {
        status: {
          type: Type.STRING,
          description: 'Overall health condition: healthy, needs_attention, diseased, or pest_infested.',
        },
        conditionTitle: {
          type: Type.STRING,
          description: 'Short headline summary of observed physical condition.',
        },
        symptoms: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Observable physical symptoms (e.g. leaf tip browning, yellowing lower leaves).',
        },
        diagnosis: {
          type: Type.STRING,
          description: 'Botanical diagnostic rationale explaining what is causing any detected issues or why the plant is healthy.',
        },
        treatment: {
          type: Type.STRING,
          description: 'Actionable remedies, corrections, or immediate interventions to restore or maintain optimal health.',
        },
      },
      required: ['status', 'conditionTitle', 'symptoms', 'diagnosis', 'treatment'],
    },
    careInstructions: {
      type: Type.OBJECT,
      properties: {
        sunlight: {
          type: Type.OBJECT,
          properties: {
            level: { type: Type.STRING, description: 'e.g. "Bright Indirect Light", "Full Sun"' },
            hoursPerDay: { type: Type.STRING, description: 'e.g. "6 to 8 hours daily"' },
            idealSpot: { type: Type.STRING, description: 'Specific location recommendations.' },
            warning: { type: Type.STRING, description: 'Signs of improper light exposure.' },
          },
          required: ['level', 'hoursPerDay', 'idealSpot'],
        },
        watering: {
          type: Type.OBJECT,
          properties: {
            frequency: { type: Type.STRING, description: 'e.g. "Every 7–10 days in Spring/Summer"' },
            daysInterval: { type: Type.NUMBER, description: 'Average recommended interval in days between waterings.' },
            soilCheckMethod: { type: Type.STRING, description: 'How to test soil readiness.' },
            waterQuality: { type: Type.STRING, description: 'Water sensitivity details.' },
            seasonalTips: { type: Type.STRING, description: 'Seasonal adjustments.' },
          },
          required: ['frequency', 'daysInterval', 'soilCheckMethod'],
        },
        soil: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, description: 'Texture and composition type.' },
            drainage: { type: Type.STRING, description: 'Drainage needs.' },
            recommendedMix: { type: Type.STRING, description: 'Specific mix recipe.' },
            idealPh: { type: Type.STRING, description: 'Ideal pH range.' },
          },
          required: ['type', 'drainage', 'recommendedMix'],
        },
        temperature: {
          type: Type.OBJECT,
          properties: {
            idealRange: { type: Type.STRING, description: 'e.g. "18°C - 27°C (65°F - 80°F)"' },
            minTemp: { type: Type.STRING, description: 'Minimum safe temperature.' },
            frostTolerant: { type: Type.BOOLEAN, description: 'True if frost hardy, false otherwise.' },
          },
          required: ['idealRange', 'minTemp', 'frostTolerant'],
        },
        humidity: {
          type: Type.OBJECT,
          properties: {
            level: { type: Type.STRING, description: 'e.g. "High (60%+)" or "Moderate"' },
            percentage: { type: Type.STRING, description: 'e.g. "50% - 70%"' },
            mistingAdvice: { type: Type.STRING, description: 'Practical advice.' },
          },
          required: ['level', 'percentage', 'mistingAdvice'],
        },
        fertilizer: {
          type: Type.OBJECT,
          properties: {
            frequency: { type: Type.STRING, description: 'Application frequency.' },
            npkRatio: { type: Type.STRING, description: 'NPK ratio.' },
            tips: { type: Type.STRING, description: 'Application method and dormant season precautions.' },
          },
          required: ['frequency', 'npkRatio', 'tips'],
        },
        repottingAndPruning: {
          type: Type.OBJECT,
          properties: {
            repottingInterval: { type: Type.STRING, description: 'e.g. "Every 2–3 years"' },
            bestSeason: { type: Type.STRING, description: 'e.g. "Early Spring"' },
            pruningTips: { type: Type.STRING, description: 'How and when to prune.' },
          },
          required: ['repottingInterval', 'bestSeason', 'pruningTips'],
        },
        toxicity: {
          type: Type.OBJECT,
          properties: {
            toxicToDogs: { type: Type.BOOLEAN, description: 'True if toxic or harmful to canines.' },
            toxicToCats: { type: Type.BOOLEAN, description: 'True if toxic or harmful to felines.' },
            toxicToHumans: { type: Type.BOOLEAN, description: 'True if toxic or irritant to humans/children.' },
            details: { type: Type.STRING, description: 'Details regarding toxicity.' },
          },
          required: ['toxicToDogs', 'toxicToCats', 'toxicToHumans', 'details'],
        },
      },
      required: [
        'sunlight',
        'watering',
        'soil',
        'temperature',
        'humidity',
        'fertilizer',
        'repottingAndPruning',
        'toxicity',
      ],
    },
    funFacts: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '2 to 3 fascinating botanical or historical facts about this plant.',
    },
    commonPestsAndDiseases: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Frequent pests or pathogens to look out for.',
    },
    propagationMethods: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Primary methods for propagation.',
    },
  },
  required: [
    'commonName',
    'scientificName',
    'family',
    'confidence',
    'summary',
    'healthAssessment',
    'careInstructions',
    'funFacts',
    'commonPestsAndDiseases',
    'propagationMethods',
  ],
};

// API Route: Plant Identification & Health Analysis
// Features: "Analyze images" using gemini-4-argon with graceful fallback to gemini-3.8-flash and retry logic
app.post('/api/identify', async (req: Request, res: Response): Promise<void> => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', userNotes = '' } = req.body;

    if (!imageBase64) {
      res.status(400).json({ error: 'Image data is required.' });
      return;
    }

    // Clean base64 string
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const imagePart = {
      inlineData: {
        mimeType: mimeType || 'image/jpeg',
        data: cleanBase64,
      },
    };

    const promptText = `
You are a world-leading Master Botanist, Plant Pathologist, and Horticultural Scientist.
Carefully examine the provided photograph of the plant, including leaf shape, venation, stem structure, variegation, flowers, petioles, soil condition, and visible signs of stress or pests.
User note or context: "${userNotes || 'General identification and complete care evaluation'}".

Perform:
1. Precise botanical identification (Common Name, Latin Scientific Name, Botanical Family, and realistic confidence score 1-100%).
2. Thorough plant health assessment: Check for chlorosis, necrosis, tip burn, pest webbing, edema, fungus, or confirm if the plant is in excellent vigorous health.
3. Complete, actionable, and scientific care instructions covering:
   - Sunlight and window placement
   - Watering schedule with interval days and soil check techniques
   - Soil composition mix and drainage
   - Temperature and humidity tolerances
   - Fertilization schedule and NPK balance
   - Repotting and pruning guidelines
   - Pet and human toxicity details (Cats, Dogs, Humans)
4. Fascinating botanical trivia, common pests, and propagation tips.

Always return valid JSON adhering strictly to the response schema.
`.trim();

    const textPart = { text: promptText };

    // Try models in cascade: gemini-3.1-flash-lite (reliable on free tier) -> gemini-3.8-flash -> gemini-4-argon
    const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-4-argon'];
    let lastError: any = null;
    let response: any = null;
    let modelUsed = '';

    for (const model of modelsToTry) {
      try {
        response = await ai.models.generateContent({
          model,
          contents: { parts: [imagePart, textPart] },
          config: {
            responseMimeType: 'application/json',
            responseSchema: plantAnalysisSchema,
            systemInstruction: 'You are an authoritative botanical expert and horticulturist.',
          },
        });
        modelUsed = model;
        break;
      } catch (err: any) {
        lastError = err;
        // Quiet fallback to avoid noisy platform logs on free tier rate limits
      }
    }

    if (!response) {
      throw lastError || new Error('All model attempts failed to process image.');
    }

    const rawJson = (response.text ?? '{}').trim();
    const parsedData = JSON.parse(rawJson);

    res.json({
      success: true,
      data: parsedData,
      modelUsed,
    });
  } catch (error: any) {
    console.error('Error during plant identification:', error);
    res.status(500).json({
      error: error?.message || 'Failed to analyze plant photo. Please check your image and try again.',
    });
  }
});

// API Route: Multi-turn Chatbot ("Dr. Flora")
// Features: Maintains conversation history, scrollable thread, specific role, model routing:
// - gemini-4-argon for complex tasks
// - gemini-3.8-flash for general tasks
// - gemini-3.1-flash-lite for fast tasks
app.post('/api/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      messages = [],
      model = 'gemini-3.8-flash',
      plantContext = null,
      taskComplexity = 'general',
    } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Messages array is required.' });
      return;
    }

    // Determine target model based on user selection or complexity
    let targetModel = model;
    if (taskComplexity === 'complex') {
      targetModel = 'gemini-4-argon';
    } else if (taskComplexity === 'fast') {
      targetModel = 'gemini-3.1-flash-lite';
    } else if (!targetModel) {
      targetModel = 'gemini-3.8-flash';
    }

    let systemInstruction = `
You are Dr. Flora, a friendly, distinguished botanist, master horticulturist, and passionate gardening mentor.
Your role is to guide plant lovers of all experience levels—from windowsill beginners to master gardeners.
Your tone is warm, encouraging, scientifically grounded, and delightfully engaging.
Key principles:
1. Provide practical, clear, step-by-step advice.
2. When answering care questions, translate scientific concepts into simple home gardening practices.
3. If troubleshooting an ailment, suggest gentle organic treatments first (neem oil, wiping leaves, adjusting watering) before aggressive chemical solutions.
4. Use formatting like bullet points, clear sections, and concise steps so advice is easy to follow while working in the garden.
`.trim();

    if (plantContext) {
      systemInstruction += `\n\nCURRENT FOCUSED PLANT CONTEXT:
Common Name: ${plantContext.commonName || 'Unknown'}
Scientific Name: ${plantContext.scientificName || 'Unknown'}
Family: ${plantContext.family || 'Unknown'}
Health Status: ${plantContext.healthAssessment?.status || 'Unknown'} - ${plantContext.healthAssessment?.conditionTitle || ''}
Diagnosis: ${plantContext.healthAssessment?.diagnosis || 'N/A'}
Always reference this specific plant when answering questions unless the user explicitly shifts to another species.`;
    }

    // Map conversation history to Gemini contents structure
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // Cascade models if target model fails (e.g. 503 high demand or 429 quota)
    const fallbackList = [
      targetModel,
      'gemini-3.1-flash-lite',
      'gemini-3.8-flash',
    ].filter((v, i, a) => a.indexOf(v) === i);

    let response: any = null;
    let actualModel = targetModel;
    let lastError: any = null;

    for (const modelCandidate of fallbackList) {
      try {
        response = await ai.models.generateContent({
          model: modelCandidate,
          contents,
          config: {
            systemInstruction,
          },
        });
        actualModel = modelCandidate;
        break;
      } catch (err: any) {
        lastError = err;
        // Quiet fallback to next candidate
      }
    }

    if (!response) {
      throw lastError || new Error('Chat service temporarily unavailable.');
    }

    const replyText = response.text || 'I apologize, I could not generate a response. Please try asking again.';

    res.json({
      success: true,
      reply: replyText,
      modelUsed: actualModel,
    });
  } catch (error: any) {
    console.error('Error in botanical chat:', error);
    res.status(500).json({
      error: error?.message || 'Chat service encountered an error. Please try again.',
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'Botanica AI Backend', timestamp: new Date().toISOString() });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Botanica AI server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
