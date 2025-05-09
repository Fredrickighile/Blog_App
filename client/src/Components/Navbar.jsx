import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/authContext";
import { FiMenu, FiX, FiEdit, FiLogOut, FiLogIn } from "react-icons/fi";
import { FaPenAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import logo1 from "../img/logo1.png";

function Navbar() {
  const { currentUser, logout } = useContext(AuthContext) || {};
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
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

  return (
    <nav
      className={`fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {" "}
          {/* Increased height */}
          {/* Logo Section - More prominent */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              {/* <motion.img
                src={logo1}
                alt="Fred Blog Logo"
                className="h-12" // Increased size
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              /> */}
              <motion.span
                className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Fred Blog
              </motion.span>
            </Link>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.path}
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors px-2 py-1 rounded-lg hover:bg-blue-50"
              >
                {category.name}
              </Link>
            ))}

            {currentUser ? (
              <div className="flex items-center space-x-4 ml-4">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium text-sm">
                  {currentUser.username}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600 text-sm px-3 py-1 rounded-lg hover:bg-blue-50"
                >
                  <FiLogOut className="text-sm" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                className="flex items-center gap-1 text-gray-600 hover:text-blue-600 text-sm px-3 py-1 rounded-lg hover:bg-blue-50"
                to="/login"
              >
                <FiLogIn className="text-sm" />
                <span>Login</span>
              </Link>
            )}

            <Link
              to="/write"
              className="ml-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full p-2 hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center"
            >
              <FaPenAlt className="text-lg" />
            </Link>
          </div>
          {/* Mobile Navigation Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 hover:text-blue-600 focus:outline-none rounded-lg hover:bg-blue-50"
            >
              {isOpen ? (
                <FiX className="text-2xl" />
              ) : (
                <FiMenu className="text-2xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-3">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  className="py-2 px-3 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  to={category.path}
                  onClick={() => setIsOpen(false)}
                >
                  {category.name}
                </Link>
              ))}

              {currentUser ? (
                <>
                  <div className="py-2 px-3 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium text-sm">
                      {currentUser.username}
                    </span>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-1 text-gray-600 hover:text-blue-600 text-sm px-3 py-1 rounded-lg hover:bg-blue-50"
                    >
                      <FiLogOut className="text-sm" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  className="py-2 px-3 flex items-center gap-1 text-gray-600 hover:text-blue-600 text-sm rounded-lg hover:bg-blue-50"
                  to="/login"
                  onClick={() => setIsOpen(false)}
                >
                  <FiLogIn className="text-sm" />
                  <span>Login</span>
                </Link>
              )}

              <Link
                className="mt-2 py-2 px-4 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:opacity-90 transition-opacity font-medium shadow-sm justify-center"
                to="/write"
                onClick={() => setIsOpen(false)}
              >
                <FaPenAlt />
                <span>Write New Post</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
