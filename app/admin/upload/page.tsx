'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, CheckCircle, AlertCircle, Image, Video, FileText, ArrowLeft } from 'lucide-react';
import Layout from '@/app/(home)/Layout';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/Toast';

interface UploadFile {
  file: File;
  id: string;
  preview?: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
  result?: any;
}

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return Image;
  if (type.startsWith('video/')) return Video;
  return FileText;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function UploadPage() {
  const router = useRouter();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const { showToast } = useToast();

  const createFilePreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        resolve(undefined);
      }
    });
  };

  const addFiles = useCallback(async (fileList: FileList) => {
    const newFiles: UploadFile[] = [];
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const preview = await createFilePreview(file);
      
      newFiles.push({
        file,
        id: Math.random().toString(36).substring(7),
        preview,
        status: 'pending',
        progress: 0,
      });
    }
    
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const uploadSingleFile = async (uploadFile: UploadFile) => {
    const formData = new FormData();
    formData.append('file', uploadFile.file);
    formData.append('alt_text', ''); // You can add form fields for these
    formData.append('caption', '');
    formData.append('tags', '');

    try {
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, status: 'uploading', progress: 0 }
          : f
      ));

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setFiles(prev => prev.map(f => 
          f.id === uploadFile.id 
            ? { ...f, status: 'success', progress: 100, result }
            : f
        ));
        showToast({
          type: 'success',
          title: 'Upload Success',
          message: `${uploadFile.file.name} uploaded successfully`
        });
      } else {
        setFiles(prev => prev.map(f => 
          f.id === uploadFile.id 
            ? { ...f, status: 'error', error: result.error }
            : f
        ));
        showToast({
          type: 'error',
          title: 'Upload Failed',
          message: result.error || `Failed to upload ${uploadFile.file.name}`
        });
      }
    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, status: 'error', error: 'Upload failed' }
          : f
      ));
      showToast({
        type: 'error',
        title: 'Upload Error',
        message: `Failed to upload ${uploadFile.file.name}. Please try again.`
      });
    }
  };

  const uploadAllFiles = () => {
    files.filter(f => f.status === 'pending').forEach(uploadSingleFile);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#030014] py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-400 hover:text-white transition-colors mr-4"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-white">Media Upload</h1>
          </div>

          {/* Upload Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
              isDragOver 
                ? 'border-indigo-400 bg-indigo-500/10' 
                : 'border-gray-600 hover:border-indigo-500/50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Drop files here or click to upload
            </h3>
            <p className="text-gray-400 mb-6">
              Supports images, videos, and documents up to 50MB
            </p>
            <input
              type="file"
              multiple
              accept="image/*,video/*,.pdf"
              onChange={(e) => e.target.files && addFiles(e.target.files)}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 cursor-pointer"
            >
              <Upload size={20} className="mr-2" />
              Choose Files
            </label>
          </motion.div>

          {/* File List */}
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">
                  Files ({files.length})
                </h3>
                <button
                  onClick={uploadAllFiles}
                  disabled={!files.some(f => f.status === 'pending')}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Upload All
                </button>
              </div>

              <div className="space-y-4">
                {files.map((uploadFile) => {
                  const FileIcon = getFileIcon(uploadFile.file.type);
                  
                  return (
                    <div
                      key={uploadFile.id}
                      className="flex items-center p-4 bg-[#0a0a29]/40 border border-indigo-500/10 rounded-lg"
                    >
                      {/* File Preview/Icon */}
                      <div className="flex-shrink-0 mr-4">
                        {uploadFile.preview ? (
                          <img
                            src={uploadFile.preview}
                            alt={uploadFile.file.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center">
                            <FileIcon size={24} className="text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">
                          {uploadFile.file.name}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          {formatFileSize(uploadFile.file.size)} • {uploadFile.file.type}
                        </p>
                        
                        {/* Progress Bar */}
                        {uploadFile.status === 'uploading' && (
                          <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadFile.progress}%` }}
                            />
                          </div>
                        )}
                        
                        {/* Error Message */}
                        {uploadFile.status === 'error' && uploadFile.error && (
                          <p className="text-red-400 text-sm mt-1">{uploadFile.error}</p>
                        )}
                      </div>

                      {/* Status & Actions */}
                      <div className="flex items-center space-x-2">
                        {uploadFile.status === 'pending' && (
                          <button
                            onClick={() => uploadSingleFile(uploadFile)}
                            className="px-3 py-1 bg-indigo-500 text-white text-sm rounded hover:bg-indigo-600 transition-colors"
                          >
                            Upload
                          </button>
                        )}
                        
                        {uploadFile.status === 'success' && (
                          <CheckCircle size={20} className="text-green-400" />
                        )}
                        
                        {uploadFile.status === 'error' && (
                          <AlertCircle size={20} className="text-red-400" />
                        )}
                        
                        <button
                          onClick={() => removeFile(uploadFile.id)}
                          className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}