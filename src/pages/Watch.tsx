import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Share, Download, MoreHorizontal } from 'lucide-react';
import VideoPlayer from '../components/Video/VideoPlayer';
import { Video, Comment } from '../types';
import { videoAPI, commentAPI } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

const Watch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchVideo = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // This will fail until you implement the video endpoint
        const response = await videoAPI.getVideoById(id);
        setVideo(response.data);
      } catch (err) {
        console.error('Error fetching video:', err);
        // Mock data for demonstration
        const mockVideo: Video = {
          _id: id,
          title: 'Sample Video Title',
          description: 'This is a sample video description. In a real application, this would be fetched from your backend API.',
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
            avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
            subscribersCount: 1200
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setVideo(mockVideo);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      if (!id) return;
      
      try {
        const response = await commentAPI.getVideoComments(id);
        setComments(response.data);
      } catch (err) {
        console.error('Error fetching comments:', err);
        // Mock comments for demonstration
        const mockComments: Comment[] = [
          {
            _id: '1',
            content: 'Great video! Thanks for sharing.',
            video: id,
            owner: {
              _id: 'user2',
              username: 'viewer1',
              email: 'viewer1@example.com',
              fullName: 'Jane Viewer',
              avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100'
            },
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            updatedAt: new Date(Date.now() - 3600000).toISOString()
          }
        ];
        setComments(mockComments);
      }
    };

    fetchVideo();
    fetchComments();
  }, [id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !id) return;

    try {
      const response = await commentAPI.addComment(id, newComment.trim());
      setComments([response.data, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
      // For demo purposes, add comment locally
      const mockComment: Comment = {
        _id: Date.now().toString(),
        content: newComment.trim(),
        video: id,
        owner: user!,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setComments([mockComment, ...comments]);
      setNewComment('');
    }
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Video not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Video player */}
          <div className="aspect-video mb-4">
            <VideoPlayer
              src={video.videoFile}
              poster={video.thumbnail}
              className="w-full h-full"
            />
          </div>

          {/* Video info */}
          <div className="space-y-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {video.title}
            </h1>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span>{formatViews(video.views)} views</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-dark-700 rounded-full hover:bg-gray-200 dark:hover:bg-dark-600">
                  <ThumbsUp className="w-4 h-4" />
                  <span>Like</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-dark-700 rounded-full hover:bg-gray-200 dark:hover:bg-dark-600">
                  <ThumbsDown className="w-4 h-4" />
                  <span>Dislike</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-dark-700 rounded-full hover:bg-gray-200 dark:hover:bg-dark-600">
                  <Share className="w-4 h-4" />
                  <span>Share</span>
                </button>
                <button className="p-2 bg-gray-100 dark:bg-dark-700 rounded-full hover:bg-gray-200 dark:hover:bg-dark-600">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Channel info */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <img
                  src={video.owner.avatar}
                  alt={video.owner.fullName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {video.owner.fullName}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {video.owner.subscribersCount ? `${formatViews(video.owner.subscribersCount)} subscribers` : 'No subscribers yet'}
                  </p>
                </div>
              </div>
              
              {isAuthenticated && (
                <button className="btn-primary">
                  Subscribe
                </button>
              )}
            </div>

            {/* Description */}
            <div className="p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {video.description}
              </p>
            </div>

            {/* Comments section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Comments ({comments.length})
              </h3>

              {isAuthenticated && (
                <form onSubmit={handleAddComment} className="space-y-3">
                  <div className="flex space-x-3">
                    <img
                      src={user?.avatar}
                      alt={user?.fullName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full px-3 py-2 border-b-2 border-gray-300 dark:border-dark-600 bg-transparent focus:border-primary-500 focus:outline-none resize-none"
                        rows={1}
                      />
                    </div>
                  </div>
                  {newComment.trim() && (
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setNewComment('')}
                        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 rounded"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn-primary">
                        Comment
                      </button>
                    </div>
                  )}
                </form>
              )}

              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment._id} className="flex space-x-3">
                    <img
                      src={comment.owner.avatar}
                      alt={comment.owner.fullName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm text-gray-900 dark:text-white">
                          {comment.owner.fullName}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Related videos */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Related Videos
          </h3>
          <div className="space-y-3">
            {/* Placeholder for related videos */}
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Related videos will appear here when implemented in the backend.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;