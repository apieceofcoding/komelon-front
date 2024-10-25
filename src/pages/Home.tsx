import { useState, useEffect } from "react";
import { Post as PostType } from "../types/post";
import Post from "../components/Post";
import PostComposer from "../components/PostComposer";

const Home = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: 실제 API 연동
    const fetchPosts = async () => {
      try {
        // 임시 데이터
        const mockPosts: PostType[] = [
          {
            id: "1",
            content: "첫 번째 게시물입니다!",
            author: {
              id: "1",
              username: "user1",
              displayName: "사용자1",
              profileUrl: "https://i.ibb.co/MV9cG2N/default-profile.webp",
            },
            createdAt: new Date().toISOString(),
            likes: 5,
            shares: 2,
            comments: 1,
          },
          // 더 많은 목업 데이터 추가 가능
        ];
        setPosts(mockPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handlePost = async (content: string) => {
    // TODO: 실제 API 연동
    const newPost: PostType = {
      id: Date.now().toString(),
      content,
      author: {
        id: "1",
        username: "user1",
        displayName: "사용자1",
        profileUrl: "https://i.ibb.co/dWGtjjS/komelon.png",
      },
      createdAt: new Date().toISOString(),
      likes: 0,
      shares: 0,
      comments: 0,
    };

    setPosts((prev) => [newPost, ...prev]);
  };

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked,
            }
          : post
      )
    );
  };

  const handleShare = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              shares: post.isShared ? post.shares - 1 : post.shares + 1,
              isShared: !post.isShared,
            }
          : post
      )
    );
  };

  const handleComment = (postId: string) => {
    // TODO: 댓글 기능 구현
    console.log("Comment on post:", postId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PostComposer onPost={handlePost} />
      <div className="divide-y divide-gray-200">
        {posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            onLike={handleLike}
            onShare={handleShare}
            onComment={handleComment}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
