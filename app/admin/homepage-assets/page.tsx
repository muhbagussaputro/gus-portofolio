'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload,
  Image,
  Video,
  Sparkles,
  Eye,
  EyeOff,
  Save,
  X,
  ExternalLink,
  Clipboard,
  ZoomIn,
  FileText
} from 'lucide-react';
import { HomepageAsset, NewHomepageAsset } from '@/types/database';
import { uploadSingleFile, UploadOptions } from '@/lib/upload-utils';
import { useToast } from '@/components/Toast';

interface HomepageAssetsAdminProps {}

const HomepageAssetsAdmin: React.FC<HomepageAssetsAdminProps> = () => {
  const [assets, setAssets] = useState<HomepageAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<HomepageAsset | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showImageModal, setShowImageModal] = useState<string | null>(null);
  const [pasteTarget, setPasteTarget] = useState<string | null>(null);
  const { showToast } = useToast();

  // Form data
  const [formData, setFormData] = useState({
    asset_type: 'profile_photo',
    title: '',
    description: '',
    file_type: 'image',
    is_active: true,
    sort_order: 0,
    metadata: null as any
  });

  const assetTypes = [
    { value: 'profile_photo', label: 'Foto Profil', icon: Image, color: 'bg-blue-500' },
    { value: 'background_video', label: 'Video Background', icon: Video, color: 'bg-purple-500' },
    { value: 'animation', label: 'Animasi', icon: Sparkles, color: 'bg-pink-500' },
    { value: 'logo', label: 'Logo', icon: Image, color: 'bg-green-500' },
    { value: 'social_media_image', label: 'Gambar Sosial Media', icon: Image, color: 'bg-orange-500' }
  ];

  const fileTypes = [
    { value: 'image', label: 'Gambar' },
    { value: 'video', label: 'Video' },
    { value: 'animation', label: 'Animasi' }
  ];

  // Fetch assets on component mount
  useEffect(() => {
    fetchAssets();
  }, []);

  // Handle keyboard paste when modal is open
  useEffect(() => {
    if (isModalOpen) {
      window.addEventListener('paste', handleKeyboardPaste);
    }
    
    return () => {
      window.removeEventListener('paste', handleKeyboardPaste);
    };
  }, [isModalOpen]);

  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/homepage-assets');
      if (response.ok) {
        const data = await response.json();
        setAssets(data);
      } else {
        console.error('Failed to fetch assets');
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    
    // Auto-detect file type
    if (file.type.startsWith('image/')) {
      setFormData(prev => ({ ...prev, file_type: 'image' }));
    } else if (file.type.startsWith('video/')) {
      setFormData(prev => ({ ...prev, file_type: 'video' }));
    } else {
      setFormData(prev => ({ ...prev, file_type: 'animation' }));
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
            processFile(file);
            return;
          }
        }
      }
    } catch (error) {
      console.warn('Paste failed:', error);
    }
  };

  const handleKeyboardPaste = async (e: ClipboardEvent) => {
    // Only handle paste if we're in the modal and focused on upload area
    if (!isModalOpen) return;
    
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
          processFile(file);
          return;
        }
      }
    }
  };

  const validateForm = () => {
    if (!formData.asset_type.trim()) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Asset type is required'
      });
      return false;
    }
    if (!formData.title.trim()) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Title is required'
      });
      return false;
    }
    if (!formData.file_type) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'File type is required'
      });
      return false;
    }
    if (!editingAsset && !selectedFile) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please select a file to upload'
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      let fileUrl = editingAsset?.file_url || '';

      // Upload new file if selected
      if (selectedFile) {
        // Map form file_type to UploadOptions fileType
        const mapFileType = (fileType: string): 'image' | 'video' | 'document' => {
          switch (fileType) {
            case 'image':
              return 'image';
            case 'video':
              return 'video';
            case 'animation':
            default:
              return 'document';
          }
        };

        const uploadOptions: UploadOptions = {
          category: 'homepage',
          slug: formData.asset_type,
          fileType: mapFileType(formData.file_type),
          index: assets.filter(a => a.asset_type === formData.asset_type).length + 1
        };

        fileUrl = await uploadSingleFile(selectedFile, uploadOptions);
      }

      const assetData: NewHomepageAsset = {
        ...formData,
        file_url: fileUrl,
        mime_type: selectedFile?.type || editingAsset?.mime_type || null,
        file_size: selectedFile?.size || editingAsset?.file_size || null
      };

      const url = editingAsset 
        ? `/api/homepage-assets/${editingAsset.id}`
        : '/api/homepage-assets';
      
      const method = editingAsset ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assetData),
      });

      if (response.ok) {
        showToast({
          type: 'success',
          title: 'Success',
          message: `Asset ${editingAsset ? 'updated' : 'created'} successfully`
        });
        await fetchAssets();
        closeModal();
      } else {
        const errorData = await response.json();
        showToast({
          type: 'error',
          title: 'Error',
          message: errorData.error || 'Failed to save asset'
        });
        console.error('Error saving asset:', errorData);
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Error saving asset. Please try again.'
      });
      console.error('Error saving asset:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (asset: HomepageAsset) => {
    setEditingAsset(asset);
    setFormData({
      asset_type: asset.asset_type,
      title: asset.title,
      description: asset.description || '',
      file_type: asset.file_type,
      is_active: asset.is_active,
      sort_order: asset.sort_order,
      metadata: asset.metadata
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (assetId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus aset ini?')) return;

    try {
      const response = await fetch(`/api/homepage-assets/${assetId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showToast({
          type: 'success',
          title: 'Success',
          message: 'Asset deleted successfully'
        });
        await fetchAssets();
      } else {
        const errorData = await response.json();
        showToast({
          type: 'error',
          title: 'Error',
          message: errorData.error || 'Failed to delete asset'
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Error deleting asset. Please try again.'
      });
      console.error('Error deleting asset:', error);
    }
  };

  const toggleAssetStatus = async (asset: HomepageAsset) => {
    try {
      const response = await fetch(`/api/homepage-assets/${asset.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !asset.is_active }),
      });

      if (response.ok) {
        showToast({
          type: 'success',
          title: 'Success',
          message: `Asset ${!asset.is_active ? 'activated' : 'deactivated'} successfully`
        });
        await fetchAssets();
      } else {
        const errorData = await response.json();
        showToast({
          type: 'error',
          title: 'Error',
          message: errorData.error || 'Failed to update asset status'
        });
        console.error('Error updating asset status:', errorData);
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Error updating asset status. Please try again.'
      });
      console.error('Error updating asset status:', error);
    }
  };

  const openModal = () => {
    setEditingAsset(null);
    setFormData({
      asset_type: 'profile_photo',
      title: '',
      description: '',
      file_type: 'image',
      is_active: true,
      sort_order: assets.length,
      metadata: null
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAsset(null);
    setSelectedFile(null);
  };

  const getAssetTypeInfo = (assetType: string) => {
    return assetTypes.find(type => type.value === assetType) || assetTypes[0];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030014] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-600 bg-clip-text text-transparent">
              Manajemen Aset Homepage
            </h1>
            <p className="text-gray-400 mt-2">
              Kelola foto profil, video background, dan animasi homepage
            </p>
          </div>
          <motion.button
            onClick={openModal}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 
              rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={20} />
            Tambah Aset Baru
          </motion.button>
        </div>

        {/* Assets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => {
            const typeInfo = getAssetTypeInfo(asset.asset_type);
            const Icon = typeInfo.icon;
            
            return (
              <motion.div
                key={asset.id}
                className={`bg-[#0a0a29]/50 rounded-xl p-6 border border-indigo-500/20 
                  hover:border-indigo-500/40 transition-all duration-200`}
                whileHover={{ y: -2 }}
                layout
              >
                {/* Asset Preview */}
                <div className="mb-4">
                  {asset.file_type === 'image' ? (
                    <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-800 group">
                      <img
                        src={asset.file_url}
                        alt={asset.title}
                        className="w-full h-full object-cover cursor-pointer transition-transform group-hover:scale-105"
                        onClick={() => setShowImageModal(asset.file_url)}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <ZoomIn size={24} className="text-white" />
                      </div>
                      <div className="hidden flex items-center justify-center w-full h-full">
                        <Icon size={32} className="text-gray-500" />
                      </div>
                    </div>
                  ) : asset.file_type === 'video' ? (
                    <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-800">
                      <video
                        src={asset.file_url}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden flex items-center justify-center w-full h-full">
                        <Video size={32} className="text-gray-500" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full h-40 rounded-lg bg-gray-800">
                      <Sparkles size={32} className="text-gray-500" />
                    </div>
                  )}
                </div>

                {/* Asset Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs ${typeInfo.color} bg-opacity-20`}>
                      <Icon size={12} />
                      {typeInfo.label}
                    </div>
                    <button
                      onClick={() => toggleAssetStatus(asset)}
                      className={`p-1 rounded-full transition-colors ${
                        asset.is_active 
                          ? 'text-green-400 hover:bg-green-400/10' 
                          : 'text-gray-400 hover:bg-gray-400/10'
                      }`}
                    >
                      {asset.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-white">{asset.title}</h3>
                    {asset.description && (
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                        {asset.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>Tipe: {asset.file_type}</div>
                    <div>Urutan: {asset.sort_order}</div>
                    {asset.file_size && (
                      <div>Ukuran: {Math.round(asset.file_size / 1024)} KB</div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => handleEdit(asset)}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600/20 text-blue-400 
                      rounded-lg hover:bg-blue-600/30 transition-colors text-sm"
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(asset.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-600/20 text-red-400 
                      rounded-lg hover:bg-red-600/30 transition-colors text-sm"
                  >
                    <Trash2 size={14} />
                    Hapus
                  </button>
                  <a
                    href={asset.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1 bg-gray-600/20 text-gray-400 
                      rounded-lg hover:bg-gray-600/30 transition-colors text-sm ml-auto"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {assets.length === 0 && (
          <div className="text-center py-16">
            <Upload size={64} className="mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              Belum ada aset homepage
            </h3>
            <p className="text-gray-500 mb-6">
              Mulai dengan menambahkan foto profil, video background, atau animasi
            </p>
            <button
              onClick={openModal}
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 
                rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-200"
            >
              Tambah Aset Pertama
            </button>
          </div>
        )}
      </div>

      {/* Modal for Add/Edit Asset */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              className="bg-[#0a0a29] rounded-xl p-6 w-full max-w-2xl border border-indigo-500/20 max-h-[90vh] overflow-y-auto my-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {editingAsset ? 'Edit Aset' : 'Tambah Aset Baru'}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center justify-between">
                  <span>{editingAsset ? 'File Baru (opsional)' : 'File *'}</span>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>Ctrl+V to paste</span>
                  </div>
                </label>
                <div 
                  className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/50 hover:border-indigo-500 transition-all duration-300"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  onPaste={(e) => {
                    e.preventDefault();
                    handlePaste();
                  }}
                  tabIndex={0}
                >
                  <input
                    type="file"
                    name="asset_file"
                    accept="image/*,video/*,.json"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                    required={!editingAsset}
                  />
                  {!selectedFile ? (
                    <div className="flex flex-col items-center gap-4">
                      <Upload size={48} className="text-gray-400" />
                      <div className="text-center">
                        <p className="text-white font-medium mb-2">
                          Drop files here or click to browse
                        </p>
                        <p className="text-gray-400 text-sm mb-4">
                          Mendukung gambar, video, dan file animasi (max 10MB)
                        </p>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => document.getElementById('file-upload')?.click()}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                          >
                            Choose File
                          </button>
                          <span className="text-gray-500">or</span>
                          <button
                            type="button"
                            onClick={() => handlePaste()}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                          >
                            <Clipboard size={16} />
                            Paste
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden relative">
                        {selectedFile.type.startsWith('image/') ? (
                          <>
                            <img 
                              src={URL.createObjectURL(selectedFile)} 
                              alt="Preview"
                              className="w-full h-full object-cover rounded-lg cursor-pointer"
                              onClick={() => setShowImageModal(URL.createObjectURL(selectedFile))}
                            />
                            <button
                              type="button"
                              onClick={() => setShowImageModal(URL.createObjectURL(selectedFile))}
                              className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 hover:opacity-100"
                            >
                              <ZoomIn size={20} className="text-white" />
                            </button>
                          </>
                        ) : selectedFile.type.startsWith('video/') ? (
                          <Video size={32} className="text-gray-400" />
                        ) : (
                          <FileText size={32} className="text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium truncate">{selectedFile.name}</p>
                        <p className="text-gray-400 text-sm">{Math.round(selectedFile.size / 1024)} KB</p>
                        <p className="text-indigo-400 text-xs">Ready for upload</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          const input = document.getElementById('file-upload') as HTMLInputElement;
                          if (input) input.value = '';
                        }}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Asset Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Tipe Aset *</label>
                <select
                  value={formData.asset_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, asset_type: e.target.value }))}
                  className="w-full p-3 bg-[#0a0a29] border border-gray-600 rounded-lg focus:border-indigo-500 focus:outline-none"
                  required
                >
                  {assetTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">Judul *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 bg-[#0a0a29] border border-gray-600 rounded-lg focus:border-indigo-500 focus:outline-none"
                  placeholder="Masukkan judul aset..."
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Deskripsi</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 bg-[#0a0a29] border border-gray-600 rounded-lg focus:border-indigo-500 focus:outline-none"
                  placeholder="Deskripsi opsional..."
                  rows={3}
                />
              </div>

              {/* File Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Tipe File *</label>
                <select
                  value={formData.file_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, file_type: e.target.value }))}
                  className="w-full p-3 bg-[#0a0a29] border border-gray-600 rounded-lg focus:border-indigo-500 focus:outline-none"
                  required
                >
                  {fileTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Video Background Settings */}
              {formData.asset_type === 'background_video' && (
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 space-y-4">
                  <h3 className="text-sm font-medium text-purple-400 flex items-center gap-2">
                    <Video size={16} />
                    Pengaturan Video Background
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Interval Rotasi (detik)</label>
                      <input
                        type="number"
                        value={formData.metadata?.rotationInterval || 10}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          metadata: {
                            ...prev.metadata,
                            rotationInterval: parseInt(e.target.value)
                          }
                        }))}
                        className="w-full p-3 bg-[#0a0a29] border border-gray-600 rounded-lg focus:border-indigo-500 focus:outline-none"
                        min="5"
                        max="60"
                        placeholder="10"
                      />
                      <p className="text-xs text-gray-400 mt-1">Durasi setiap video sebelum berganti (5-60 detik)</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Prioritas Video</label>
                      <select
                        value={formData.metadata?.priority || 'normal'}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          metadata: {
                            ...prev.metadata,
                            priority: e.target.value
                          }
                        }))}
                        className="w-full p-3 bg-[#0a0a29] border border-gray-600 rounded-lg focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="low">Rendah</option>
                        <option value="normal">Normal</option>
                        <option value="high">Tinggi</option>
                      </select>
                      <p className="text-xs text-gray-400 mt-1">Video prioritas tinggi akan ditampilkan lebih sering</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.metadata?.enableMobileOptimization || false}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          metadata: {
                            ...prev.metadata,
                            enableMobileOptimization: e.target.checked
                          }
                        }))}
                        className="rounded"
                      />
                      <span className="text-sm">Optimasi Mobile</span>
                    </label>
                    <p className="text-xs text-gray-400 ml-6">Aktifkan untuk mengoptimalkan video di perangkat mobile</p>
                    
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.metadata?.autoplay || true}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          metadata: {
                            ...prev.metadata,
                            autoplay: e.target.checked
                          }
                        }))}
                        className="rounded"
                      />
                      <span className="text-sm">Autoplay</span>
                    </label>
                    
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.metadata?.loop || true}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          metadata: {
                            ...prev.metadata,
                            loop: e.target.checked
                          }
                        }))}
                        className="rounded"
                      />
                      <span className="text-sm">Loop Video</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Urutan</label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) }))}
                    className="w-full p-3 bg-[#0a0a29] border border-gray-600 rounded-lg focus:border-indigo-500 focus:outline-none"
                    min="0"
                  />
                  <p className="text-xs text-gray-400 mt-1">Urutan tampilan (angka kecil = prioritas tinggi)</p>
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Aktif</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2 px-4 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg 
                    hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 transition-all duration-200
                    flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      {editingAsset ? 'Perbarui' : 'Simpan'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4"
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
    </div>
  );
};

export default HomepageAssetsAdmin;