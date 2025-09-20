import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import {
  FiCalendar,
  FiUser,
  FiTag,
  FiArrowRight,
  FiTrendingUp,
  FiClock,
  FiEye,
} from "react-icons/fi";
import { FaSearch, FaPenAlt, FaRocket, FaStar } from "react-icons/fa";
import moment from "moment";

function Home() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredPosts, setFeaturedPosts] = useState([]);
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
        // Set featured posts as the first 3 posts
        setFeaturedPosts(res.data.slice(0, 3));
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
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const heroVariant = {
    hidden: { opacity: 0, y: 50 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
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
      <div className="min-h-screen pt-20 pb-12 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Hero Skeleton */}
          <div className="text-center pt-16 pb-20">
            <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl w-96 mx-auto mb-6 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-full w-2/3 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-full w-1/2 mx-auto mb-8 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-full w-80 mx-auto mb-6 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-full w-40 mx-auto animate-pulse"></div>
          </div>

          {/* Posts Grid Skeleton */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl shadow-sm overflow-hidden animate-pulse border border-gray-100"
              >
                <div className="h-56 bg-gradient-to-r from-gray-100 to-gray-200"></div>
                <div className="p-8 space-y-4">
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  </div>
                  <div className="h-7 bg-gray-200 rounded-xl w-full"></div>
                  <div className="h-5 bg-gray-200 rounded-lg w-full"></div>
                  <div className="h-5 bg-gray-200 rounded-lg w-4/5"></div>
                  <div className="h-10 bg-gray-200 rounded-full w-32 mt-6"></div>
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
      <div className="min-h-screen pt-20 pb-12 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="bg-white p-12 rounded-3xl shadow-lg text-center max-w-2xl mx-auto border border-red-100 mt-20">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiTrendingUp className="text-red-500 text-2xl" />
            </div>
            <h2 className="text-3xl font-bold text-red-600 mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 mb-8 text-lg">{error}</p>
            <motion.button
              onClick={() => window.location.reload()}
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl hover:shadow-lg transition-all duration-300 font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Enhanced Hero Section */}
        <motion.div
          className="text-center pt-16 pb-20"
          variants={heroVariant}
          initial="hidden"
          animate="show"
        >
          <div className="relative">
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 bg-clip-text text-transparent">
                Welcome to
              </span>
              <br />
              <span className="relative">
                Fred Blog
                <motion.div
                  className="absolute -inset-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-3xl -z-10"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                />
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Discover{" "}
              <span className="text-blue-600 font-semibold">
                insightful articles
              </span>
              ,
              <span className="text-indigo-600 font-semibold">
                {" "}
                creative stories
              </span>
              , and
              <span className="text-blue-700 font-semibold">
                {" "}
                professional advice
              </span>{" "}
              on cutting-edge cybersecurity, ethical hacking, and
              next-generation technology strategies.
            </motion.p>

            {/* Enhanced Search Bar */}
            <motion.div
              className="max-w-3xl mx-auto relative mb-10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 text-xl" />
              </div>
              <input
                type="text"
                placeholder="Search for amazing articles..."
                className="w-full pl-16 pr-6 py-5 text-lg rounded-3xl border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 shadow-lg bg-white/80 backdrop-blur-sm transition-all duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-2 top-2 bottom-2">
                <button className="h-full px-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:shadow-lg transition-all duration-300 font-semibold">
                  Search
                </button>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Link
                to="/write"
                className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-semibold text-lg group"
              >
                <FaPenAlt className="text-xl group-hover:rotate-12 transition-transform duration-300" />
                Start Writing Today
                <FaRocket className="text-xl group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              className="absolute top-10 left-10 w-20 h-20 bg-blue-100 rounded-full opacity-60"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute top-32 right-20 w-16 h-16 bg-indigo-100 rounded-full opacity-40"
              animate={{
                y: [0, 15, 0],
                x: [0, 10, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </div>
        </motion.div>

        {/* Category Header */}
        {cat && (
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-3 bg-white rounded-2xl px-8 py-4 shadow-lg border border-blue-100">
              <FiTag className="text-blue-500 text-xl" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {cat.split("=")[1].charAt(0).toUpperCase() +
                  cat.split("=")[1].slice(1)}{" "}
                <span className="text-blue-600">Posts</span>
              </h1>
              <FaStar className="text-yellow-500 text-xl" />
            </div>
          </motion.div>
        )}

        {/* Featured Posts Section */}
        {!cat && !searchQuery && featuredPosts.length > 0 && (
          <motion.div
            className="mb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                <span className="text-blue-600">Featured</span> Stories
              </h2>
              <div className="w-24 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  className="relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                      <FaStar className="text-yellow-300" />
                      Featured
                    </span>
                  </div>

                  <div className="h-64 overflow-hidden relative">
                    {post.img ? (
                      <LazyLoadImage
                        src={
                          typeof post.img === "string" &&
                          post.img.startsWith("{")
                            ? JSON.parse(post.img).url ||
                              JSON.parse(post.img).filename
                            : post.img.startsWith("http")
                            ? post.img
                            : `/upload/${post.img}`
                        }
                        alt={post.title}
                        effect="blur"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                        <FiEye className="text-blue-500 text-4xl" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <div className="p-8">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                        <FiCalendar className="text-blue-500" />
                        {moment(post.date).format("MMM D, YYYY")}
                      </span>
                      {post.username && (
                        <span className="flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full">
                          <FiUser className="text-indigo-500" />
                          {post.username}
                        </span>
                      )}
                    </div>

                    <Link to={`/post/${post.id}`} className="block mb-4">
                      <h3 className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors leading-tight line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                      {getText(post.desc)}
                    </p>

                    <Link
                      to={`/post/${post.id}`}
                      className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors group"
                    >
                      Read Full Story
                      <FiArrowRight className="transition-transform group-hover:translate-x-2" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Main Posts Grid */}
        {filteredPosts.length > 0 ? (
          <motion.div
            className="space-y-12"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {!cat && !searchQuery && (
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Latest <span className="text-blue-600">Articles</span>
                </h2>
                <div className="w-20 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
              </div>
            )}

            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {(searchQuery || cat
                ? filteredPosts
                : filteredPosts.slice(3)
              ).map((post, index) => (
                <motion.article
                  key={post.id}
                  variants={item}
                  className="bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 group transform hover:-translate-y-2"
                >
                  <div className="h-64 overflow-hidden relative">
                    {post.img ? (
                      <LazyLoadImage
                        src={
                          typeof post.img === "string" &&
                          post.img.startsWith("{")
                            ? JSON.parse(post.img).url ||
                              JSON.parse(post.img).filename
                            : post.img.startsWith("http")
                            ? post.img
                            : `/upload/${post.img}`
                        }
                        alt={post.title}
                        effect="blur"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <FiEye className="text-gray-400 text-3xl" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <motion.div
                        className="w-3 h-3 bg-green-400 rounded-full"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
                      <motion.span
                        className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-full"
                        whileHover={{ scale: 1.05 }}
                      >
                        <FiClock className="text-blue-500" />
                        {moment(post.date).fromNow()}
                      </motion.span>
                      {post.username && (
                        <motion.span
                          className="flex items-center gap-2 bg-indigo-50 px-3 py-2 rounded-full"
                          whileHover={{ scale: 1.05 }}
                        >
                          <FiUser className="text-indigo-500" />
                          {post.username}
                        </motion.span>
                      )}
                      {post.category && (
                        <Link
                          to={`/?cat=${post.category}`}
                          className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 rounded-full hover:from-blue-100 hover:to-indigo-100 transition-colors"
                        >
                          <FiTag className="text-blue-500" />
                          <span className="capitalize text-blue-700 font-medium">
                            {post.category}
                          </span>
                        </Link>
                      )}
                    </div>

                    <Link to={`/post/${post.id}`} className="block mb-4">
                      <h2 className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors leading-tight line-clamp-2 mb-3">
                        {post.title}
                      </h2>
                    </Link>

                    <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed text-lg">
                      {getText(post.desc)}
                    </p>

                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 17,
                      }}
                    >
                      <Link
                        to={`/post/${post.id}`}
                        className="inline-flex items-center gap-3 text-blue-600 font-semibold hover:text-blue-800 transition-colors text-lg group"
                      >
                        Continue Reading
                        <FiArrowRight className="text-xl transition-transform group-hover:translate-x-2" />
                      </Link>
                    </motion.div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="bg-white rounded-3xl shadow-lg p-12 max-w-2xl mx-auto text-center border border-gray-100"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaPenAlt className="text-blue-500 text-3xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              {searchQuery ? "No matching posts found" : "No posts found"}
            </h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              {cat
                ? "Try browsing a different category or explore our featured content"
                : searchQuery
                ? "Try a different search term or browse our categories"
                : "Be the first to share your amazing story with the world!"}
            </p>
            <Link
              to="/write"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold text-lg"
            >
              <FaPenAlt className="text-xl" />
              Create Your First Post
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Home;
