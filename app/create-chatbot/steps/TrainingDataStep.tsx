"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Upload, 
  File, 
  Link, 
  FileText, 
  X, 
  Plus,
  Check,
  AlertCircle,
  Database,
  Globe,
  Type
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TrainingDataStepProps {
  config: any;
  updateConfig: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function TrainingDataStep({
  config,
  updateConfig,
  onNext,
  onPrev,
  isFirstStep,
  isLastStep,
}: TrainingDataStepProps) {
  const [dragOver, setDragOver] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files);
    const updatedFiles = [...config.trainingData.documents, ...newFiles];
    
    updateConfig({
      trainingData: {
        ...config.trainingData,
        documents: updatedFiles,
      },
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    const updatedFiles = config.trainingData.documents.filter((_: any, i: number) => i !== index);
    updateConfig({
      trainingData: {
        ...config.trainingData,
        documents: updatedFiles,
      },
    });
  };

  const addUrl = () => {
    if (newUrl.trim()) {
      const updatedUrls = [...config.trainingData.urls, newUrl.trim()];
      updateConfig({
        trainingData: {
          ...config.trainingData,
          urls: updatedUrls,
        },
      });
      setNewUrl("");
    }
  };

  const removeUrl = (index: number) => {
    const updatedUrls = config.trainingData.urls.filter((_: any, i: number) => i !== index);
    updateConfig({
      trainingData: {
        ...config.trainingData,
        urls: updatedUrls,
      },
    });
  };

  const updateTextContent = (content: string) => {
    updateConfig({
      trainingData: {
        ...config.trainingData,
        textContent: content,
      },
    });
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <File className="w-5 h-5 text-red-400" />;
      case 'doc':
      case 'docx':
        return <File className="w-5 h-5 text-blue-400" />;
      case 'txt':
        return <FileText className="w-5 h-5 text-green-400" />;
      case 'csv':
        return <Database className="w-5 h-5 text-yellow-400" />;
      default:
        return <File className="w-5 h-5 text-slate-400" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isStepComplete = config.trainingData.documents.length > 0 || 
                        config.trainingData.urls.length > 0 || 
                        config.trainingData.textContent.trim() !== "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-white mb-2">
          Upload Training Data
        </h3>
        <p className="text-slate-400">
          Provide your chatbot with knowledge by uploading documents, URLs, or text content
        </p>
      </div>

      {/* File Upload Section */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-white flex items-center">
          <Upload className="w-5 h-5 mr-2 text-orange-400" />
          Upload Documents
        </h4>
        
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            dragOver ? "border-orange-400 bg-orange-400/10" : "border-white/20 hover:border-white/40"
          )}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
          <p className="text-white mb-2">
            Drag and drop files here, or{" "}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-orange-400 hover:text-orange-300 underline"
            >
              browse files
            </button>
          </p>
          <p className="text-sm text-slate-400">
            Supports PDF, DOC, TXT, CSV files up to 10MB each
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.csv"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
          />
        </div>

        {/* Uploaded Files */}
        {config.trainingData.documents.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-slate-300">Uploaded Files</h5>
            <div className="space-y-2">
              {config.trainingData.documents.map((file: File, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file.name)}
                    <div>
                      <div className="text-sm font-medium text-white">{file.name}</div>
                      <div className="text-xs text-slate-400">{formatFileSize(file.size)}</div>
                    </div>
                  </div>
                  <Button
                    onClick={() => removeFile(index)}
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* URL Section */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-white flex items-center">
          <Globe className="w-5 h-5 mr-2 text-orange-400" />
          Add Website URLs
        </h4>
        
        <div className="flex space-x-2">
          <Input
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-slate-400"
            onKeyPress={(e) => e.key === 'Enter' && addUrl()}
          />
          <Button
            onClick={addUrl}
            disabled={!newUrl.trim()}
            className="bg-orange-600 hover:bg-orange-500 text-white"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Added URLs */}
        {config.trainingData.urls.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-slate-300">Added URLs</h5>
            <div className="space-y-2">
              {config.trainingData.urls.map((url: string, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Link className="w-5 h-5 text-blue-400" />
                    <div className="text-sm text-white truncate">{url}</div>
                  </div>
                  <Button
                    onClick={() => removeUrl(index)}
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Text Content Section */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-white flex items-center">
          <Type className="w-5 h-5 mr-2 text-orange-400" />
          Add Text Content
        </h4>
        
        <Textarea
          value={config.trainingData.textContent}
          onChange={(e) => updateTextContent(e.target.value)}
          placeholder="Enter any text content, FAQs, knowledge base, or instructions for your chatbot..."
          className="min-h-[120px] bg-white/5 border-white/20 text-white placeholder:text-slate-400"
        />
        <p className="text-xs text-slate-400">
          {config.trainingData.textContent.length} characters
        </p>
      </div>

      {/* Summary */}
      <div className="p-4 bg-slate-800/50 rounded-lg">
        <h5 className="text-sm font-medium text-white mb-3">Training Data Summary</h5>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-white">{config.trainingData.documents.length}</div>
            <div className="text-xs text-slate-400">Documents</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">{config.trainingData.urls.length}</div>
            <div className="text-xs text-slate-400">URLs</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">
              {config.trainingData.textContent.length > 0 ? "Yes" : "No"}
            </div>
            <div className="text-xs text-slate-400">Text Content</div>
          </div>
        </div>
      </div>

      {/* Tips */}
        <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
          <h5 className="text-sm font-medium text-orange-400 mb-2">💡 Tips for Better Training</h5>
        <ul className="space-y-1 text-xs text-slate-400">
          <li>• Upload comprehensive documentation and FAQs</li>
          <li>• Include multiple sources for better knowledge coverage</li>
          <li>• Use clear, well-structured content for best results</li>
          <li>• Combine documents, URLs, and text for comprehensive training</li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <div className="flex items-center space-x-2">
          {isStepComplete ? (
            <>
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">Step Complete</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-yellow-400">Add training data to continue</span>
            </>
          )}
        </div>
        
        <Button
          onClick={onNext}
          disabled={!isStepComplete}
          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white"
        >
          Continue to Purpose
        </Button>
      </div>
    </div>
  );
}
