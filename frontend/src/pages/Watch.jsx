import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import {
  HandThumbUpIcon,
  HandThumbDownIcon,
  ShareIcon,
  UserPlusIcon,
  UserMinusIcon,
} from '@heroicons/react/24/outline';
import {
  HandThumbUpIcon as HandThumbUpSolidIcon,
  HandThumbDownIcon as HandThumbDownSolidIcon,
} from '@heroicons/react/24/solid';
import VideoPlayer from '../components/VideoPlayer';
import VideoCard from '../components/VideoCard';
import CommentSection from '../components/CommentSection';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Watch = () => {
  const { videoId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);

  useEffect(() => {
    if (videoId) {
      fetchVideo();
      fetchRelatedVideos();
    }
  }, [videoId]);

  const fetchVideo = async () => {
    try {
      setLoading(true);
      // Mock video data since your backend doesn't have video endpoints yet
      const mockVideo = {
        _id: videoId,
        title: 'Sample Video Title - Learn React in 2024',
        description: 'This is a comprehensive tutorial on React.js covering all the latest features and best practices. In this video, you will learn about components, hooks, state management, and much more.',
        videoFile: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4',
        thumbnail: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800',
        duration: 1800,
        views: 15420,
        likes: 1250,
        dislikes: 45,
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        owner: {
          _id: 'owner1',
          username: 'techguru',
          fullName: 'Tech Guru',
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
          subscribersCount: 125000
        }
      };
      
      setVideo(mockVideo);
      setSubscribersCount(mockVideo.owner.subscribersCount);
      
      // Simulate checking subscription status
      if (isAuthenticated) {
        setIsSubscribed(Math.random() > 0.5);
        setIsLiked(Math.random() > 0.7);
        setIsDisliked(false);
      }
      
      // Uncomment when you have the video API endpoint
      // const response = await api.get(`/videos/${videoId}`);
      // setVideo(response.data.data);
    } catch (error) {
      console.error('Error fetching video:', error);
      toast.error('Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedVideos = async () => {
    try {
      // Mock related videos
      const mockRelatedVideos = [
        {
          _id: 'related1',
          title: 'Advanced React Patterns',
          thumbnail: 'https://images.pexels.com/photos/1144275/pexels-photo-1144275.jpeg?auto=compress&cs=tinysrgb&w=400',
          duration: 1200,
          views: 8500,
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          owner: {
            username: 'reactmaster',
            fullName: 'React Master'
          }
        },
        {
          _id: 'related2',
          title: 'JavaScript ES6+ Features',
          thumbnail: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400',
          duration: 900,
          views: 12300,
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          owner: {
            username: 'jsexpert',
            fullName: 'JS Expert'
          }
        }
      ];
      
      setRelatedVideos(mockRelatedVideos);
      
      // Uncomment when you have the related videos API endpoint
      // const response = await api.get(`/videos/related/${videoId}`);
      // setRelatedVideos(response.data.data);
    } catch (error) {
      console.error('Error fetching related videos:', error);
    }
  };

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to subscribe');
      return;
    }

    try {
      if (isSubscribed) {
        // Unsubscribe
        await api.post(`/subscriptions/unsubscribe/${video.owner._id}`);
        setIsSubscribed(false);
        setSubscribersCount(prev => prev - 1);
        toast.success('Unsubscribed successfully');
      } else {
        // Subscribe
        await api.post(`/subscriptions/subscribe/${video.owner._id}`);
        setIsSubscribed(true);
        setSubscribersCount(prev => prev + 1);
        toast.success('Subscribed successfully');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to update subscription');
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like videos');
      return;
    }

    try {
      if (isLiked) {
        // Remove like
        await api.delete(`/videos/${videoId}/like`);
        setIsLiked(false);
      } else {
        // Add like
        await api.post(`/videos/${videoId}/like`);
        setIsLiked(true);
        setIsDisliked(false);
      }
    } catch (error) {
      console.error('Like error:', error);
      toast.error('Failed to update like');
    }
  };

  const handleDislike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to dislike videos');
      return;
    }

    try {
      if (isDisliked) {
        // Remove dislike
        await api.delete(`/videos/${videoId}/dislike`);
        setIsDisliked(false);
      } else {
        // Add dislike
        await api.post(`/videos/${videoId}/dislike`);
        setIsDisliked(true);
        setIsLiked(false);
      }
    } catch (error) {
      console.error('Dislike error:', error);
      toast.error('Failed to update dislike');
    }
  };

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const formatSubscribers = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Video not found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Video Player */}
        <VideoPlayer src={video.videoFile} poster={video.thumbnail} />

        {/* Video Info */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">{video.title}</h1>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="text-sm text-gray-600">
              {formatViews(video.views)} views • {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                  isLiked 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {isLiked ? (
                  <HandThumbUpSolidIcon className="h-5 w-5" />
                ) : (
                  <HandThumbUpIcon className="h-5 w-5" />
                )}
                <span>{video.likes}</span>
              </button>
              
              <button
                onClick={handleDislike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                  isDisliked 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {isDisliked ? (
                  <HandThumbDownSolidIcon className="h-5 w-5" />
                ) : (
                  <HandThumbDownIcon className="h-5 w-5" />
                )}
                <span>{video.dislikes}</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors">
                <ShareIcon className="h-5 w-5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Channel Info */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-4">
            <Link to={`/channel/${video.owner.username}`}>
              <img
                src={video.owner.avatar}
                alt={video.owner.fullName}
                className="h-12 w-12 rounded-full object-cover"
              />
            </Link>
            <div>
              <Link 
                to={`/channel/${video.owner.username}`}
                className="font-semibold text-gray-900 hover:text-primary-600"
              >
                {video.owner.fullName}
              </Link>
              <p className="text-sm text-gray-600">
                {formatSubscribers(subscribersCount)} subscribers
              </p>
            </div>
          </div>
          
          {isAuthenticated && user?._id !== video.owner._id && (
            <button
              onClick={handleSubscribe}
              className={`flex items-center space-x-2 px-6 py-2 rounded-full font-medium transition-colors ${
                isSubscribed
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {isSubscribed ? (
                <>
                  <UserMinusIcon className="h-5 w-5" />
                  <span>Subscribed</span>
                </>
              ) : (
                <>
                  <UserPlusIcon className="h-5 w-5" />
                  <span>Subscribe</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Description */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{video.description}</p>
        </div>

        {/* Comments Section */}
        <CommentSection videoId={videoId} />
      </div>

      {/* Sidebar - Related Videos */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Related Videos</h3>
        <div className="space-y-4">
          {relatedVideos.map((relatedVideo) => (
            <div key={relatedVideo._id} className="flex space-x-3">
              <Link to={`/watch/${relatedVideo._id}`} className="flex-shrink-0">
                <img
                  src={relatedVideo.thumbnail}
                  alt={relatedVideo.title}
                  className="w-40 h-24 object-cover rounded-lg"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/watch/${relatedVideo._id}`}>
                  <h4 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-primary-600">
                    {relatedVideo.title}
                  </h4>
                </Link>
                <Link 
                  to={`/channel/${relatedVideo.owner.username}`}
                  className="text-xs text-gray-600 hover:text-primary-600 mt-1 block"
                >
                  {relatedVideo.owner.fullName}
                </Link>
                <div className="text-xs text-gray-500 mt-1">
                  {formatViews(relatedVideo.views)} views • {formatDistanceToNow(new Date(relatedVideo.createdAt), { addSuffix: true })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Watch;