import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { FiArrowRight } from "react-icons/fi";

function Menu({ cat }) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `https://blog-app-sable-three.vercel.app/api/posts/?cat=${cat}`
        );
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching related posts:", err);
        setError("Could not load related posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [cat]);

  if (isLoading) {
    return (
      <div className="menu">
        <h1 className="text-xl font-semibold text-secondary-700 border-b border-secondary-200 pb-2 mb-4">
          Other posts you may like
        </h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-4 space-y-3 animate-pulse">
              <div className="bg-secondary-200 h-48 rounded-lg"></div>
              <div className="h-6 bg-secondary-200 rounded w-3/4"></div>
              <div className="h-8 bg-secondary-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu">
        <h1 className="text-xl font-semibold text-secondary-700 border-b border-secondary-200 pb-2 mb-4">
          Other posts you may like
        </h1>
        <div className="bg-red-50 p-4 rounded-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="menu">
      <h1 className="text-xl font-semibold text-secondary-700 border-b border-secondary-200 pb-2 mb-4">
        Other posts you may like
      </h1>
      {posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="card card-hover p-4 space-y-3"
              key={post.id}
            >
              {post.img && (
                <LazyLoadImage
                  src={`/upload/${post.img}`}
                  alt={post.title}
                  effect="blur"
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              <h2 className="text-lg font-medium text-secondary-800 line-clamp-2">
                {post.title}
              </h2>
              <Link
                to={`/post/${post.id}`}
                className="inline-flex items-center text-primary-600 font-medium hover:text-primary-800 transition-colors group"
              >
                Read More
                <FiArrowRight className="ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-secondary-500">
          No related posts found
        </div>
      )}
    </div>
  );
}

export default Menu;
