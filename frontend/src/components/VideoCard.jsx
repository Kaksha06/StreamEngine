import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const VideoCard = ({ video }) => {
  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <Link to={`/watch/${video._id}`} className="block">
        <div className="relative">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video.duration)}
          </div>
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/watch/${video._id}`}>
          <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-primary-600 transition-colors">
            {video.title}
          </h3>
        </Link>
        
        <Link 
          to={`/channel/${video.owner?.username}`}
          className="text-sm text-gray-600 hover:text-primary-600 mt-2 block"
        >
          {video.owner?.fullName}
        </Link>
        
        <div className="flex items-center text-sm text-gray-500 mt-1 space-x-2">
          <span>{formatViews(video.views)} views</span>
          <span>•</span>
          <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;