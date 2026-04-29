import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';
import { extractTextFromFile, detectFileType, ExtractedContent } from '../lib/fileParser';
import { motion, AnimatePresence } from 'motion/react';

interface FileUploaderProps {
  onAnalyze: (content: ExtractedContent, fileName: string) => void;
  isLoading: boolean;
  progress?: { stage: string, percent: number };
}

const SUPPORTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function FileUploader({ onAnalyze, isLoading, progress }: FileUploaderProps) {
  const { t, i18n } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getProgressLabel = () => {
    if (!progress) return "";
    const isAr = i18n.language === 'ar';
    switch (progress.stage) {
      case 'reading': return isAr ? '⏳ جاري قراءة المذكرة...' : '⏳ Reading document...';
      case 'basic_info': return isAr ? '🔍 تحديد التخصص...' : '🔍 Defining specialization...';
      case 'sdg_mapping': return isAr ? '🎯 ربط أهداف التنمية...' : '🎯 Mapping SDGs...';
      case 'detailed_matrix': return isAr ? '📊 استخراج المؤشرات...' : '📊 Extracting indicators...';
      case 'retrying': return isAr ? '🔄 إعادة المحاولة تلقائياً...' : '🔄 Retrying automatically...';
      case 'complete': return isAr ? '✅ اكتمل التحليل' : '✅ Analysis complete';
      default: return isAr ? 'جاري التحليل...' : 'Analyzing...';
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    setError(null);
    
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(i18n.language === 'ar' 
        ? `حجم الملف كبير جداً (${(selectedFile.size / (1024 * 1024)).toFixed(2)} ميجابايت). يرجى تحميل ملف أصغر من 10 ميجابايت.`
        : `File is too large (${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB). Please upload a file smaller than 10MB.`);
      setFile(null);
      return;
    }

    try {
      const type = await detectFileType(selectedFile);
      if (!SUPPORTED_TYPES.includes(type)) {
        setError(i18n.language === 'ar'
          ? `تنسيق ملف غير مدعوم (${type || 'غير معروف'}). يرجى تحميل ملف PDF أو DOCX أو TXT.`
          : `Unsupported file format (${type || 'unknown'}). Please upload a PDF, DOCX, or TXT file.`);
        setFile(null);
        return;
      }
      setFile(selectedFile);
    } catch (err) {
      setError(i18n.language === 'ar'
        ? "تعذر قراءة الملف. قد يكون الملف تالفاً أو لا يمكن الوصول إليه."
        : "Could not read file. The file might be corrupted or inaccessible.");
    }
  }, [i18n.language]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false
  });

  const handleStartAnalysis = async () => {
    if (!file) {
      console.log("No file selected for analysis.");
      return;
    }

    console.log("Starting analysis for file:", file.name);
    try {
      console.log("Extracting text from file...");
      const extracted = await extractTextFromFile(file);
      console.log("Text extraction complete. Text length:", extracted.text.length, "isImagePdf:", extracted.isImagePdf);
      
      if (extracted.text.length < 100 && !extracted.isImagePdf) {
        setError(i18n.language === 'ar'
          ? "محتوى الوثيقة قصير جداً لإجراء تحليل استدامة ذي مغزى."
          : "The document content is too short for a meaningful sustainability analysis.");
        return;
      }
      
      console.log("Calling onAnalyze callback...");
      onAnalyze(extracted, file.name);
    } catch (err) {
      console.error("Error in handleStartAnalysis:", err);
      setError(err instanceof Error ? err.message : (i18n.language === 'ar' ? "فشل استخراج النص من وثيقتك." : "Failed to extract text from your document."));
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div
        {...getRootProps()}
        className={cn(
          "relative group cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300 p-12 text-center",
          isDragActive ? "border-oued-gold bg-oued-gold-50 ring-4 ring-oued-gold/10" : "border-slate-200 hover:border-oued-gold bg-white",
          isLoading && "pointer-events-none opacity-50"
        )}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 text-slate-400 group-hover:text-oued-gold transition-colors">
            {file ? (
              <FileText className="w-8 h-8 text-oued-gold" />
            ) : (
              <Upload className="w-8 h-8" />
            )}
          </div>
          
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-800">
              {file ? file.name : (i18n.language === 'ar' ? "اختر وثيقة البحث" : "Select Research Document")}
            </h3>
            <p className="text-slate-500 text-sm">
              {file 
                ? (i18n.language === 'ar' ? `${(file.size / (1024 * 1024)).toFixed(2)} م.ب • جاهز للتحليل` : `${(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to analyze`)
                : t('uploader.support')}
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col items-center gap-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleStartAnalysis();
          }}
          disabled={!file || isLoading}
          className={cn(
            "relative px-12 py-4 rounded-2xl font-bold text-white transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed disabled:active:scale-100",
            "bg-oued-blue hover:bg-oued-blue-500 shadow-xl shadow-oued-blue/20",
            isLoading && (i18n.language === 'ar' ? "pr-14" : "pl-14")
          )}
        >
          {isLoading && (
            <Loader2 className={cn("absolute w-5 h-5 animate-spin", i18n.language === 'ar' ? "right-6" : "left-6")} />
          )}
          {isLoading ? (i18n.language === 'ar' ? "جاري التحليل..." : "Analyzing...") : (i18n.language === 'ar' ? "بدء تحليل الاستدامة" : "Start Sustainability Analysis")}
        </button>

        {isLoading && (
          <div className="w-full space-y-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                {getProgressLabel()}
              </span>
              <span className="text-[10px] font-black text-oued-blue">
                {progress?.percent}%
              </span>
            </div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"
            >
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress?.percent || 0}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full bg-oued-gold rounded-full relative"
              >
                 <motion.div 
                  animate={{ x: ["0%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-white/30 w-1/4"
                />
              </motion.div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

