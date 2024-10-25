import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Post as PostType } from "../types/post";
import { useAuth } from "../context/AuthContext";
import Post from "../components/Post";
import { IMAGES } from "../contants";

interface ProfileData {
  id: string;
  username: string;
  displayName: string;
  profileUrl?: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  joinedDate: string;
  isFollowing?: boolean;
}

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"posts" | "likes">("posts");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // TODO: 실제 API 연동
        // 임시 프로필 데이터
        const mockProfile: ProfileData = {
          id: "1",
          username: username || "user1",
          displayName: "사용자1",
          profileUrl: IMAGES.LOGO,
          bio: "안녕하세요! 반갑습니다.",
          followersCount: 100,
          followingCount: 50,
          joinedDate: "2024-01",
          isFollowing: false,
        };
        setProfile(mockProfile);

        // 임시 게시물 데이터
        const mockPosts: PostType[] = Array(5)
          .fill(null)
          .map((_, index) => ({
            id: `${index + 1}`,
            content: `${username}의 ${index + 1}번째 게시물입니다.`,
            author: mockProfile,
            createdAt: new Date().toISOString(),
            likes: Math.floor(Math.random() * 100),
            shares: Math.floor(Math.random() * 50),
            comments: Math.floor(Math.random() * 20),
          }));
        setPosts(mockPosts);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const handleFollow = async () => {
    if (!profile) return;

    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        isFollowing: !prev.isFollowing,
        followersCount: prev.isFollowing
          ? prev.followersCount - 1
          : prev.followersCount + 1,
      };
    });
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

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">프로필을 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* 프로필 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="relative">
          {/* 커버 이미지 */}
          <div className="h-48 bg-blue-100"></div>
          {/* 프로필 이미지 */}
          <div className="absolute -bottom-16 left-4">
            <img
              src={profile.profileUrl || IMAGES.DEFAULT_PROFILE}
              alt={profile.displayName}
              className="w-32 h-32 rounded-full border-4 border-white"
            />
          </div>
        </div>

        {/* 프로필 정보 */}
        <div className="pt-20 px-4 pb-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-xl font-bold">{profile.displayName}</h1>
              <div className="text-gray-500">@{profile.username}</div>
            </div>
            {user?.username !== profile.username && (
              <button
                onClick={handleFollow}
                className={`px-4 py-2 rounded-full font-bold ${
                  profile.isFollowing
                    ? "bg-white text-black border border-gray-300 hover:bg-gray-100"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {profile.isFollowing ? "팔로잉" : "팔로우"}
              </button>
            )}
          </div>

          {profile.bio && <p className="mb-4">{profile.bio}</p>}

          <div className="flex items-center space-x-4 text-gray-500 text-sm">
            <div>
              <span className="font-bold text-black">
                {profile.followingCount}
              </span>{" "}
              팔로잉
            </div>
            <div>
              <span className="font-bold text-black">
                {profile.followersCount}
              </span>{" "}
              팔로워
            </div>
            <div>
              가입일: {new Date(profile.joinedDate).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* 탭 */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 py-3 text-sm font-medium text-center ${
              activeTab === "posts"
                ? "text-black border-b-2 border-blue-500"
                : "text-gray-500 hover:text-black hover:bg-gray-50"
            }`}
          >
            게시물
          </button>
          <button
            onClick={() => setActiveTab("likes")}
            className={`flex-1 py-3 text-sm font-medium text-center ${
              activeTab === "likes"
                ? "text-black border-b-2 border-blue-500"
                : "text-gray-500 hover:text-black hover:bg-gray-50"
            }`}
          >
            좋아요
          </button>
        </div>
      </div>

      {/* 게시물 목록 */}
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

export default Profile;
