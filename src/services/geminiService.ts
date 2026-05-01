import { AnalysisResult } from "../types";

async function callGemini(prompt: string, filePart: any, schema: any): Promise<any> {
  const body: any = {
    model: "gemini-2.0-flash",
    contents: filePart 
      ? { parts: [filePart, { text: prompt }] }
      : { parts: [{ text: prompt }] },
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema
    }
  };

  const response = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message || "API error");
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty AI output");

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return JSON.parse(jsonMatch ? jsonMatch[0] : text);
}

export async function analyzeSustainabilityDocument(
  text: string,
  file?: File,
  onProgress?: (stage: string, percent: number) => void
): Promise<AnalysisResult> {
  const retryLimit = 1;
  let attempt = 0;

  const runAnalysis = async (): Promise<AnalysisResult> => {
    let filePart: any = null;

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
        } else {
          simulatedPercent += 2;
          if (simulatedPercent >= 80) onProgress?.('detailed_matrix', 80);
          else onProgress?.('sdg_mapping', simulatedPercent);
        }
      }
    }, 1500);

    try {
      const result = await callGemini(consolidatedPrompt, filePart, schema);
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
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  throw new Error("Analysis failed after retries.");
}

const schema = {
  type: "OBJECT",
  required: ["specialization","sustainabilityField","overallScore","metrics","sdgs","benchmarks","pillars","strengths","opportunities","suggestions","recommendations"],
  properties: {
    specialization: { type: "STRING" },
    sustainabilityField: { type: "STRING" },
    overallScore: { type: "NUMBER" },
    metrics: { type: "ARRAY", items: { type: "OBJECT", properties: { name: { type: "STRING" }, score: { type: "NUMBER" }, description: { type: "STRING" } } } },
    sdgs: { type: "ARRAY", items: { type: "OBJECT", properties: { id: { type: "NUMBER" }, label: { type: "STRING" }, name: { type: "STRING" }, percentage: { type: "NUMBER" }, strength: { type: "STRING" }, justification: { type: "STRING" }, targets: { type: "ARRAY", items: { type: "OBJECT", properties: { id: { type: "STRING" }, description: { type: "STRING" }, indicators: { type: "ARRAY", items: { type: "OBJECT", properties: { id: { type: "STRING" }, description: { type: "STRING" }, assessment: { type: "OBJECT", properties: { measuresDirectly: { type: "BOOLEAN" }, suggestsSolutions: { type: "BOOLEAN" }, collectsData: { type: "BOOLEAN" }, contributionScore: { type: "NUMBER" }, notes: { type: "STRING" } } } } } } } } } } } },
    benchmarks: { type: "ARRAY", items: { type: "OBJECT", properties: { name: { type: "STRING" }, score: { type: "NUMBER" }, benchmark: { type: "NUMBER" }, description: { type: "STRING" }, notes: { type: "STRING" } } } },
    pillars: { type: "ARRAY", items: { type: "OBJECT", properties: { name: { type: "STRING" }, score: { type: "NUMBER" }, comment: { type: "STRING" }, notes: { type: "STRING" } } } },
    strengths: { type: "ARRAY", items: { type: "STRING" } },
    opportunities: { type: "ARRAY", items: { type: "STRING" } },
    suggestions: { type: "ARRAY", items: { type: "OBJECT", properties: { category: { type: "STRING" }, gap: { type: "STRING" }, suggestion: { type: "STRING" }, priority: { type: "STRING" }, notes: { type: "STRING" } } } },
    recommendations: { type: "OBJECT", properties: { otherTargets: { type: "ARRAY", items: { type: "STRING" } }, futureIndicators: { type: "ARRAY", items: { type: "STRING" } }, complementarySpecializations: { type: "ARRAY", items: { type: "STRING" } } } }
  }
};
