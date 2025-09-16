import React from 'react';
import { Link } from 'react-router-dom';
import { Video } from '../../types';
import { formatDistanceToNow } from 'date-fns';

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <div className="group cursor-pointer">
      <Link to={`/watch/${video._id}`}>
        <div className="relative aspect-video bg-gray-200 dark:bg-dark-700 rounded-lg overflow-hidden">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
            {formatDuration(video.duration)}
          </div>
        </div>
        
        <div className="mt-3 flex space-x-3">
          <div className="flex-shrink-0">
            <img
              src={video.owner.avatar}
              alt={video.owner.fullName}
              className="w-9 h-9 rounded-full object-cover"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400">
              {video.title}
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {video.owner.fullName}
            </p>
            
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
              <span>{formatViews(video.views)} views</span>
              <span className="mx-1">•</span>
              <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default VideoCard;