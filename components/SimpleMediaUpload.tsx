'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Video, FileText, Eye, Clipboard } from 'lucide-react';

interface PreviewFile {
  file: File;
  preview: string;
  type: 'image' | 'video' | 'document';
}

interface SimpleMediaUploadProps {
  label: string;
  acceptedTypes?: string;
  maxSize?: number; // in MB
  onFileSelect: (file: File | null) => void;
  currentPreview?: string;
  placeholder?: string;
}

const SimpleMediaUpload: React.FC<SimpleMediaUploadProps> = ({
  label,
  acceptedTypes = "image/*,video/*",
  maxSize = 10,
  onFileSelect,
  currentPreview = '',
  placeholder = "Click to upload or drag file here"
}) => {
  const [selectedFile, setSelectedFile] = useState<PreviewFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [pasteHint, setPasteHint] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getFileIcon = (type: string) => {
    if (type === 'image') return <ImageIcon size={24} className="text-indigo-400" />;
    if (type === 'video') return <Video size={24} className="text-indigo-400" />;
    return <FileText size={24} className="text-indigo-400" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File) => {
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size ${formatFileSize(file.size)} exceeds maximum ${maxSize}MB`;
    }
    return null;
  };

  const getFileType = (file: File): 'image' | 'video' | 'document' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    return 'document';
  };

  const handleFileSelect = (file: File) => {
    setError('');
    
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    const fileType = getFileType(file);
    const preview = URL.createObjectURL(file);
    
    setSelectedFile({
      file,
      preview,
      type: fileType
    });
    
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    if (selectedFile) {
      URL.revokeObjectURL(selectedFile.preview);
    }
    setSelectedFile(null);
    onFileSelect(null);
    setError('');
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePasteButton = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      
      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type.startsWith('image/') || type.startsWith('video/')) {
            const blob = await clipboardItem.getType(type);
            const file = new File([blob], `pasted-${Date.now()}.${type.split('/')[1]}`, {
              type
            });
            handleFileSelect(file);
            setPasteHint(false);
            return;
          }
        }
      }
    } catch (error) {
      console.warn('Paste failed:', error);
    }
  };

  const handlePaste = async (e: ClipboardEvent) => {
    // Only handle paste if this component is focused
    if (!containerRef.current?.contains(document.activeElement)) return;

    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      // Check if the item is a file
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) {
          // Check if it's an image or video file
          if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
            handleFileSelect(file);
            setPasteHint(false);
            return;
          }
        }
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    // Only show hint if this component is focused
    if (!containerRef.current?.contains(document.activeElement)) return;
    
    // Show paste hint when Ctrl+V or Cmd+V is pressed
    if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
      setPasteHint(true);
      setTimeout(() => setPasteHint(false), 2000);
    }
  };

  // Set up paste event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Focus on the container to receive paste events
    const handleFocus = () => {
      container.setAttribute('tabindex', '0');
      container.focus();
    };

    const handleBlur = () => {
      container.removeAttribute('tabindex');
    };

    container.addEventListener('click', handleFocus);
    container.addEventListener('keydown', handleKeyDown);
    window.addEventListener('paste', handlePaste);

    return () => {
      container.removeEventListener('click', handleFocus);
      container.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (selectedFile) {
        URL.revokeObjectURL(selectedFile.preview);
      }
    };
  }, [selectedFile]);

  const displayPreview = selectedFile || currentPreview;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-white font-medium mb-2">{label}</label>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Clipboard size={12} />
          <span>Ctrl+V to paste</span>
        </div>
      </div>
      
      {/* Paste Hint */}
      {pasteHint && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center gap-2 px-3 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-lg text-indigo-300"
        >
          <Clipboard size={16} />
          <span className="text-sm">Ready to paste! Press Ctrl+V if you have an image in your clipboard.</span>
        </motion.div>
      )}
      
      {/* Upload Area */}
      <div 
        ref={containerRef}
        className={`relative border-2 border-dashed rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
          isDragging 
            ? 'border-indigo-400 bg-indigo-400/10' 
            : 'border-gray-600 hover:border-indigo-500'
        } ${displayPreview ? 'border-gray-600' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes}
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          className="hidden"
        />
        
        {!displayPreview ? (
          <div className="p-6 text-center">
            <div className="flex flex-col items-center gap-4">
              <Upload size={48} className="text-gray-400" />
              <div className="text-center">
                <p className="text-white font-medium mb-2">
                  {placeholder}
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  Max {maxSize}MB • {acceptedTypes.includes('image') ? 'Images' : ''}{acceptedTypes.includes('video') ? ', Videos' : ''}
                </p>
                <div className="flex items-center gap-3 justify-center">
                  <button
                    type="button"
                    onClick={handleInputClick}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                  >
                    <Upload size={16} />
                    Choose File
                  </button>
                  <span className="text-gray-500">or</span>
                  <button
                    type="button"
                    onClick={handlePasteButton}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    <Clipboard size={16} />
                    Paste
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4">
            {/* Preview */}
            {selectedFile ? (
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                  {selectedFile.type === 'image' ? (
                    <img 
                      src={selectedFile.preview} 
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    getFileIcon(selectedFile.type)
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium truncate">{selectedFile.file.name}</p>
                  <p className="text-gray-400 text-sm">{formatFileSize(selectedFile.file.size)}</p>
                  <p className="text-indigo-400 text-xs">📁 Ready for organized upload</p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            ) : currentPreview && (
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src={currentPreview} 
                    alt="Current"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Current file</p>
                  <p className="text-gray-400 text-sm">Click to replace</p>
                </div>
                <button
                  type="button"
                  onClick={handleInputClick}
                  className="p-2 text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <Upload size={20} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-400 text-sm">{error}</div>
      )}
    </div>
  );
};

export default SimpleMediaUpload;