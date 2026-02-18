import React, { useCallback, useRef } from 'react';
import { Upload, Camera, Image as ImageIcon } from 'lucide-react';
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE_MB } from '../constants';

interface UploadAreaProps {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onFileSelect, isAnalyzing }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndPassFile(e.target.files[0]);
    }
  };

  const validateAndPassFile = (file: File) => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, WebP).');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      alert(`File size exceeds ${MAX_IMAGE_SIZE_MB}MB.`);
      return;
    }
    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndPassFile(e.dataTransfer.files[0]);
    }
  };

  const triggerInput = () => {
    inputRef.current?.click();
  };

  return (
    <div 
      className={`w-full max-w-xl mx-auto mb-8 transition-opacity duration-300 ${isAnalyzing ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
    >
      <div 
        className="relative border-2 border-dashed border-emerald-300 rounded-2xl bg-emerald-50 hover:bg-emerald-100 transition-colors duration-200 cursor-pointer p-10 flex flex-col items-center justify-center text-center group"
        onClick={triggerInput}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          ref={inputRef}
          className="hidden" 
          accept={ACCEPTED_IMAGE_TYPES.join(',')}
          onChange={handleFileChange}
        />
        
        <div className="w-16 h-16 bg-emerald-200 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
          <Camera className="w-8 h-8 text-emerald-700" />
        </div>
        
        <h3 className="text-lg font-semibold text-emerald-900 mb-2">
          Upload Leaf Image
        </h3>
        <p className="text-sm text-emerald-600 max-w-xs mx-auto mb-6">
          Drag & drop or tap to select a photo from your gallery or camera.
        </p>
        
        <div className="flex gap-4 text-xs text-emerald-500 font-medium">
            <span className="flex items-center"><ImageIcon className="w-3 h-3 mr-1"/> JPEG</span>
            <span className="flex items-center"><ImageIcon className="w-3 h-3 mr-1"/> PNG</span>
            <span className="flex items-center"><Upload className="w-3 h-3 mr-1"/> Max 10MB</span>
        </div>
      </div>
    </div>
  );
};

export default UploadArea;