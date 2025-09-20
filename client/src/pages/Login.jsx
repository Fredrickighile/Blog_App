import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiLock, FiLogIn, FiArrowLeft } from "react-icons/fi";
import { FaRocket, FaStar } from "react-icons/fa";
import { AuthContext } from "../Context/authContext.jsx";

function Login() {
  const [inputs, setInput] = useState({
    username: "",
    password: "",
  });
  const [err, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(inputs);
      navigate("/");
    } catch (err) {
      setError(err.response?.data || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 bg-blue-100 rounded-full opacity-30"
        animate={{
          y: [0, -30, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-24 h-24 bg-indigo-100 rounded-full opacity-40"
        animate={{
          y: [0, 20, 0],
          x: [0, -10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Left Side - Welcome Section */}
        <motion.div
          className="text-center lg:text-left space-y-8"
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
                Welcome Back to
              </span>
              <br />
              <span className="text-gray-900">Fred Blog</span>
            </motion.h1>

            <motion.p
              className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Continue your journey of discovery with insightful articles,
              creative stories, and cutting-edge technology insights.
            </motion.p>
          </div>

          {/* Features */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FaStar className="text-blue-600 text-xl" />
              </div> */}
            {/* <div>
                <h3 className="font-bold text-gray-800">Premium Content</h3>
                <p className="text-gray-600 text-sm">
                  Access exclusive articles
                </p>
              </div> */}
            {/* </div> */}

            <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <FaRocket className="text-indigo-600 text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Create & Share</h3>
                <p className="text-gray-600 text-sm">Publish your stories</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md mx-auto lg:mx-0"
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
                  <FiLogIn className="text-white text-3xl" />
                </motion.div>

                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Sign In
                </h2>
                <p className="text-gray-600">
                  Welcome back! Please enter your credentials
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-5">
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
                      placeholder="Username"
                      name="username"
                      value={inputs.username}
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
                      <FiLock className="text-gray-400 text-lg" />
                    </div>
                    <input
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={inputs.password}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-lg"
                      required
                    />
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
                    className="flex justify-between items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-2 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-3 block text-gray-700 font-medium"
                      >
                        Remember me
                      </label>
                    </div>
                    <Link
                      to="/forgot-password"
                      className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </motion.div>
                </div>

                <motion.button
                  type="submit"
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
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
                      Signing in...
                    </>
                  ) : (
                    <>
                      <FiLogIn className="text-xl" />
                      Sign In to Continue
                    </>
                  )}
                </motion.button>
              </form>

              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <p className="text-gray-600 mb-4">Don't have an account yet?</p>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-lg hover:scale-105 transition-all"
                >
                  Create your account
                  <FaRocket />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
