import React from "react";
import { Link } from "react-router-dom";
import { FiGithub, FiLinkedin, FiHeart } from "react-icons/fi";
import { motion } from "framer-motion";

function Footer() {
  const currentYear = new Date().getFullYear();

  const categories = [
    { name: "Art", path: "art" },
    { name: "Technology", path: "technology" },
    { name: "Food", path: "food" },
    { name: "Design", path: "design" },
    { name: "Cinema", path: "cinema" },
    { name: "Science", path: "science" },
  ];

  return (
    <footer className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand Section */}
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/" className="inline-block mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">F</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Fred Blog
                  </h3>
                </div>
              </div>
            </Link>
            <p className="text-gray-600 leading-relaxed mb-4">
              Discover insightful articles, creative stories, and professional
              advice on cutting-edge technology and innovation.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 text-sm">
              <span>&copy; {currentYear} Fred Blog. All rights reserved.</span>
            </div>
          </motion.div>

          {/* Categories Section */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-xl font-bold text-gray-800 mb-6">
              Explore Categories
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category, index) => (
                <motion.div
                  key={category.path}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Link
                    to={`/?cat=${category.path}`}
                    className="block px-4 py-3 bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 hover:border-blue-200 text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium hover:scale-105"
                  >
                    {category.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Connect Section */}
          <motion.div
            className="text-center md:text-right"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-xl font-bold text-gray-800 mb-6">
              Connect With Me
            </h4>
            <div className="flex justify-center md:justify-end gap-4 mb-6">
              <motion.a
                href="https://www.linkedin.com/in/fredrick-ighile-968403280/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 hover:border-blue-200 flex items-center justify-center text-gray-600 hover:text-blue-700 transition-all duration-300"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiLinkedin className="text-xl" />
              </motion.a>
              <motion.a
                href="https://github.com/Fredrickighile"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 hover:border-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-300"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiGithub className="text-xl" />
              </motion.a>
            </div>

            <div className="text-center md:text-right">
              <p className="inline-flex items-center gap-2 text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                Made with <FiHeart className="text-red-500" /> for the community
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          className="border-t border-gray-200 mt-8 pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
              <Link
                to="/privacy"
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                Terms of Service
              </Link>
              <Link
                to="/contact"
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                Contact
              </Link>
            </div>

            <div className="text-center md:text-right">
              <p className="text-gray-500 text-sm">
                Building the future of digital storytelling
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

export default Footer;
