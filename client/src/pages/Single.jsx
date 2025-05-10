import React, { useState, useEffect, useContext } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import Menu from "../Components/Menu";
import moment from "moment";
import { AuthContext } from "../Context/authContext";
import {
  FiEdit2,
  FiTrash2,
  FiClock,
  FiUser,
  FiTag,
  FiShare2,
  FiHeart,
  FiMessageSquare,
} from "react-icons/fi";

axios.defaults.withCredentials = true;

const Single = () => {
  const [post, setPost] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const postId = location.pathname.split("/")[2];
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `https://blog-app-sable-three.vercel.app/api/posts/${postId}`
        );
        setPost(res.data);
        setLikeCount(res.data.likes || 0);
        document.title = `${res.data.title} | Blog`;
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Could not load post");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      document.title = "Blog";
    };
  }, [postId]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(
        `https://blog-app-sable-three.vercel.app/api/posts/${postId}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/");
    } catch (err) {
      console.error("Error deleting post:", err);
      setError(err.response?.data || "An error occurred while deleting");
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => alert("Link copied to clipboard!"))
      .catch((err) => console.error("Failed to copy URL: ", err));
  };

  const formatDate = (dateString) => {
    const now = moment();
    const postDate = moment(dateString);

    // If the post was made less than 1 minute ago, show "Just now"
    if (now.diff(postDate, "seconds") < 60) {
      return "Just now";
    }

    return postDate.fromNow();
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-200 h-64 rounded-2xl animate-pulse"></div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse mb-6"></div>
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-200 rounded animate-pulse"
                  style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}
                ></div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-200 p-4 rounded-lg space-y-3 animate-pulse"
                >
                  <div className="bg-gray-300 h-48 rounded-lg"></div>
                  <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-20">
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <h2 className="text-xl font-medium text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {showDeleteModal && <DeleteModal />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20 fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Post Image */}
            {post.img && (
              <LazyLoadImage
                src={`/upload/${post.img}`}
                alt={post.title}
                effect="blur"
                className="w-full h-auto max-h-[32rem] object-cover rounded-2xl shadow-md"
              />
            )}

            {/* Post Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                {post.userImg ? (
                  <img
                    src={`/upload/${post.userImg}`}
                    alt={post.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium">
                    {post.username?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className="font-medium text-gray-800">{post.username}</h2>
                  <p className="text-gray-500 text-sm flex items-center gap-1">
                    <FiClock className="text-blue-500" />
                    {formatDate(post.date)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {post.category && (
                  <Link
                    to={`/?cat=${post.category}`}
                    className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors flex items-center gap-1"
                  >
                    <FiTag size={14} />
                    {post.category}
                  </Link>
                )}

                {currentUser?.username === post.username && (
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/write?edit=2`}
                      state={post}
                      className="p-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                      title="Edit post"
                    >
                      <FiEdit2 size={18} />
                    </Link>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                      title="Delete post"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Post Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              {post.title}
            </h1>

            {/* Post Content */}
            <article className="prose max-w-none prose-lg prose-headings:font-serif prose-p:text-gray-700 prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-lg">
              <div dangerouslySetInnerHTML={{ __html: post.desc }} />
            </article>

            {/* Post Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-6">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 ${
                    liked ? "text-red-500" : "text-gray-600 hover:text-blue-600"
                  } transition-colors`}
                >
                  <FiHeart className={liked ? "fill-current" : ""} />
                  <span>{likeCount} Likes</span>
                </button>
                <div className="flex items-center gap-2 text-gray-600">
                  <FiMessageSquare />
                  <span>Comments coming soon</span>
                </div>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <FiShare2 />
                <span>Share</span>
              </button>
            </div>

            {/* Comments Section - Coming Soon */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Comments
              </h3>
              <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg">
                <p className="font-medium">Comments feature is coming soon!</p>
                <p className="text-sm mt-1">
                  We're working on implementing comments functionality. Check
                  back later!
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Menu cat={post.category} />
          </div>
        </div>
      </div>
    </>
  );
};

const DeleteModal = ({
  post,
  setShowDeleteModal,
  isDeleting,
  handleDelete,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Post</h3>
      <p className="text-gray-600 mb-6">
        Are you sure you want to delete "{post.title}"? This action cannot be
        undone.
      </p>
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowDeleteModal(false)}
          disabled={isDeleting}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          {isDeleting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Deleting...
            </>
          ) : (
            <>
              <FiTrash2 />
              Delete
            </>
          )}
        </button>
      </div>
    </motion.div>
  </div>
);

export default Single;
