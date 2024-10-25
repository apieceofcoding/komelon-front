import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { IMAGES } from "../contants";

interface PostComposerProps {
  onPost: (content: string) => Promise<void>;
}

const PostComposer = ({ onPost }: PostComposerProps) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onPost(content);
      setContent("");
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    adjustHeight();
  };

  useEffect(() => {
    adjustHeight();
  }, [content]);

  return (
    <div className="border-b border-gray-200 p-4">
      <div className="flex space-x-3">
        <img
          className="h-10 w-10 rounded-full"
          src={user?.profileUrl || IMAGES.DEFAULT_PROFILE}
          alt={user?.displayName || "사용자"}
        />
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <textarea
              ref={textareaRef}
              className="w-full border-0 focus:ring-0 text-lg placeholder-gray-500 resize-none p-4"
              placeholder="무슨 생각을 하고 계신가요?"
              value={content}
              onChange={handleChange}
              rows={1}
            />
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2 text-gray-500">
                {/* 이미지 업로드 등 부가 기능 추가 가능 */}
              </div>
              <button
                type="submit"
                disabled={!content.trim() || isSubmitting}
                className={`px-4 py-2 rounded-full font-bold ${
                  content.trim() && !isSubmitting
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-blue-300 text-white cursor-not-allowed"
                }`}
              >
                게시하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostComposer;
