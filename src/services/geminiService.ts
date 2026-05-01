import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export async function analyzeSustainabilityDocument(
  text: string, 
  file?: File, 
  onProgress?: (stage: string, percent: number) => void
): Promise<AnalysisResult> {
  const retryLimit = 1;
  let attempt = 0;

  const runAnalysis = async (): Promise<AnalysisResult> => {
    let filePart: any = null;
    
    // Check file size recommendation
    if (file && file.size > 5 * 1024 * 1024) {
      console.warn("File is larger than 5MB. This might cause timeouts.");
    }

    if (file) {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      filePart = { inlineData: { data: base64, mimeType: file.type || "application/pdf" } };
    }

    // Consolidated Prompt for efficiency - sending file once
    const consolidatedPrompt = `Analyze this research/document for sustainability and SDG alignment.
    
    REQUIRED OUTPUT SECTIONS:
    1. Basic Info: specialization, sustainabilityField, overallScore (0-100).
    2. Metrics: Environmental, Social, Economic, Materiality, Scalability (name, score 0-5, description).
    3. SDGs: Identify relevant UN SDGs (1-17). For each: id, label, name, percentage, strength (High/Medium/Low), justification (detailed), and specific target IDs (e.g. "4.1").
    4. Targets & Indicators: For each identified SDG, provide a list of targets with their description and list of UN official indicators (id, description) and a detailed assessment (measuresDirectly: bool, suggestsSolutions: bool, collectsData: bool, contributionScore: 0-5, notes: string explaining why).
    5. Benchmarks: 3-5 global industry benchmarks (name, score, benchmark, description, notes: why this benchmark).
    6. Pillars: ESG/Pillar scores (name, score, comment, notes: academic observation).
    7. SWOT: strengths, opportunities.
    8. Suggestions: List of suggestions (category, gap, suggestion, priority, notes: how to apply).
    9. Recommendations: otherTargets, futureIndicators, complementarySpecializations.

    Language: Result must be in Arabic (العربية).
    Context: ${text.substring(0, 5000)}
    `;

    // Simulate progress milestones as requested
    onProgress?.('reading', 10);
    
    let simulatedPercent = 10;
    const progressInterval = setInterval(() => {
      if (simulatedPercent < 80) {
        if (simulatedPercent < 30) {
          simulatedPercent += 2;
          if (simulatedPercent >= 30) onProgress?.('basic_info', 30);
          else onProgress?.('reading', simulatedPercent);
        } else if (simulatedPercent < 60) {
          simulatedPercent += 3;
          if (simulatedPercent >= 60) onProgress?.('sdg_mapping', 60);
          else onProgress?.('basic_info', simulatedPercent);
        } else if (simulatedPercent < 80) {
          simulatedPercent += 2;
          if (simulatedPercent >= 80) onProgress?.('detailed_matrix', 80);
          else onProgress?.('sdg_mapping', simulatedPercent);
        }
      }
    }, 1500);

    try {
      const result = await callGemini(consolidatedPrompt, filePart, {
        type: Type.OBJECT,
        required: ["specialization", "sustainabilityField", "overallScore", "metrics", "sdgs", "benchmarks", "pillars", "strengths", "opportunities", "suggestions", "recommendations"],
        properties: {
          specialization: { type: Type.STRING },
          sustainabilityField: { type: Type.STRING },
          overallScore: { type: Type.NUMBER },
          metrics: { type: Type.ARRAY, items: { type: Type.OBJECT, required: ["name", "score", "description"], properties: { name: { type: Type.STRING }, score: { type: Type.NUMBER }, description: { type: Type.STRING } } } },
          sdgs: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT, 
              required: ["id", "label", "name", "percentage", "strength", "justification", "targets"], 
              properties: { 
                id: { type: Type.NUMBER }, 
                label: { type: Type.STRING }, 
                name: { type: Type.STRING }, 
                percentage: { type: Type.NUMBER }, 
                strength: { type: Type.STRING }, 
                justification: { type: Type.STRING },
                targets: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["id", "description", "indicators"],
                    properties: {
                      id: { type: Type.STRING },
                      description: { type: Type.STRING },
                      indicators: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          required: ["id", "description", "assessment"],
                          properties: {
                            id: { type: Type.STRING },
                            description: { type: Type.STRING },
                            assessment: { type: Type.OBJECT, required: ["measuresDirectly", "suggestsSolutions", "collectsData", "contributionScore", "notes"], properties: { measuresDirectly: { type: Type.BOOLEAN }, suggestsSolutions: { type: Type.BOOLEAN }, collectsData: { type: Type.BOOLEAN }, contributionScore: { type: Type.NUMBER }, notes: { type: Type.STRING } } }
                          }
                        }
                      }
                    }
                  }
                }
              } 
            } 
          },
          benchmarks: { type: Type.ARRAY, items: { type: Type.OBJECT, required: ["name", "score", "benchmark", "description", "notes"], properties: { name: { type: Type.STRING }, score: { type: Type.NUMBER }, benchmark: { type: Type.NUMBER }, description: { type: Type.STRING }, notes: { type: Type.STRING } } } },
          pillars: { type: Type.ARRAY, items: { type: Type.OBJECT, required: ["name", "score", "comment", "notes"], properties: { name: { type: Type.STRING }, score: { type: Type.NUMBER }, comment: { type: Type.STRING }, notes: { type: Type.STRING } } } },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestions: { type: Type.ARRAY, items: { type: Type.OBJECT, required: ["category", "gap", "suggestion", "priority", "notes"], properties: { category: { type: Type.STRING }, gap: { type: Type.STRING }, suggestion: { type: Type.STRING }, priority: { type: Type.STRING }, notes: { type: Type.STRING } } } },
          recommendations: { type: Type.OBJECT, required: ["otherTargets", "futureIndicators", "complementarySpecializations"], properties: { otherTargets: { type: Type.ARRAY, items: { type: Type.STRING } }, futureIndicators: { type: Type.ARRAY, items: { type: Type.STRING } }, complementarySpecializations: { type: Type.ARRAY, items: { type: Type.STRING } } } }
        }
      });
      clearInterval(progressInterval);
      onProgress?.('complete', 100);
      return result;
    } catch (error) {
      clearInterval(progressInterval);
      throw error;
    }
  };

  while (attempt <= retryLimit) {
    try {
      return await runAnalysis();
    } catch (err: any) {
      console.error(`Analysis attempt ${attempt} failed:`, err);
      if (attempt === retryLimit) {
        if (err.message?.includes("Timeout") || (file && file.size > 5 * 1024 * 1024)) {
            throw new Error("الملف كبير جداً أو الاستجابة بطيئة. يُنصح بملف أقل من 5 ميغابايت.");
        }
        throw err;
      }
      attempt++;
      onProgress?.('retrying', 0);
      // Wait a bit before retry
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  throw new Error("Analysis failed after retries.");
}

async function callGemini(prompt: string, filePart: any, schema: any): Promise<any> {
    const contents = filePart ? { parts: [filePart, { text: prompt }] } : { parts: [{ text: prompt }] };
    
    // 120 seconds timeout as requested
    const timeout = 120000;
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), timeout);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: contents, // contents already has parts
        config: {
          responseMimeType: "application/json",
          responseSchema: schema
        }
      });

      clearTimeout(timeoutId);
      const textOutput = response.text;
      if (!textOutput) throw new Error("Empty AI output");

      const jsonMatch = textOutput.match(/\{[\s\S]*\}/);
      return JSON.parse(jsonMatch ? jsonMatch[0] : textOutput);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new Error("Timeout: Gemini API took too long to respond (120s).");
      }
      throw err;
    }
}
