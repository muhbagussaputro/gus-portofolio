'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, MessageSquare, Star, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Layout from '@/app/(home)/Layout';
import { Testimonial } from '@/types/database';
import { useToast } from '@/components/Toast';

interface TestimonialForm {
  id?: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar_url?: string;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
}

const initialForm: TestimonialForm = {
  name: '',
  role: '',
  company: '',
  content: '',
  rating: 5,
  avatar_url: '',
  is_featured: false,
  is_published: true,
  sort_order: 0,
};

export default function TestimonialsAdmin() {
  const { showToast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<TestimonialForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  // Fetch testimonials
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/testimonials?include_unpublished=true');
      const data = await response.json();
      
      if (data.success) {
        setTestimonials(data.data || []);
      } else {
        setError(data.error || 'Failed to fetch testimonials');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Validate form
  const validateForm = () => {
    const errors: string[] = [];
    
    if (!formData.name.trim()) errors.push('Name is required');
    if (!formData.role.trim()) errors.push('Role is required');
    if (!formData.content.trim()) errors.push('Content is required');
    if (formData.rating < 1 || formData.rating > 5) errors.push('Rating must be between 1 and 5');
    
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      showToast({ 
        type: 'error', 
        title: 'Validation Error',
        message: validationErrors.join(', ')
      });
      return;
    }
    
    setSubmitting(true);

    try {
      const url = editingId ? `/api/testimonials/${editingId}` : '/api/testimonials';
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
        await fetchTestimonials();
        handleCloseModal();
        showToast({ 
          type: 'success', 
          title: editingId ? 'Testimonial updated successfully!' : 'Testimonial created successfully!'
        });
      } else {
        setError(data.error || 'Failed to save testimonial');
        showToast({ 
          type: 'error', 
          title: 'Failed to save testimonial',
          message: data.error
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      showToast({ 
        type: 'error', 
        title: 'Failed to save testimonial',
        message: errorMessage
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchTestimonials();
        showToast({ 
          type: 'success', 
          title: 'Testimonial deleted successfully!'
        });
      } else {
        setError(data.error || 'Failed to delete testimonial');
        showToast({ 
          type: 'error', 
          title: 'Failed to delete testimonial',
          message: data.error
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      showToast({ 
        type: 'error', 
        title: 'Failed to delete testimonial',
        message: errorMessage
      });
    }
  };

  // Modal handlers
  const handleOpenModal = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingId(testimonial.id);
      setFormData({
        name: testimonial.name,
        role: testimonial.role,
        company: testimonial.company || '',
        content: testimonial.content,
        rating: testimonial.rating || 5,
        avatar_url: testimonial.avatar_url || '',
        is_featured: testimonial.is_featured,
        is_published: testimonial.is_published,
        sort_order: testimonial.sort_order,
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'}
      />
    ));
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
                  Testimonials
                </h1>
                <p className="text-gray-400 mt-2">Manage client testimonials and reviews</p>
              </div>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
            >
              <Plus size={20} className="mr-2" />
              Add Testimonial
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

          {/* Testimonials Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className={`p-6 rounded-xl border transition-all duration-300 ${
                  testimonial.is_published
                    ? 'bg-[#0a0a29]/40 border-indigo-500/10 hover:border-indigo-500/30'
                    : 'bg-gray-800/20 border-gray-600/10'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${
                      testimonial.is_published ? 'bg-indigo-500/20 text-indigo-400' : 'bg-gray-600/20 text-gray-500'
                    }`}>
                      {testimonial.avatar_url ? (
                        <img
                          src={testimonial.avatar_url}
                          alt={testimonial.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <MessageSquare size={24} />
                      )}
                    </div>
                    <div>
                      <h3 className={`font-semibold ${testimonial.is_published ? 'text-white' : 'text-gray-400'}`}>
                        {testimonial.name}
                      </h3>
                      <p className={`text-sm ${testimonial.is_published ? 'text-gray-300' : 'text-gray-500'}`}>
                        {testimonial.role} {testimonial.company && `at ${testimonial.company}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleOpenModal(testimonial)}
                      className="p-2 text-gray-400 hover:text-indigo-400 transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    {renderStars(testimonial.rating || 5)}
                  </div>
                  <p className={`text-sm line-clamp-3 ${testimonial.is_published ? 'text-gray-300' : 'text-gray-500'}`}>
                    "{testimonial.content}"
                  </p>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className={testimonial.is_published ? 'text-green-400' : 'text-gray-500'}>
                      {testimonial.is_published ? (
                        <><Eye size={12} className="inline mr-1" />Published</>
                      ) : (
                        <><EyeOff size={12} className="inline mr-1" />Draft</>
                      )}
                    </span>
                    {testimonial.is_featured && (
                      <span className="text-yellow-400">
                        <Star size={12} className="inline mr-1" />Featured
                      </span>
                    )}
                  </div>
                  <span className="text-gray-500">Order: {testimonial.sort_order}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {testimonials.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <MessageSquare size={64} className="mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Testimonials</h3>
              <p className="text-gray-500 mb-6">Start by adding your first client testimonial</p>
              <button
                onClick={() => handleOpenModal()}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
              >
                Add First Testimonial
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
              className="bg-[#0a0a29] border border-indigo-500/20 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {editingId ? 'Edit Testimonial' : 'Add Testimonial'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1a1a3a] border border-indigo-500/20 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                      placeholder="Client name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Role *
                    </label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1a1a3a] border border-indigo-500/20 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                      placeholder="Job title"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1a1a3a] border border-indigo-500/20 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Avatar URL
                    </label>
                    <input
                      type="url"
                      value={formData.avatar_url}
                      onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1a1a3a] border border-indigo-500/20 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Testimonial Content *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1a1a3a] border border-indigo-500/20 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                    placeholder="What did the client say about your work?"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Rating
                    </label>
                    <select
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 bg-[#1a1a3a] border border-indigo-500/20 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                    >
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <option key={rating} value={rating}>{rating} Star{rating > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
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
                      Featured
                    </label>
                    <select
                      value={formData.is_featured ? 'yes' : 'no'}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.value === 'yes' })}
                      className="w-full px-3 py-2 bg-[#1a1a3a] border border-indigo-500/20 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.is_published ? 'published' : 'draft'}
                      onChange={(e) => setFormData({ ...formData, is_published: e.target.value === 'published' })}
                      className="w-full px-3 py-2 bg-[#1a1a3a] border border-indigo-500/20 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
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