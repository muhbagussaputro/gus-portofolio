'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, Users, BarChart3, ArrowLeft } from 'lucide-react';
import Layout from '@/app/(home)/Layout';
import { CommunityStat } from '@/types/database';
import { useToast } from '@/components/Toast';

interface CommunityStatForm {
  id?: string;
  label: string;
  value: string;
  icon_name: string;
  description: string;
  sort_order: number;
  is_active: boolean;
}

const initialForm: CommunityStatForm = {
  label: '',
  value: '',
  icon_name: 'Users',
  description: '',
  sort_order: 0,
  is_active: true,
};

const iconOptions = [
  'Users', 'Code', 'Heart', 'Calendar', 'Star', 'Award', 'Target', 'TrendingUp',
  'Globe', 'Zap', 'Shield', 'Coffee', 'Briefcase', 'BookOpen', 'Lightbulb'
];

export default function CommunityStatsAdmin() {
  const [stats, setStats] = useState<CommunityStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CommunityStatForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  // Fetch community stats
  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/community/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data || []);
      } else {
        setError(data.error || 'Failed to fetch community stats');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const validateForm = () => {
    if (!formData.label.trim()) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Label is required'
      });
      return false;
    }
    if (!formData.value.trim()) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Value is required'
      });
      return false;
    }
    if (!formData.icon_name.trim()) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Icon name is required'
      });
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);

    try {
      const url = editingId ? `/api/community/stats/${editingId}` : '/api/community/stats';
      const method = editingId ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        showToast({
          type: 'success',
          title: 'Success',
          message: `Community stat ${editingId ? 'updated' : 'created'} successfully`
        });
        await fetchStats();
        handleCloseModal();
      } else {
        showToast({
          type: 'error',
          title: 'Error',
          message: data.error || 'Failed to save community stat'
        });
        setError(data.error || 'Failed to save community stat');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      showToast({
        type: 'error',
        title: 'Error',
        message: errorMessage
      });
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this community stat?')) return;

    try {
      const response = await fetch(`/api/community/stats/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        showToast({
          type: 'success',
          title: 'Success',
          message: 'Community stat deleted successfully'
        });
        await fetchStats();
      } else {
        showToast({
          type: 'error',
          title: 'Error',
          message: data.error || 'Failed to delete community stat'
        });
        setError(data.error || 'Failed to delete community stat');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      showToast({
        type: 'error',
        title: 'Error',
        message: errorMessage
      });
      setError(errorMessage);
    }
  };

  // Modal handlers
  const handleOpenModal = (stat?: CommunityStat) => {
    if (stat) {
      setEditingId(stat.id);
      setFormData({
        label: stat.label,
        value: stat.value,
        icon_name: stat.icon_name || 'Users',
        description: stat.description || '',
        sort_order: stat.sort_order,
        is_active: stat.is_active,
      });
    } else {
      setEditingId(null);
      setFormData(initialForm);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialForm);
    setError(null);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#030014] flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#030014] py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center">
              <button
                onClick={() => window.history.back()}
                className="mr-4 p-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                  Community Stats
                </h1>
                <p className="text-gray-400 mt-2">Manage community statistics and metrics</p>
              </div>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
            >
              <Plus size={20} className="mr-2" />
              Add Stat
            </button>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6"
            >
              {error}
            </motion.div>
          )}

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className={`p-6 rounded-xl border transition-all duration-300 ${
                  stat.is_active
                    ? 'bg-[#0a0a29]/40 border-indigo-500/10 hover:border-indigo-500/30'
                    : 'bg-gray-800/20 border-gray-600/10'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-3 ${
                      stat.is_active ? 'bg-indigo-500/20 text-indigo-400' : 'bg-gray-600/20 text-gray-500'
                    }`}>
                      <BarChart3 size={24} />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${stat.is_active ? 'text-white' : 'text-gray-400'}`}>
                        {stat.label}
                      </h3>
                      <p className={`text-2xl font-bold ${stat.is_active ? 'text-indigo-400' : 'text-gray-500'}`}>
                        {stat.value}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleOpenModal(stat)}
                      className="p-2 text-gray-400 hover:text-indigo-400 transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(stat.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                {stat.description && (
                  <p className={`text-sm ${stat.is_active ? 'text-gray-300' : 'text-gray-500'}`}>
                    {stat.description}
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className={stat.is_active ? 'text-green-400' : 'text-gray-500'}>
                    {stat.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-gray-500">Order: {stat.sort_order}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {stats.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Users size={64} className="mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Community Stats</h3>
              <p className="text-gray-500 mb-6">Start by adding your first community statistic</p>
              <button
                onClick={() => handleOpenModal()}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
              >
                Add First Stat
              </button>
            </motion.div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0a0a29] border border-indigo-500/20 rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {editingId ? 'Edit Community Stat' : 'Add Community Stat'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Label *
                  </label>
                  <input
                    type="text"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1a1a3a] border border-indigo-500/20 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                    placeholder="e.g., LinkedIn Connections"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Value *
                  </label>
                  <input
                    type="text"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1a1a3a] border border-indigo-500/20 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                    placeholder="e.g., 2,500+"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Icon
                  </label>
                  <select
                    value={formData.icon_name}
                    onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1a1a3a] border border-indigo-500/20 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                  >
                    {iconOptions.map((icon) => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1a1a3a] border border-indigo-500/20 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                    placeholder="Brief description of this statistic"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-[#1a1a3a] border border-indigo-500/20 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.is_active ? 'active' : 'inactive'}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'active' })}
                      className="w-full px-3 py-2 bg-[#1a1a3a] border border-indigo-500/20 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </Layout>
  );
}