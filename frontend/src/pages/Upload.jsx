import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CloudArrowUpIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import api from '../config/api';
import toast from 'react-hot-toast';

const Upload = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoFile: null,
    thumbnail: null,
  });
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (files) {
      const file = files[0];
      setFormData({
        ...formData,
        [name]: file,
      });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        if (name === 'videoFile') {
          setVideoPreview(reader.result);
        } else if (name === 'thumbnail') {
          setThumbnailPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.videoFile) {
      toast.error('Please select a video file');
      return;
    }

    if (!formData.thumbnail) {
      toast.error('Please select a thumbnail image');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('videoFile', formData.videoFile);
      uploadData.append('thumbnail', formData.thumbnail);

      // Note: This endpoint doesn't exist in your backend yet
      // You'll need to create a video upload endpoint
      const response = await api.post('/videos/upload', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      toast.success('Video uploaded successfully!');
      navigate(`/watch/${response.data.data._id}`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload video. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Upload Video
        </h1>
        <p className="text-gray-600">
          Share your content with the world
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form Fields */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter video title"
                maxLength="100"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.title.length}/100 characters
              </p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className="input-field resize-none"
                placeholder="Tell viewers about your video"
                maxLength="5000"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.description.length}/5000 characters
              </p>
            </div>

            {/* Video File Upload */}
            <div>
              <label htmlFor="videoFile" className="block text-sm font-medium text-gray-700 mb-2">
                Video File *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                <input
                  type="file"
                  id="videoFile"
                  name="videoFile"
                  accept="video/*"
                  required
                  onChange={handleChange}
                  className="hidden"
                />
                <label htmlFor="videoFile" className="cursor-pointer">
                  <VideoCameraIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600">
                    {formData.videoFile ? formData.videoFile.name : 'Click to select video file'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    MP4, WebM, or OGV (max 100MB)
                  </p>
                </label>
              </div>
            </div>

            {/* Thumbnail Upload */}
            <div>
              <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                <input
                  type="file"
                  id="thumbnail"
                  name="thumbnail"
                  accept="image/*"
                  required
                  onChange={handleChange}
                  className="hidden"
                />
                <label htmlFor="thumbnail" className="cursor-pointer">
                  <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600">
                    {formData.thumbnail ? formData.thumbnail.name : 'Click to select thumbnail'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG, or GIF (max 5MB)
                  </p>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Previews */}
          <div className="space-y-6">
            {/* Video Preview */}
            {videoPreview && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Video Preview</h3>
                <div className="bg-black rounded-lg overflow-hidden">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full h-auto"
                    style={{ maxHeight: '300px' }}
                  />
                </div>
              </div>
            )}

            {/* Thumbnail Preview */}
            {thumbnailPreview && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Thumbnail Preview</h3>
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-full h-auto object-cover"
                    style={{ maxHeight: '200px' }}
                  />
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {uploading && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Upload Progress</h3>
                <div className="bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-primary-600 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2 text-center">
                  {uploadProgress}% uploaded
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn-secondary"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Uploading...</span>
              </div>
            ) : (
              'Upload Video'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Upload;