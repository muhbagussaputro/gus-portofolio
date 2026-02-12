'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, Briefcase, Calendar, MapPin, Building2 } from 'lucide-react';
import Layout from '@/app/(home)/Layout';
import { Experience } from '@/types/database';
import SimpleMediaUpload from '@/components/SimpleMediaUpload';
import { uploadSingleFile } from '@/lib/upload-utils';
import { useToast } from '@/components/Toast';

interface ExperienceForm {
  title: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string;
  company_logo_url: string;
  is_current: boolean;
  sort_order: number;
}

const initialForm: ExperienceForm = {
  title: '',
  company: '',
  location: '',
  start_date: '',
  end_date: '',
  description: '',
  company_logo_url: '',
  is_current: false,
  sort_order: 0,
};

export default function ExperienceAdminPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [form, setForm] = useState<ExperienceForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await fetch('/api/about?section=experience');
      const data = await response.json();
      if (data.success) {
        setExperiences(data.data);
      }
    } catch (err) {
      setError('Failed to fetch experience data');
    }
  };



  const validateForm = () => {
    if (!form.title.trim()) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Job title is required'
      });
      return false;
    }
    if (!form.company.trim()) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Company name is required'
      });
      return false;
    }
    if (!form.start_date) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Start date is required'
      });
      return false;
    }
    if (!form.is_current && !form.end_date) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'End date is required when not currently working'
      });
      return false;
    }
    if (form.end_date && form.start_date && new Date(form.end_date) < new Date(form.start_date)) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'End date cannot be earlier than start date'
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
    
    setLoading(true);
    setError('');

    try {
      let logoUrl = form.company_logo_url;
      
      // Upload file if selected
      if (selectedFile) {
        const slug = form.company.toLowerCase().replace(/[^a-z0-9]/g, '-');
        logoUrl = await uploadSingleFile(selectedFile, {
          category: 'experience',
          slug,
          fileType: 'image'
        });
      }

      const url = editingExperience 
        ? `/api/experience/${editingExperience.id}`
        : '/api/experience';
      
      const method = editingExperience ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...form, company_logo_url: logoUrl }),
      });

      const data = await response.json();

      if (data.success) {
        showToast({
          type: 'success',
          title: 'Success',
          message: `Experience ${editingExperience ? 'updated' : 'added'} successfully`
        });
        setShowForm(false);
        setEditingExperience(null);
        setForm(initialForm);
        setSelectedFile(null);
        fetchExperiences();
      } else {
        showToast({
          type: 'error',
          title: 'Error',
          message: data.error || 'Failed to save experience'
        });
        setError(data.error || 'Failed to save experience');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save experience';
      showToast({
        type: 'error',
        title: 'Error',
        message: errorMessage
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    setForm({
      title: experience.title,
      company: experience.company,
      location: experience.location || '',
      start_date: experience.start_date,
      end_date: experience.end_date || '',
      description: experience.description || '',
      company_logo_url: experience.company_logo_url || '',
      is_current: experience.is_current,
      sort_order: experience.sort_order,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience record?')) return;

    try {
      const response = await fetch(`/api/experience/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showToast({
          type: 'success',
          title: 'Success',
          message: 'Experience deleted successfully'
        });
        fetchExperiences();
      } else {
        showToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to delete experience'
        });
        setError('Failed to delete experience');
      }
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete experience'
      });
      setError('Failed to delete experience');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const calculateDuration = (startDate: string, endDate: string | null) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    
    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();
    
    let totalMonths = years * 12 + months;
    if (totalMonths < 0) totalMonths = 0;
    
    const displayYears = Math.floor(totalMonths / 12);
    const displayMonths = totalMonths % 12;
    
    if (displayYears === 0) {
      return `${displayMonths} month${displayMonths !== 1 ? 's' : ''}`;
    } else if (displayMonths === 0) {
      return `${displayYears} year${displayYears !== 1 ? 's' : ''}`;
    } else {
      return `${displayYears} year${displayYears !== 1 ? 's' : ''} ${displayMonths} month${displayMonths !== 1 ? 's' : ''}`;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#030014] py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Experience Management</h1>
              <p className="text-gray-400">Manage your work experience and career history</p>
            </div>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingExperience(null);
                setForm(initialForm);
        setSelectedFile(null);
              }}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
            >
              <Plus size={20} className="mr-2" />
              Add Experience
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Experience List */}
          <div className="space-y-6 mb-8">
            {experiences.map((experience) => (
              <motion.div
                key={experience.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0a0a29]/40 border border-indigo-500/10 rounded-xl p-6 hover:border-indigo-500/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    {/* Logo */}
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      {experience.company_logo_url ? (
                        <img src={experience.company_logo_url} alt={experience.company} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Building2 size={24} className="text-indigo-400" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-white">{experience.title}</h3>
                          <p className="text-indigo-400 font-medium">{experience.company}</p>
                          {experience.location && (
                            <div className="flex items-center text-gray-400 text-sm mt-1">
                              <MapPin size={14} className="mr-1" />
                              <span>{experience.location}</span>
                            </div>
                          )}
                        </div>
                        {experience.is_current && (
                          <span className="px-3 py-1 text-xs bg-green-500/20 text-green-400 rounded-full">
                            Current
                          </span>
                        )}
                      </div>

                      {/* Date & Duration */}
                      <div className="flex items-center text-gray-400 text-sm mb-3">
                        <Calendar size={14} className="mr-2" />
                        <span>
                          {formatDate(experience.start_date)} - {experience.end_date ? formatDate(experience.end_date) : 'Present'}
                          <span className="ml-2 text-indigo-400">
                            • {calculateDuration(experience.start_date, experience.end_date)}
                          </span>
                        </span>
                      </div>

                      {/* Description */}
                      {experience.description && (
                        <p className="text-gray-400 text-sm whitespace-pre-line">{experience.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(experience)}
                      className="p-2 text-gray-400 hover:text-indigo-400 transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(experience.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Form Modal */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#0a0a29] border border-indigo-500/20 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                {/* Form Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700/30">
                  <h2 className="text-2xl font-bold text-white">
                    {editingExperience ? 'Edit Experience' : 'Add Experience'}
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-medium mb-2">Job Title *</label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#1a1a3a] border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                        placeholder="e.g., Senior Full Stack Developer"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Company *</label>
                      <input
                        type="text"
                        value={form.company}
                        onChange={(e) => setForm(prev => ({ ...prev, company: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#1a1a3a] border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                        placeholder="e.g., Tech Startup Inc."
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Location</label>
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-3 bg-[#1a1a3a] border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                      placeholder="e.g., Jakarta, Indonesia • Remote"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-medium mb-2">Start Date *</label>
                      <input
                        type="date"
                        value={form.start_date}
                        onChange={(e) => setForm(prev => ({ ...prev, start_date: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#1a1a3a] border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">End Date</label>
                      <input
                        type="date"
                        value={form.end_date}
                        onChange={(e) => setForm(prev => ({ ...prev, end_date: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#1a1a3a] border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                        disabled={form.is_current}
                      />
                    </div>
                  </div>

                  <div>
                    <SimpleMediaUpload
                      label="Company Logo"
                      acceptedTypes="image/*"
                      maxSize={5}
                      currentPreview={form.company_logo_url}
                      placeholder="Upload company logo"
                      onFileSelect={(file) => setSelectedFile(file)}
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Job Description</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 bg-[#1a1a3a] border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                      rows={6}
                      placeholder="Describe your responsibilities, achievements, key projects, technologies used, etc.&#10;&#10;• Developed and maintained web applications using React and Node.js&#10;• Led a team of 3 developers on critical projects&#10;• Improved application performance by 40%"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-medium mb-2">Sort Order</label>
                      <input
                        type="number"
                        value={form.sort_order}
                        onChange={(e) => setForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                        className="w-full px-4 py-3 bg-[#1a1a3a] border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                        placeholder="0 = most recent, higher = older"
                      />
                    </div>

                    <div className="flex items-end">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={form.is_current}
                          onChange={(e) => setForm(prev => ({ 
                            ...prev, 
                            is_current: e.target.checked,
                            end_date: e.target.checked ? '' : prev.end_date
                          }))}
                          className="mr-2 rounded"
                        />
                        <span className="text-white">Currently working here</span>
                      </label>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-700/30">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
                    >
                      <Save size={20} className="mr-2" />
                      {loading ? 'Saving...' : (editingExperience ? 'Update Experience' : 'Add Experience')}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}