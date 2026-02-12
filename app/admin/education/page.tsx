'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, GraduationCap, Calendar, MapPin, Star } from 'lucide-react';
import Layout from '@/app/(home)/Layout';
import { Education } from '@/types/database';
import SimpleMediaUpload from '@/components/SimpleMediaUpload';
import { uploadSingleFile } from '@/lib/upload-utils';
import { useToast } from '@/components/Toast';

interface EducationForm {
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
  gpa: number | null;
  description: string;
  logo_url: string;
  is_current: boolean;
  sort_order: number;
}

const initialForm: EducationForm = {
  institution: '',
  degree: '',
  field_of_study: '',
  start_date: '',
  end_date: '',
  gpa: null,
  description: '',
  logo_url: '',
  is_current: false,
  sort_order: 0,
};

export default function EducationAdminPage() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [form, setForm] = useState<EducationForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchEducations();
  }, []);

  const fetchEducations = async () => {
    try {
      const response = await fetch('/api/about?section=education');
      const data = await response.json();
      if (data.success) {
        setEducations(data.data);
      }
    } catch (err) {
      setError('Failed to fetch education data');
    }
  };



  const validateForm = () => {
    if (!form.institution.trim()) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Institution name is required'
      });
      return false;
    }
    if (!form.degree.trim()) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Degree is required'
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
        message: 'End date is required when not currently studying'
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
    if (form.gpa !== null && (form.gpa < 0 || form.gpa > 4)) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'GPA must be between 0 and 4'
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
      let logoUrl = form.logo_url;
      
      // Upload file if selected
      if (selectedFile) {
        const slug = form.institution.toLowerCase().replace(/[^a-z0-9]/g, '-');
        logoUrl = await uploadSingleFile(selectedFile, {
          category: 'education',
          slug,
          fileType: 'image'
        });
      }

      const url = editingEducation 
        ? `/api/education/${editingEducation.id}`
        : '/api/education';
      
      const method = editingEducation ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...form, logo_url: logoUrl }),
      });

      const data = await response.json();

      if (data.success) {
        showToast({
          type: 'success',
          title: 'Success',
          message: `Education ${editingEducation ? 'updated' : 'added'} successfully`
        });
        setShowForm(false);
        setEditingEducation(null);
        setForm(initialForm);
        setSelectedFile(null);
        fetchEducations();
      } else {
        showToast({
          type: 'error',
          title: 'Error',
          message: data.error || 'Failed to save education'
        });
        setError(data.error || 'Failed to save education');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save education';
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

  const handleEdit = (education: Education) => {
    setEditingEducation(education);
    setForm({
      institution: education.institution,
      degree: education.degree,
      field_of_study: education.field_of_study || '',
      start_date: education.start_date,
      end_date: education.end_date || '',
      gpa: education.gpa,
      description: education.description || '',
      logo_url: education.logo_url || '',
      is_current: education.is_current,
      sort_order: education.sort_order,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education record?')) return;

    try {
      const response = await fetch(`/api/education/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showToast({
          type: 'success',
          title: 'Success',
          message: 'Education deleted successfully'
        });
        fetchEducations();
      } else {
        showToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to delete education'
        });
        setError('Failed to delete education');
      }
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete education'
      });
      setError('Failed to delete education');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#030014] py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Education Management</h1>
              <p className="text-gray-400">Manage your educational background</p>
            </div>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingEducation(null);
                setForm(initialForm);
          setSelectedFile(null);
              }}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
            >
              <Plus size={20} className="mr-2" />
              Add Education
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Education List */}
          <div className="space-y-6 mb-8">
            {educations.map((education) => (
              <motion.div
                key={education.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0a0a29]/40 border border-indigo-500/10 rounded-xl p-6 hover:border-indigo-500/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    {/* Logo */}
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      {education.logo_url ? (
                        <img src={education.logo_url} alt={education.institution} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <GraduationCap size={24} className="text-indigo-400" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-white">{education.degree}</h3>
                          <p className="text-indigo-400 font-medium">{education.institution}</p>
                          {education.field_of_study && (
                            <p className="text-gray-400">{education.field_of_study}</p>
                          )}
                        </div>
                        {education.is_current && (
                          <span className="px-3 py-1 text-xs bg-green-500/20 text-green-400 rounded-full">
                            Current
                          </span>
                        )}
                      </div>

                      {/* Date */}
                      <div className="flex items-center text-gray-400 text-sm mb-3">
                        <Calendar size={14} className="mr-2" />
                        <span>
                          {formatDate(education.start_date)} - {education.end_date ? formatDate(education.end_date) : 'Present'}
                        </span>
                      </div>

                      {/* GPA */}
                      {education.gpa && (
                        <div className="flex items-center text-gray-400 text-sm mb-3">
                          <Star size={14} className="mr-2" />
                          <span>GPA: {education.gpa}</span>
                        </div>
                      )}

                      {/* Description */}
                      {education.description && (
                        <p className="text-gray-400 text-sm">{education.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(education)}
                      className="p-2 text-gray-400 hover:text-indigo-400 transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(education.id)}
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
                    {editingEducation ? 'Edit Education' : 'Add Education'}
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
                      <label className="block text-white font-medium mb-2">Institution *</label>
                      <input
                        type="text"
                        value={form.institution}
                        onChange={(e) => setForm(prev => ({ ...prev, institution: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#1a1a3a] border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                        placeholder="e.g., Universitas Dian Nuswantoro"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Degree *</label>
                      <input
                        type="text"
                        value={form.degree}
                        onChange={(e) => setForm(prev => ({ ...prev, degree: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#1a1a3a] border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                        placeholder="e.g., Bachelor's Degree, Master's Degree"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Field of Study</label>
                    <input
                      type="text"
                      value={form.field_of_study}
                      onChange={(e) => setForm(prev => ({ ...prev, field_of_study: e.target.value }))}
                      className="w-full px-4 py-3 bg-[#1a1a3a] border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                      placeholder="e.g., Computer Science, Information Technology"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                    <div>
                      <label className="block text-white font-medium mb-2">GPA</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="4"
                        value={form.gpa || ''}
                        onChange={(e) => setForm(prev => ({ ...prev, gpa: e.target.value ? parseFloat(e.target.value) : null }))}
                        className="w-full px-4 py-3 bg-[#1a1a3a] border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                        placeholder="3.76"
                      />
                    </div>
                  </div>

                  <div>
                    <SimpleMediaUpload
                      label="Institution Logo"
                      acceptedTypes="image/*"
                      maxSize={5}
                      currentPreview={form.logo_url}
                      placeholder="Upload institution logo"
                      onFileSelect={(file) => setSelectedFile(file)}
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Description</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 bg-[#1a1a3a] border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                      rows={4}
                      placeholder="Describe achievements, focus areas, notable projects, etc."
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
                        placeholder="0 = first, higher = later"
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
                        <span className="text-white">Currently studying here</span>
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
                      {loading ? 'Saving...' : (editingEducation ? 'Update Education' : 'Add Education')}
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