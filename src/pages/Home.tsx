import React, { useState, useEffect } from 'react';
import VideoCard from '../components/Video/VideoCard';
import { Video } from '../types';
import { videoAPI } from '../lib/api';

const Home: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        // Note: This will fail until you implement the videos endpoint in your backend
        const response = await videoAPI.getAllVideos();
        setVideos(response.data);
      } catch (err) {
        setError('Failed to load videos. Please make sure your backend is running and the videos endpoint is implemented.');
        console.error('Error fetching videos:', err);
        
        // Mock data for demonstration
        const mockVideos: Video[] = [
          {
            _id: '1',
            title: 'Sample Video 1',
            description: 'This is a sample video description',
            videoFile: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
            thumbnail: 'https://images.pexels.com/photos/1851415/pexels-photo-1851415.jpeg?auto=compress&cs=tinysrgb&w=400',
            duration: 120,
            views: 1500,
            isPublished: true,
            owner: {
              _id: 'user1',
              username: 'creator1',
              email: 'creator1@example.com',
              fullName: 'John Creator',
              avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            _id: '2',
            title: 'Sample Video 2',
            description: 'Another sample video description',
            videoFile: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
            thumbnail: 'https://images.pexels.com/photos/1851415/pexels-photo-1851415.jpeg?auto=compress&cs=tinysrgb&w=400',
            duration: 180,
            views: 2300,
            isPublished: true,
            owner: {
              _id: 'user2',
              username: 'creator2',
              email: 'creator2@example.com',
              fullName: 'Jane Creator',
              avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100'
            },
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 86400000).toISOString()
          }
        ];
        setVideos(mockVideos);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 max-w-2xl mx-auto">
          <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-2">
            Backend Connection Issue
          </h3>
          <p className="text-yellow-700 dark:text-yellow-300 mb-4">{error}</p>
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            Showing mock data for demonstration. Please implement the GET /api/v1/videos endpoint in your backend.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Recommended Videos</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>

      {videos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No videos found.</p>
        </div>
      )}
    </div>
  );
};

export default Home;