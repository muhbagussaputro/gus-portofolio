'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Video, FileText, Clipboard, Plus, Eye } from 'lucide-react';

interface PreviewFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video' | 'document';
}

interface MultipleFileUploadProps {
  label: string;
  acceptedTypes?: string;
  maxSize?: number; // in MB
  maxFiles?: number;
  onFilesChange: (files: File[]) => void;
  currentFiles?: File[];
  placeholder?: string;
  className?: string;
}

const MultipleFileUpload: React.FC<MultipleFileUploadProps> = ({
  label,
  acceptedTypes = "image/*,video/*",
  maxSize = 10,
  maxFiles = 10,
  onFilesChange,
  currentFiles = [],
  placeholder = "Click to upload, drag files here, or use paste button",
  className = ""
}) => {
  const [selectedFiles, setSelectedFiles] = useState<PreviewFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [showImageModal, setShowImageModal] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Convert current files to preview files on mount
  useEffect(() => {
    if (currentFiles.length > 0) {
      const previews: PreviewFile[] = currentFiles.map((file, index) => ({
        id: `existing-${index}`,
        file,
        preview: URL.createObjectURL(file),
        type: getFileType(file)
      }));
      setSelectedFiles(previews);
    }
  }, []);

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

  const addFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newFiles: PreviewFile[] = [];

    for (const file of fileArray) {
      if (selectedFiles.length + newFiles.length >= maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        break;
      }

      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        continue;
      }

      const fileType = getFileType(file);
      const preview = URL.createObjectURL(file);
      
      newFiles.push({
        id: `${Date.now()}-${Math.random()}`,
        file,
        preview,
        type: fileType
      });
    }

    if (newFiles.length > 0) {
      const updatedFiles = [...selectedFiles, ...newFiles];
      setSelectedFiles(updatedFiles);
      onFilesChange(updatedFiles.map(f => f.file));
      setError('');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      addFiles(files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      addFiles(files);
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

  const handleRemoveFile = (id: string) => {
    const fileToRemove = selectedFiles.find(f => f.id === id);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    
    const updatedFiles = selectedFiles.filter(f => f.id !== id);
    setSelectedFiles(updatedFiles);
    onFilesChange(updatedFiles.map(f => f.file));
    setError('');
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePaste = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      
      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type.startsWith('image/') || type.startsWith('video/')) {
            const blob = await clipboardItem.getType(type);
            const file = new File([blob], `pasted-${Date.now()}.${type.split('/')[1]}`, {
              type
            });
            addFiles([file]);
            return;
          }
        }
      }
    } catch (error) {
      // Fallback to legacy paste event
      console.warn('Modern clipboard API failed, using fallback');
    }
  };

  const handleKeyboardPaste = async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
          addFiles([file]);
          return;
        }
      }
    }
  };

  // Set up paste event listeners
  useEffect(() => {
    window.addEventListener('paste', handleKeyboardPaste);
    return () => {
      window.removeEventListener('paste', handleKeyboardPaste);
    };
  }, [selectedFiles.length]);

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      selectedFiles.forEach(file => {
        URL.revokeObjectURL(file.preview);
      });
    };
  }, []);

  return (
    <>
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center justify-between">
          <label className="block text-white font-medium">{label}</label>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>{selectedFiles.length}/{maxFiles} files</span>
          </div>
        </div>
        
        {/* Upload Area */}
        <div 
          ref={containerRef}
          className={`relative border-2 border-dashed rounded-lg transition-all duration-300 ${
            isDragging 
              ? 'border-indigo-400 bg-indigo-400/10' 
              : 'border-gray-600 hover:border-indigo-500'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes}
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div className="p-6 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                type="button"
                onClick={handleInputClick}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Upload size={20} />
                Choose Files
              </button>
              <button
                type="button"
                onClick={handlePaste}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Clipboard size={20} />
                Paste
              </button>
            </div>
            <p className="text-white font-medium mb-1">
              {placeholder}
            </p>
            <p className="text-gray-400 text-sm">
              Max {maxSize}MB per file • {acceptedTypes.includes('image') ? 'Images' : ''}{acceptedTypes.includes('video') ? ', Videos' : ''}
            </p>
          </div>
        </div>

        {/* File Previews */}
        <AnimatePresence>
          {selectedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {selectedFiles.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group bg-gray-800 rounded-lg p-3"
                >
                  {/* Preview */}
                  <div className="w-full h-24 bg-gray-700 rounded-lg overflow-hidden mb-2 relative">
                    {file.type === 'image' ? (
                      <img 
                        src={file.preview} 
                        alt="Preview"
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => setShowImageModal(file.preview)}
                      />
                    ) : file.type === 'video' ? (
                      <video
                        src={file.preview}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        {getFileIcon(file.type)}
                      </div>
                    )}
                    
                    {/* Overlay buttons */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      {file.type === 'image' && (
                        <button
                          type="button"
                          onClick={() => setShowImageModal(file.preview)}
                          className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors mr-2"
                        >
                          <Eye size={16} className="text-white" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(file.id)}
                        className="p-2 bg-red-600/80 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X size={16} className="text-white" />
                      </button>
                    </div>
                  </div>

                  {/* File Info */}
                  <div className="space-y-1">
                    <p className="text-white text-xs font-medium truncate" title={file.file.name}>
                      {file.file.name}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {formatFileSize(file.file.size)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg p-3"
          >
            {error}
          </motion.div>
        )}
      </div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4"
            onClick={() => setShowImageModal(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={showImageModal}
                alt="Preview"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <button
                onClick={() => setShowImageModal(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MultipleFileUpload;