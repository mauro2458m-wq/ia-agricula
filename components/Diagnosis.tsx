import React, { useState, useRef } from 'react';
import { Crop, AnalysisResult } from '../types';
import { analyzeCropImage } from '../services/geminiService';
import { Camera, Upload, AlertTriangle, CheckCircle2, FlaskConical, Sprout, ShieldCheck } from 'lucide-react';

interface DiagnosisProps {
  selectedCrop: Crop | null;
}

export const Diagnosis: React.FC<DiagnosisProps> = ({ selectedCrop }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    if (!selectedCrop) {
      setError("Por favor, selecione uma cultura acima antes de analisar.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await analyzeCropImage(image, selectedCrop.name);
      setResult(data);
    } catch (err) {
      setError("Falha ao analisar a imagem. Verifique sua conexão e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 my-4 mx-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-emerald-800 flex items-center gap-2">
          <Camera className="w-6 h-6" />
          Diagnóstico Visual
        </h2>
        {image && (
          <button onClick={reset} className="text-sm text-gray-500 hover:text-red-500">
            Limpar
          </button>
        )}
      </div>

      {!image ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-emerald-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50 transition-colors h-64"
        >
          <Upload className="w-12 h-12 text-emerald-400 mb-2" />
          <p className="text-emerald-700 font-medium">Toque para tirar foto ou enviar</p>
          <p className="text-emerald-500 text-sm mt-1">Identifique pragas na folha, caule ou fruto</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden max-h-80 bg-gray-100 flex justify-center">
            <img src={image} alt="Upload" className="object-contain h-full w-full" />
          </div>

          {!result && !isLoading && (
            <button
              onClick={handleAnalyze}
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <FlaskConical className="w-5 h-5" />
              Analisar Problema
            </button>
          )}
        </div>
      )}

      {isLoading && (
        <div className="py-8 text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-emerald-700 font-medium animate-pulse">Consultando Agrônomo IA...</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl flex items-start gap-2 border border-red-100">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-emerald-900">{result.pestOrDisease}</h3>
              <span className="px-3 py-1 bg-emerald-200 text-emerald-800 text-xs font-bold rounded-full">
                Confiança: {result.confidence}
              </span>
            </div>
            <p className="text-emerald-800 text-sm leading-relaxed">{result.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
              <h4 className="font-bold text-orange-900 flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4" />
                Tratamento Químico
              </h4>
              <p className="text-sm text-orange-900">{result.treatmentChemical}</p>
            </div>

            <div className="bg-green-50 border border-green-100 p-4 rounded-xl">
              <h4 className="font-bold text-green-900 flex items-center gap-2 mb-2">
                <Sprout className="w-4 h-4" />
                Tratamento Orgânico
              </h4>
              <p className="text-sm text-green-900">{result.treatmentOrganic}</p>
            </div>
          </div>

           <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
              <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4" />
                Prevenção
              </h4>
              <p className="text-sm text-blue-900">{result.prevention}</p>
            </div>

          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800 italic">
            <strong>Aviso:</strong> A Agricultura IA fornece orientações baseadas em imagens. Consulte sempre um engenheiro agrônomo local para receitas agronômicas e dosagens corretas.
          </div>
        </div>
      )}
    </div>
  );
};
