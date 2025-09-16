import React, { useState, useEffect } from 'react';
import VideoCard from '../components/VideoCard';
import api from '../config/api';
import toast from 'react-hot-toast';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      // Since your backend doesn't have a videos endpoint yet, 
      // we'll create a mock response for now
      const mockVideos = [
        {
          _id: '1',
          title: 'Sample Video 1',
          description: 'This is a sample video description',
          thumbnail: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800',
          videoFile: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
          duration: 120,
          views: 1500,
          createdAt: new Date().toISOString(),
          owner: {
            _id: 'user1',
            username: 'johndoe',
            fullName: 'John Doe',
            avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
          }
        },
        {
          _id: '2',
          title: 'Sample Video 2',
          description: 'Another sample video description',
          thumbnail: 'https://images.pexels.com/photos/1144275/pexels-photo-1144275.jpeg?auto=compress&cs=tinysrgb&w=800',
          videoFile: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
          duration: 180,
          views: 2300,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          owner: {
            _id: 'user2',
            username: 'janedoe',
            fullName: 'Jane Doe',
            avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'
          }
        }
      ];
      
      setVideos(mockVideos);
      
      // Uncomment this when you have the videos API endpoint
      // const response = await api.get('/videos');
      // setVideos(response.data.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError('Failed to load videos');
      toast.error('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={fetchVideos}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to StreamEngine
        </h1>
        <p className="text-gray-600">
          Discover amazing videos from creators around the world
        </p>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No videos available</p>
          <p className="text-sm text-gray-400">
            Be the first to upload a video!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;