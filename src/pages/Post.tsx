import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Post as PostType } from "../types/post";
import { Heart, MessageCircle, Share, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Post from "../components/Post";

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
  createdAt: string;
  likes: number;
  isLiked?: boolean;
}

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostType | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        loadMoreComments();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page]);

  const loadMoreComments = async () => {
    if (isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      // TODO: 실제 API 연동
      const mockNewComments: Comment[] = Array(5)
        .fill(null)
        .map((_, index) => ({
          id: `comment-${page}-${index}`,
          content: `이것은 페이지 ${page}의 ${index + 1}번째 댓글입니다.`,
          author: {
            id: `${index + 2}`,
            username: `user${index + 2}`,
            displayName: `사용자${index + 2}`,
          },
          createdAt: new Date().toISOString(),
          likes: Math.floor(Math.random() * 10),
        }));

      setComments((prev) => [...prev, ...mockNewComments]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to load more comments:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleCommentReply = (commentId: string) => {
    // TODO: 답글 기능 구현
    setNewComment(
      `@${comments.find((c) => c.id === commentId)?.author.username} `
    );
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      // TODO: 실제 API 연동
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "방금 전";
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}분 전`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    } else if (diffInSeconds < 604800) {
      return `${Math.floor(diffInSeconds / 86400)}일 전`;
    } else {
      return date.toLocaleDateString();
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // TODO: 실제 API 연동
        // 임시 게시물 데이터
        const mockPost: PostType = {
          id: id || "1",
          content: "이것은 상세 페이지의 게시물입니다.",
          author: {
            id: "1",
            username: "user1",
            displayName: "사용자1",
          },
          createdAt: new Date().toISOString(),
          likes: 42,
          shares: 12,
          comments: 7,
        };
        setPost(mockPost);

        // 임시 댓글 데이터
        const mockComments: Comment[] = Array(7)
          .fill(null)
          .map((_, index) => ({
            id: `comment-${index + 1}`,
            content: `이것은 ${index + 1}번째 댓글입니다.`,
            author: {
              id: `${index + 2}`,
              username: `user${index + 2}`,
              displayName: `사용자${index + 2}`,
            },
            createdAt: new Date().toISOString(),
            likes: Math.floor(Math.random() * 10),
          }));
        setComments(mockComments);
      } catch (error) {
        console.error("Failed to fetch post:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // TODO: 실제 API 연동
    const newCommentObj: Comment = {
      id: `comment-${Date.now()}`,
      content: newComment,
      author: {
        id: "1",
        username: "user1",
        displayName: "사용자1",
      },
      createdAt: new Date().toISOString(),
      likes: 0,
    };

    setComments((prev) => [newCommentObj, ...prev]);
    setNewComment("");
  };

  const handleLike = (postId: string) => {
    if (!post) return;
    setPost((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
        isLiked: !prev.isLiked,
      };
    });
  };

  const handleShare = (postId: string) => {
    if (!post) return;
    setPost((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        shares: prev.isShared ? prev.shares - 1 : prev.shares + 1,
        isShared: !prev.isShared,
      };
    });
  };

  const handleCommentLike = (commentId: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
              isLiked: !comment.isLiked,
            }
          : comment
      )
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">게시물을 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* 게시물 */}
      <Post
        post={post}
        onLike={handleLike}
        onShare={handleShare}
        onComment={() => {}}
      />

      {/* 댓글 작성 폼 */}
      <div className="p-4 border-b border-gray-200">
        <form onSubmit={handleSubmitComment}>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="댓글을 작성하세요..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={!newComment.trim()}
              className={`px-4 py-2 rounded-full font-bold ${
                newComment.trim()
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-blue-300 text-white cursor-not-allowed"
              }`}
            >
              댓글 작성
            </button>
          </div>
        </form>
      </div>

      {/* 댓글 목록 */}
      <div className="divide-y divide-gray-200">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4">
            <div className="flex space-x-3">
              <img
                className="h-10 w-10 rounded-full"
                src={comment.author.avatar || "/api/placeholder/40/40"}
                alt={comment.author.displayName}
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold">
                    {comment.author.displayName}
                  </span>
                  <span className="text-gray-500">
                    @{comment.author.username}
                  </span>
                  <span className="text-gray-500">·</span>
                  <span className="text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-1">{comment.content}</p>
                <div className="mt-2 flex items-center space-x-4">
                  <button
                    onClick={() => handleCommentLike(comment.id)}
                    className={`flex items-center space-x-2 ${
                      comment.isLiked
                        ? "text-red-500"
                        : "text-gray-500 hover:text-red-500"
                    }`}
                  >
                    <Heart size={16} />
                    <span className="text-sm">{comment.likes}</span>
                  </button>
                  <button
                    onClick={() => handleCommentReply(comment.id)}
                    className="flex items-center space-x-2 text-gray-500 hover:text-blue-500"
                  >
                    <MessageCircle size={16} />
                    <span className="text-sm">답글</span>
                  </button>
                </div>
              </div>
              {comment.author.id === "1" && (
                <div className="flex items-start">
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 무한 스크롤을 위한 로딩 인디케이터 */}
      {isLoadingMore && (
        <div className="py-4 text-center text-gray-500">
          댓글 불러오는 중...
        </div>
      )}
    </div>
  );
};

export default PostDetail;
