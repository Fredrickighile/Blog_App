import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { FiCalendar, FiUser, FiTag, FiArrowRight } from "react-icons/fi";
import { FaSearch, FaPenAlt } from "react-icons/fa";
import moment from "moment";

function Home() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const cat = useLocation().search;
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `https://blog-app-sable-three.vercel.app/api/posts${cat}`
        );
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Could not load posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [cat]);

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getText(post.desc).toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-12 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse border border-gray-100"
              >
                <div className="h-56 bg-gradient-to-r from-gray-100 to-gray-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-200 rounded-full w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded-full w-full"></div>
                  <div className="h-4 bg-gray-200 rounded-full w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded-full w-2/3"></div>
                  <div className="h-10 bg-gray-200 rounded-full w-1/3 mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-32 pb-12 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-2xl mx-auto border border-gray-100">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Error Loading Posts
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:opacity-90 transition-opacity font-medium shadow-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-12 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Hero Section */}
        <div className="mb-16 text-center pt-8">
          {" "}
          {/* Added pt-8 here for extra spacing */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Welcome to Our Fred Blog
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover insightful articles, creative stories, and professional
            advice
          </p>
          {/* Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="mt-6">
            <Link
              to="/write"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:opacity-90 transition-opacity font-medium shadow-sm"
            >
              <FaPenAlt className="mr-2" />
              Write a Post
            </Link>
          </div>
        </div>

        {cat && (
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {cat.split("=")[1].charAt(0).toUpperCase() +
                cat.split("=")[1].slice(1)}{" "}
              Posts
            </h1>
            <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
          </div>
        )}

        {filteredPosts.length > 0 ? (
          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                variants={item}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-100 group"
              >
                <div className="relative aspect-video overflow-hidden">
                  {post.img ? (
                    <LazyLoadImage
                      src={`/upload/${post.img}`}
                      alt={post.title}
                      effect="blur"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <FiCalendar className="text-blue-500" />
                      {moment(post.date).format("MMM D, YYYY")}
                    </span>
                    {post.username && (
                      <span className="flex items-center gap-1">
                        <FiUser className="text-blue-500" />
                        {post.username}
                      </span>
                    )}
                    {post.category && (
                      <span className="flex items-center gap-1">
                        <FiTag className="text-blue-500" />
                        <Link
                          to={`/?cat=${post.category}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {post.category}
                        </Link>
                      </span>
                    )}
                  </div>

                  <Link to={`/post/${post.id}`}>
                    <h2 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors mb-3 line-clamp-2">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {getText(post.desc)}
                  </p>

                  <Link
                    to={`/post/${post.id}`}
                    className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors group mt-2"
                  >
                    Read more
                    <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-8 max-w-2xl mx-auto text-center border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {searchQuery ? "No matching posts found" : "No posts found"}
            </h2>
            <p className="text-gray-600 mb-6">
              {cat
                ? "Try browsing a different category"
                : searchQuery
                ? "Try a different search term"
                : "Be the first to create a post!"}
            </p>
            <Link
              to="/write"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:opacity-90 transition-opacity font-medium shadow-sm"
            >
              Create a post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
