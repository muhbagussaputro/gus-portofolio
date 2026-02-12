'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Save, X, Upload, ExternalLink, Github, Calendar, User, Building } from 'lucide-react';
import Layout from '@/app/(home)/Layout';
import { useRouter } from 'next/navigation';
import { Project, ProjectCategory, Technology } from '@/types/database';
import SimpleMediaUpload from '@/components/SimpleMediaUpload';
import MultipleFileUpload from '@/components/MultipleFileUpload';
import { uploadSingleFile, generateSlug } from '@/lib/upload-utils';
import { useToast } from '@/components/Toast';

interface ProjectForm {
  title: string;
  slug: string;
  short_description: string;
  detailed_description: string;
  category_id: string;
  status: 'planning' | 'development' | 'completed' | 'maintenance';
  demo_url: string;
  github_url: string;
  case_study_url: string;
  thumbnail_url: string;
  gallery_images: string[];
  video_demo_url: string;
  start_date: string;
  end_date: string;
  client_name: string;
  team_size: number;
  my_role: string;
  featured: boolean;
  is_published: boolean;
  technology_ids: string[];
}

const initialForm: ProjectForm = {
  title: '',
  slug: '',
  short_description: '',
  detailed_description: '',
  category_id: '',
  status: 'completed',
  demo_url: '',
  github_url: '',
  case_study_url: '',
  thumbnail_url: '',
  gallery_images: [],
  video_demo_url: '',
  start_date: '',
  end_date: '',
  client_name: '',
  team_size: 1,
  my_role: '',
  featured: false,
  is_published: true,
  technology_ids: [],
};

export default function ProjectsAdminPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form, setForm] = useState<ProjectForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [skillCategories, setSkillCategories] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<{
    thumbnail: File | null;
    video: File | null;
    gallery: File[];
  }>({
    thumbnail: null,
    video: null,
    gallery: []
  });

  useEffect(() => {
    fetchProjects();
    fetchCategories();
    fetchTechnologies();
    fetchSkillCategories();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects?limit=50');
      const data = await response.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (err) {
      setError('Failed to fetch projects');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories/projects');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch categories');
    }
  };

  const fetchTechnologies = async () => {
    try {
      const response = await fetch('/api/technologies');
      const data = await response.json();
      if (data.success) {
        setTechnologies(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch technologies');
    }
  };

  const fetchSkillCategories = async () => {
    try {
      const response = await fetch('/api/categories/skills');
      const data = await response.json();
      if (data.success) {
        setSkillCategories(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch skill categories');
    }
  };



  const handleTitleChange = (title: string) => {
    setForm(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const uploadProjectFile = async (file: File, index: number = 1) => {
    const selectedCategory = categories.find(cat => cat.id === form.category_id);
    const categorySlug = selectedCategory?.slug || 'uncategorized';
    
    return uploadSingleFile(file, {
      category: `project/${categorySlug}`,
      slug: form.slug,
      index,
      fileType: file.type.startsWith('image/') ? 'image' : 
                file.type.startsWith('video/') ? 'video' : 'document'
    });
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!form.title.trim()) errors.push('Title is required');
    if (!form.short_description.trim()) errors.push('Short description is required');
    if (!form.category_id) errors.push('Category is required');
    if (form.technology_ids.length === 0) errors.push('At least one technology is required');
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      showToast({ 
        type: 'error', 
        title: 'Validation Error',
        message: validationErrors.join(', ')
      });
      setLoading(false);
      return;
    }

    try {
      let uploadedUrls = {
        thumbnail_url: form.thumbnail_url,
        video_demo_url: form.video_demo_url,
        gallery_images: form.gallery_images
      };

      // Upload files if selected
      if (selectedFiles.thumbnail) {
        uploadedUrls.thumbnail_url = await uploadProjectFile(selectedFiles.thumbnail, 1);
      }

      if (selectedFiles.video) {
        uploadedUrls.video_demo_url = await uploadProjectFile(selectedFiles.video, 2);
      }

      if (selectedFiles.gallery.length > 0) {
        const galleryUrls = [];
        let startIndex = 3; // Start after thumbnail (1) and video (2)
        
        for (const file of selectedFiles.gallery) {
          const url = await uploadProjectFile(file, startIndex);
          galleryUrls.push(url);
          startIndex++;
        }
        uploadedUrls.gallery_images = [...form.gallery_images, ...galleryUrls];
      }

      // Save project with uploaded URLs
      const url = editingProject 
        ? `/api/projects/${editingProject.slug}`
        : '/api/projects';
      
      const method = editingProject ? 'PATCH' : 'POST';
      
      const projectData = {
        ...form,
        ...uploadedUrls
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      const data = await response.json();

      if (data.success) {
        setShowForm(false);
        setEditingProject(null);
        setForm(initialForm);
        setSelectedFiles({ thumbnail: null, video: null, gallery: [] });
        fetchProjects();
        showToast({ 
            type: 'success', 
            title: editingProject ? 'Project updated successfully!' : 'Project created successfully!'
          });
        } else {
          setError(data.error || 'Failed to save project');
          showToast({ 
            type: 'error', 
            title: 'Failed to save project',
            message: data.error
          });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setForm({
      title: project.title,
      slug: project.slug,
      short_description: project.short_description || '',
      detailed_description: project.detailed_description || '',
      category_id: project.category_id || '',
      status: project.status,
      demo_url: project.demo_url || '',
      github_url: project.github_url || '',
      case_study_url: project.case_study_url || '',
      thumbnail_url: project.thumbnail_url || '',
      gallery_images: project.gallery_images || [],
      video_demo_url: project.video_demo_url || '',
      start_date: project.start_date || '',
      end_date: project.end_date || '',
      client_name: project.client_name || '',
      team_size: project.team_size || 1,
      my_role: project.my_role || '',
      featured: project.featured,
      is_published: project.is_published,
      technology_ids: [],
    });
    setSelectedFiles({ thumbnail: null, video: null, gallery: [] });
    setShowForm(true);
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/api/projects/${slug}`, {
        method: 'DELETE',
      });

      if (response.ok) {
          fetchProjects();
          showToast({ 
            type: 'success', 
            title: 'Project deleted successfully!'
          });
        } else {
          setError('Failed to delete project');
          showToast({ 
            type: 'error', 
            title: 'Failed to delete project'
          });
        }
      } catch (err) {
        setError('Failed to delete project');
        showToast({ 
          type: 'error', 
          title: 'Failed to delete project'
        });
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#030014] py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Projects Management</h1>
              <p className="text-gray-400">Manage your portfolio projects</p>
            </div>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingProject(null);
                setForm(initialForm);
                setSelectedFiles({ thumbnail: null, video: null, gallery: [] });
              }}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
            >
              <Plus size={20} className="mr-2" />
              Add New Project
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0a0a29]/40 border border-indigo-500/10 rounded-xl p-6 hover:border-indigo-500/30 transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="h-32 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-lg mb-4 flex items-center justify-center">
                  {project.thumbnail_url ? (
                    <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span className="text-gray-400 text-sm">No thumbnail</span>
                  )}
                </div>

                {/* Content */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white truncate">{project.title}</h3>
                    <div className="flex items-center space-x-1">
                      {project.featured && (
                        <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded">Featured</span>
                      )}
                      <span className={`px-2 py-1 text-xs rounded ${
                        project.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        project.status === 'development' ? 'bg-blue-500/20 text-blue-400' :
                        project.status === 'planning' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-2">{project.short_description}</p>
                  
                  {/* Links */}
                  <div className="flex items-center space-x-2 mt-3">
                    {project.demo_url && (
                      <a href={project.demo_url} target="_blank" rel="noopener noreferrer" 
                         className="text-indigo-400 hover:text-indigo-300">
                        <ExternalLink size={16} />
                      </a>
                    )}
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                         className="text-indigo-400 hover:text-indigo-300">
                        <Github size={16} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700/30">
                  <div className="flex items-center space-x-2">
                    <Calendar size={14} className="text-gray-400" />
                    <span className="text-gray-400 text-xs">
                      {project.start_date ? new Date(project.start_date).getFullYear() : 'No date'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-2 text-gray-400 hover:text-indigo-400 transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(project.slug)}
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
                className="bg-[#0a0a29] border border-indigo-500/20 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                {/* Form Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700/30">
                  <h2 className="text-2xl font-bold text-white">
                    {editingProject ? 'Edit Project' : 'Add New Project'}
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
                    {/* Basic Info */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white font-medium mb-2">Project Title *</label>
                        <input
                          type="text"
                          value={form.title}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          className="w-full px-4 py-3 bg-[#1a1a3a] border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-white font-medium mb-2">Slug</label>
                        <input
                          type="text"
                          value={form.slug}
                          onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
                          className="w-full px-4 py-3 bg-[#1a1a3a] border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-white font-medium mb-2">Category</label>
                        <select
                          value={form.category_id}
                          onChange={(e) => setForm(prev => ({ ...prev, category_id: e.target.value }))}
                          className="w-full px-4 py-3 bg-[#1a1a3a] border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                        >
                          <option value="">Select Category</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-white font-medium mb-2">Status</label>
                        <select
                          value={form.status}
                          onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value as any }))}
                          className="w-full px-4 py-3 bg-[#1a1a3a] border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                        >
                          <option value="planning">Planning</option>
                          <option value="development">Development</option>
                          <option value="completed">Completed</option>
                          <option value="maintenance">Maintenance</option>
                        </select>
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white font-medium mb-2">Client/Company</label>
                        <input
                          type="text"
                          value={form.client_name}
                          onChange={(e) => setForm(prev => ({ ...prev, client_name: e.target.value }))}
                          className="w-full px-4 py-3 bg-[#1a1a3a] border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                          placeholder="Client name or personal project"
                        />
                      </div>

                                          <div>
                      <label className="block text-white font-medium mb-2">My Role</label>
                      <select
                        value={form.my_role}
                        onChange={(e) => setForm(prev => ({ ...prev, my_role: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#1a1a3a] border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="">Select Role</option>
                        {skillCategories.map(category => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                        <option value="Full Stack Developer">Full Stack Developer</option>
                        <option value="Project Manager">Project Manager</option>
                        <option value="Tech Lead">Tech Lead</option>
                      </select>
                    </div>

                      <div>
                        <label className="block text-white font-medium mb-2">Team Size</label>
                        <input
                          type="number"
                          value={form.team_size}
                          onChange={(e) => setForm(prev => ({ ...prev, team_size: parseInt(e.target.value) || 1 }))}
                          className="w-full px-4 py-3 bg-[#1a1a3a] border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                          min="1"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white font-medium mb-2">Start Date</label>
                          <input
                            type="date"
                            value={form.start_date}
                            onChange={(e) => setForm(prev => ({ ...prev, start_date: e.target.value }))}
                            className="w-full px-4 py-3 bg-[#1a1a3a] border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-white font-medium mb-2">End Date</label>
                          <input
                            type="date"
                            value={form.end_date}
                            onChange={(e) => setForm(prev => ({ ...prev, end_date: e.target.value }))}
                            className="w-full px-4 py-3 bg-[#1a1a3a] border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Descriptions */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white font-medium mb-2">Short Description *</label>
                      <textarea
                        value={form.short_description}
                        onChange={(e) => setForm(prev => ({ ...prev, short_description: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#1a1a3a] border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                        rows={3}
                        placeholder="Brief project description for cards"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Detailed Description</label>
                      <textarea
                        value={form.detailed_description}
                        onChange={(e) => setForm(prev => ({ ...prev, detailed_description: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#1a1a3a] border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                        rows={6}
                        placeholder="Detailed project description with features, challenges, solutions, etc."
                      />
                    </div>
                  </div>

                  {/* URLs */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-white font-medium mb-2">Demo URL</label>
                      <input
                        type="url"
                        value={form.demo_url}
                        onChange={(e) => setForm(prev => ({ ...prev, demo_url: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#1a1a3a] border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">GitHub URL</label>
                      <input
                        type="url"
                        value={form.github_url}
                        onChange={(e) => setForm(prev => ({ ...prev, github_url: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#1a1a3a] border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                        placeholder="https://github.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Case Study URL</label>
                      <input
                        type="url"
                        value={form.case_study_url}
                        onChange={(e) => setForm(prev => ({ ...prev, case_study_url: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#1a1a3a] border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                        placeholder="https://case-study.com"
                      />
                    </div>
                  </div>

                  {/* Media Upload */}
                  <div className="space-y-6">
                    {/* Thumbnail & Video */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <SimpleMediaUpload
                        label="Thumbnail Image"
                        acceptedTypes="image/*"
                        maxSize={10}
                        currentPreview={form.thumbnail_url}
                        placeholder="Upload project thumbnail"
                        onFileSelect={(file) => setSelectedFiles(prev => ({ ...prev, thumbnail: file }))}
                      />
                      
                      <SimpleMediaUpload
                        label="Video Demo (Optional)"
                        acceptedTypes="video/*"
                        maxSize={50}
                        currentPreview={form.video_demo_url}
                        placeholder="Upload project demo video"
                        onFileSelect={(file) => setSelectedFiles(prev => ({ ...prev, video: file }))}
                      />
                    </div>

                    {/* Project Gallery */}
                    <div>
                      <p className="text-gray-400 text-sm mb-4">
                        Upload multiple images. Files will be organized as: 
                        <code className="text-indigo-400 text-xs ml-1">
                          project/{categories.find(cat => cat.id === form.category_id)?.slug || 'category'}/{form.slug || 'untitled'}_3.jpg
                        </code>
                      </p>
                      
                      <MultipleFileUpload
                        label="Project Gallery (Optional)"
                        acceptedTypes="image/*"
                        maxFiles={10}
                        maxSize={5}
                        onFilesChange={(files) => setSelectedFiles(prev => ({ ...prev, gallery: files }))}
                        currentFiles={selectedFiles.gallery}
                        placeholder="Upload gallery images with drag & drop or paste multiple images"
                      />

                      {/* Current Gallery Images from Database */}
                      {form.gallery_images && form.gallery_images.length > 0 && (
                        <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                          <h4 className="text-white text-sm font-medium mb-3">Current Gallery ({form.gallery_images.length} images)</h4>
                          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                            {form.gallery_images.map((url, index) => (
                              <div key={index} className="relative group">
                                <img 
                                  src={url} 
                                  alt={`Gallery ${index + 1}`}
                                  className="w-full aspect-square object-cover rounded border border-gray-600 cursor-pointer hover:scale-105 transition-transform"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newImages = form.gallery_images.filter((_, i) => i !== index);
                                    setForm(prev => ({ ...prev, gallery_images: newImages }));
                                  }}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                          <p className="text-gray-400 text-xs mt-2">Note: These are existing images. Upload new files above to add more.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Settings */}
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={(e) => setForm(prev => ({ ...prev, featured: e.target.checked }))}
                        className="mr-2 rounded"
                      />
                      <span className="text-white">Featured Project</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={form.is_published}
                        onChange={(e) => setForm(prev => ({ ...prev, is_published: e.target.checked }))}
                        className="mr-2 rounded"
                      />
                      <span className="text-white">Published</span>
                    </label>
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
                      {loading ? 'Saving...' : (editingProject ? 'Update Project' : 'Create Project')}
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