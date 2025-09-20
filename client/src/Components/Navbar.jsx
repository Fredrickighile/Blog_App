import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/authContext";
import { FiMenu, FiX, FiEdit, FiLogOut, FiLogIn, FiUser } from "react-icons/fi";
import { FaPenAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import logo1 from "../img/logo1.png";

function Navbar() {
  const { currentUser, logout } = useContext(AuthContext) || {};
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const categories = [
    { name: "ART", path: "/?cat=art" },
    { name: "TECHNOLOGY", path: "/?cat=technology" },
    { name: "FOOD", path: "/?cat=food" },
    { name: "DESIGN", path: "/?cat=design" },
    { name: "CINEMA", path: "/?cat=cinema" },
    { name: "SCIENCE", path: "/?cat=science" },
  ];

  const navVariants = {
    scrolled: {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      borderColor: "rgba(0, 0, 0, 0.08)",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    },
    top: {
      backgroundColor: "rgba(255, 255, 255, 0.85)",
      backdropFilter: "blur(10px)",
      borderColor: "rgba(0, 0, 0, 0.05)",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
    },
  };

  return (
    <motion.nav
      className="fixed top-0 w-full z-50 border-b transition-all duration-300"
      variants={navVariants}
      animate={scrolled ? "scrolled" : "top"}
      style={{
        backgroundColor: scrolled
          ? "rgba(255, 255, 255, 0.95)"
          : "rgba(255, 255, 255, 0.85)",
        backdropFilter: scrolled ? "blur(20px)" : "blur(10px)",
        borderColor: scrolled ? "rgba(0, 0, 0, 0.08)" : "rgba(0, 0, 0, 0.05)",
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section - Enhanced */}
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link to="/" className="flex items-center gap-3">
              <motion.div
                className="relative"
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.8, type: "spring" }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <span className="text-2xl font-bold text-blue-600">Fred</span>
                <span className="text-2xl font-light text-gray-700 ml-1">
                  Blog
                </span>
              </motion.div>
            </Link>
          </motion.div>

          {/* Desktop Navigation - Enhanced */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              {categories.map((category, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Link
                    to={category.path}
                    className="relative text-sm font-medium text-gray-600 hover:text-blue-600 transition-all duration-300 px-3 py-2 rounded-lg group"
                  >
                    {category.name}
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* User Section - Enhanced */}
            <div className="flex items-center space-x-4 pl-6 border-l border-gray-200">
              {currentUser ? (
                <div className="flex items-center space-x-3">
                  <motion.div
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <FiUser className="text-white text-xs" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {currentUser.username}
                    </span>
                  </motion.div>
                  <motion.button
                    onClick={logout}
                    className="flex items-center gap-2 text-gray-500 hover:text-red-500 text-sm px-3 py-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiLogOut className="text-sm" />
                    <span>Logout</span>
                  </motion.button>
                </div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 text-sm px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium"
                    to="/login"
                  >
                    <FiLogIn className="text-sm" />
                    <span>Login</span>
                  </Link>
                </motion.div>
              )}

              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  to="/write"
                  className="ml-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 hover:shadow-lg transition-all duration-300 flex items-center justify-center group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <FaPenAlt className="text-lg relative z-10" />
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Mobile Navigation Toggle - Enhanced */}
          <div className="lg:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 text-gray-600 hover:text-blue-600 focus:outline-none rounded-xl hover:bg-blue-50 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiX className="text-2xl" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiMenu className="text-2xl" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu - Enhanced */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -20 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 overflow-hidden shadow-xl"
          >
            <div className="container mx-auto px-4 py-6 max-w-7xl">
              <motion.div
                className="flex flex-col space-y-2"
                initial="closed"
                animate="open"
                variants={{
                  closed: { opacity: 0 },
                  open: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.1,
                    },
                  },
                }}
              >
                {categories.map((category, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      closed: { opacity: 0, x: -20 },
                      open: { opacity: 1, x: 0 },
                    }}
                  >
                    <Link
                      className="block py-3 px-4 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium border border-transparent hover:border-blue-100"
                      to={category.path}
                      onClick={() => setIsOpen(false)}
                    >
                      {category.name}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  className="pt-4 border-t border-gray-100"
                  variants={{
                    closed: { opacity: 0, y: 20 },
                    open: { opacity: 1, y: 0 },
                  }}
                >
                  {currentUser ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between px-4 py-3 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <FiUser className="text-white text-sm" />
                          </div>
                          <span className="font-medium text-gray-700">
                            {currentUser.username}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            logout();
                            setIsOpen(false);
                          }}
                          className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm px-3 py-1 rounded-lg hover:bg-red-50 transition-all duration-200"
                        >
                          <FiLogOut className="text-sm" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Link
                      className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 font-medium border border-transparent hover:border-blue-100"
                      to="/login"
                      onClick={() => setIsOpen(false)}
                    >
                      <FiLogIn className="text-lg" />
                      <span>Login</span>
                    </Link>
                  )}

                  <Link
                    className="mt-4 flex items-center gap-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium justify-center py-4 px-6"
                    to="/write"
                    onClick={() => setIsOpen(false)}
                  >
                    <FaPenAlt className="text-lg" />
                    <span>Write New Post</span>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;
