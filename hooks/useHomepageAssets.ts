'use client';

import { useState, useEffect } from 'react';
import { HomepageAsset } from '@/types/database';

interface UseHomepageAssetsReturn {
  assets: HomepageAsset[];
  profilePhotos: HomepageAsset[];
  backgroundVideos: HomepageAsset[];
  animations: HomepageAsset[];
  logos: HomepageAsset[];
  socialMediaImages: HomepageAsset[];
  isLoading: boolean;
  error: string | null;
  refreshAssets: () => Promise<void>;
  getActiveAssetByType: (assetType: string) => HomepageAsset | null;
  getActiveAssetsByType: (assetType: string) => HomepageAsset[];
}

export const useHomepageAssets = (): UseHomepageAssetsReturn => {
  const [assets, setAssets] = useState<HomepageAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/homepage-assets?is_active=true');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch assets: ${response.statusText}`);
      }
      
      const data = await response.json();
      setAssets(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch homepage assets';
      setError(errorMessage);
      console.error('Error fetching homepage assets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  // Filter assets by type
  const profilePhotos = assets.filter(asset => asset.asset_type === 'profile_photo');
  const backgroundVideos = assets.filter(asset => asset.asset_type === 'background_video');
  const animations = assets.filter(asset => asset.asset_type === 'animation');
  const logos = assets.filter(asset => asset.asset_type === 'logo');
  const socialMediaImages = assets.filter(asset => asset.asset_type === 'social_media_image');

  // Get the first active asset of a specific type
  const getActiveAssetByType = (assetType: string): HomepageAsset | null => {
    const filteredAssets = assets.filter(
      asset => asset.asset_type === assetType && asset.is_active
    );
    
    if (filteredAssets.length === 0) return null;
    
    // Return the asset with the lowest sort_order (first in the list)
    return filteredAssets.sort((a, b) => a.sort_order - b.sort_order)[0];
  };

  // Get all active assets of a specific type
  const getActiveAssetsByType = (assetType: string): HomepageAsset[] => {
    return assets
      .filter(asset => asset.asset_type === assetType && asset.is_active)
      .sort((a, b) => a.sort_order - b.sort_order);
  };

  const refreshAssets = async () => {
    await fetchAssets();
  };

  return {
    assets,
    profilePhotos,
    backgroundVideos,
    animations,
    logos,
    socialMediaImages,
    isLoading,
    error,
    refreshAssets,
    getActiveAssetByType,
    getActiveAssetsByType,
  };
};