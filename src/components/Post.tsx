import { IMAGES } from "../contants";
import { Post as PostType } from "../types/post";
import { Heart, MessageCircle, Share } from "lucide-react";

interface PostProps {
  post: PostType;
  onLike: (postId: string) => void;
  onShare: (postId: string) => void;
  onComment: (postId: string) => void;
}

const Post = ({ post, onLike, onShare, onComment }: PostProps) => {
  return (
    <div className="border-b border-gray-200 p-4 hover:bg-gray-50">
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <img
            className="h-10 w-10 rounded-full"
            src={post.author.profileUrl || IMAGES.DEFAULT_PROFILE}
            alt={post.author.displayName}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="font-bold">{post.author.displayName}</span>
            <span className="text-gray-500">@{post.author.username}</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="mt-1 text-gray-900 whitespace-pre-line">
            {post.content}
          </p>
          <div className="mt-2 flex items-center space-x-8">
            <button
              onClick={() => onComment(post.id)}
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-500"
            >
              <MessageCircle size={20} />
              <span>{post.comments}</span>
            </button>
            <button
              onClick={() => onShare(post.id)}
              className={`flex items-center space-x-2 ${
                post.isShared
                  ? "text-green-500"
                  : "text-gray-500 hover:text-green-500"
              }`}
            >
              <Share size={20} />
              <span>{post.shares}</span>
            </button>
            <button
              onClick={() => onLike(post.id)}
              className={`flex items-center space-x-2 ${
                post.isLiked
                  ? "text-red-500"
                  : "text-gray-500 hover:text-red-500"
              }`}
            >
              <Heart size={20} />
              <span>{post.likes}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
