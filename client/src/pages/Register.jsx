import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiLock,
  FiArrowLeft,
  FiCheckCircle,
} from "react-icons/fi";
import { FaRocket, FaStar, FaPenAlt } from "react-icons/fa";
import axios from "axios";

function Register() {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [err, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await axios.post(
        "https://blog-app-sable-three.vercel.app/api/auth/register",
        input,
        {
          withCredentials: true,
        }
      );
      navigate("/login");
    } catch (err) {
      setError(err.response?.data || "An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <motion.div
        className="absolute top-32 right-32 w-40 h-40 bg-indigo-100 rounded-full opacity-20"
        animate={{
          y: [0, -40, 0],
          rotate: [0, -180, -360],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-32 left-32 w-28 h-28 bg-blue-100 rounded-full opacity-30"
        animate={{
          y: [0, 25, 0],
          x: [0, 15, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Left Side - Welcome Section */}
        <motion.div
          className="text-center lg:text-left space-y-8 order-2 lg:order-1"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div>
            <motion.h1
              className="text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Join the
              </span>
              <br />
              <span className="text-gray-900">Fred Blog Community</span>
            </motion.h1>

            <motion.p
              className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Start your journey as a content creator. Share your stories,
              connect with readers, and build your digital presence.
            </motion.p>
          </div>

          {/* Benefits */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-4 bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FaPenAlt className="text-green-600 text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Create & Publish</h3>
                <p className="text-gray-600 text-sm">
                  Write and share your stories with the world
                </p>
              </div>
            </div>

            {/* <div className="flex items-center gap-4 bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <FaStar className="text-purple-600 text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Build Your Audience</h3>
                <p className="text-gray-600 text-sm">
                  Connect with readers and grow your following
                </p>
              </div>
            </div> */}

            <div className="flex items-center gap-4 bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FaRocket className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Launch Your Ideas</h3>
                <p className="text-gray-600 text-sm">
                  Turn your thoughts into impactful content
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side - Register Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md mx-auto lg:mx-0 order-1 lg:order-2"
        >
          {/* Back Button */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              <FiArrowLeft />
              Back to home
            </button>
          </motion.div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
            {/* Decorative header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2"></div>

            <div className="p-8 lg:p-10">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6"
                >
                  <FaRocket className="text-white text-3xl" />
                </motion.div>

                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Create Account
                </h2>
                <p className="text-gray-600">
                  Join our community and start your blogging journey
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-4">
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400 text-lg" />
                    </div>
                    <input
                      type="text"
                      placeholder="Choose a username"
                      name="username"
                      value={input.username}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-lg"
                      required
                    />
                  </motion.div>

                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400 text-lg" />
                    </div>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      name="email"
                      value={input.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-lg"
                      required
                    />
                  </motion.div>

                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400 text-lg" />
                    </div>
                    <input
                      type="password"
                      placeholder="Create a strong password"
                      name="password"
                      value={input.password}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-lg"
                      required
                    />
                    <p className="mt-2 text-sm text-gray-500 ml-1">
                      Must be at least 8 characters long
                    </p>
                  </motion.div>

                  {err && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-red-50 border-2 border-red-200 text-red-600 p-4 rounded-2xl text-center font-medium"
                    >
                      {err}
                    </motion.div>
                  )}

                  <motion.div
                    className="flex items-start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className="flex items-center h-6">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-2 border-gray-300 rounded"
                        required
                      />
                    </div>
                    <label
                      htmlFor="terms"
                      className="ml-3 block text-gray-700 leading-relaxed"
                    >
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        Privacy Policy
                      </Link>
                    </label>
                  </motion.div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  whileHover={!isLoading ? { scale: 1.05 } : {}}
                  whileTap={!isLoading ? { scale: 0.95 } : {}}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-6 w-6 text-white"
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
                      Creating account...
                    </>
                  ) : (
                    <>
                      <FaRocket className="text-xl" />
                      Create My Account
                    </>
                  )}
                </motion.button>
              </form>

              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
              >
                <p className="text-gray-600 mb-4">
                  Already part of our community?
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-lg hover:scale-105 transition-all"
                >
                  <FiCheckCircle />
                  Sign in to your account
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;
