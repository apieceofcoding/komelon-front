export interface Post {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    profileUrl?: string;
  };
  createdAt: string;
  likes: number;
  shares: number;
  comments: number;
  isLiked?: boolean;
  isShared?: boolean;
}
