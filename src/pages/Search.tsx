import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import VideoCard from '../components/Video/VideoCard';
import { Video } from '../types';
import { videoAPI } from '../lib/api';

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchVideos = async () => {
      if (!query.trim()) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await videoAPI.searchVideos(query);
        setVideos(response.data);
      } catch (err) {
        console.error('Error searching videos:', err);
        setError('Failed to search videos. Please try again.');
        
        // Mock search results for demonstration
        const mockResults: Video[] = [
          {
            _id: 'search1',
            title: `Search result for "${query}"`,
            description: 'This is a mock search result for demonstration purposes.',
            videoFile: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
            thumbnail: 'https://images.pexels.com/photos/1851415/pexels-photo-1851415.jpeg?auto=compress&cs=tinysrgb&w=400',
            duration: 120,
            views: 850,
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
          }
        ];
        setVideos(mockResults);
      } finally {
        setLoading(false);
      }
    };

    searchVideos();
  }, [query]);

  if (!query.trim()) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          Enter a search term to find videos.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Search results for "{query}"
        </h1>
        {!loading && (
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {videos.length} {videos.length === 1 ? 'result' : 'results'} found
          </p>
        )}
      </div>

      {loading && (
        <div className="flex justify-center items-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-yellow-700 dark:text-yellow-300 mb-2">{error}</p>
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              Showing mock results for demonstration. Please implement the search endpoint in your backend.
            </p>
          </div>
        </div>
      )}

      {!loading && videos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}

      {!loading && videos.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No videos found for "{query}". Try different keywords.
          </p>
        </div>
      )}
    </div>
  );
};

export default Search;