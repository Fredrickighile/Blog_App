import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { AuthContext } from "../Context/authContext";
import { motion } from "framer-motion";
import { FiX, FiImage, FiCheckCircle, FiArrowLeft } from "react-icons/fi";
import { FaPenAlt, FaRocket } from "react-icons/fa";

const Write = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const state = useLocation().state;

  const [title, setTitle] = useState(state?.title || "");
  const [value, setValue] = useState(state?.desc || "");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(
    state?.img
      ? state.img.startsWith("http")
        ? state.img
        : `/upload/${state.img}`
      : null
  );
  const [cat, setCat] = useState(state?.category || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }

    document.title = state
      ? "Edit Post | Fred Blog"
      : "Create Post | Fred Blog";

    return () => {
      document.title = "Fred Blog";
    };
  }, [currentUser, navigate, state]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file) => {
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must be less than 2MB");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image file (JPG, PNG, or WEBP)");
      return;
    }

    setFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    document.getElementById("fileInput").click();
  };

  const removeImage = (e) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
  };

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        "https://blog-app-sable-three.vercel.app/api/upload",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          },
        }
      );

      let uploadedUrl = res.data;
      if (typeof uploadedUrl === "object" && uploadedUrl.url) {
        uploadedUrl = uploadedUrl.url;
      } else if (
        typeof uploadedUrl === "string" &&
        uploadedUrl.startsWith("{")
      ) {
        const parsed = JSON.parse(uploadedUrl);
        uploadedUrl = parsed.url || parsed.filename;
      }

      return uploadedUrl;
    } catch (err) {
      console.error("Error uploading file:", err);
      const errorMessage =
        err.response?.data?.message || typeof err.response?.data === "string"
          ? err.response.data
          : err.message || "Image upload failed";
      throw new Error(errorMessage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }

    if (!value.trim() || value === "<p><br></p>") {
      setError("Please enter post content");
      return;
    }

    if (!cat) {
      setError("Please select a category");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const imgUrl = file ? await upload() : state?.img || "";
      const token = localStorage.getItem("token");

      const config = {
        withCredentials: true,
        headers: {},
      };

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (state) {
        await axios.put(
          `https://blog-app-sable-three.vercel.app/api/posts/${state.id}`,
          {
            title,
            desc: value,
            cat,
            img: imgUrl,
          },
          config
        );
      } else {
        await axios.post(
          `https://blog-app-sable-three.vercel.app/api/posts/`,
          {
            title,
            desc: value,
            cat,
            img: imgUrl,
            date: new Date().toISOString(),
          },
          config
        );
      }

      navigate("/");
    } catch (err) {
      console.error("Error submitting post:", err);
      const errorMessage =
        typeof err === "string"
          ? err
          : err.response?.data?.message ||
            (typeof err.response?.data === "string"
              ? err.response.data
              : err.message || "An error occurred while saving the post");
      setError(errorMessage.toString());
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      [{ color: [] }, { background: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const categories = [
    { value: "art", label: "Art" },
    { value: "technology", label: "Technology" },
    { value: "food", label: "Food" },
    { value: "design", label: "Design" },
    { value: "cinema", label: "Cinema" },
    { value: "science", label: "Science" },
  ];

  return (
    <div className="min-h-screen pt-20 pb-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Back Button */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            <FiArrowLeft />
            Back to posts
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <motion.div
            className="lg:col-span-8 col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 mb-6">
              <div className="text-center mb-8">
                <motion.h1
                  className="text-4xl md:text-5xl font-bold mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {state ? "Edit Your" : "Create Your"}
                  </span>
                  <br />
                  <span className="text-gray-900">Masterpiece</span>
                </motion.h1>
                <motion.p
                  className="text-gray-600 text-lg max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Share your thoughts, stories, and insights with the world.
                  Every great post starts with a single word.
                </motion.p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl mb-6 text-center"
                >
                  {error.toString()}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label
                    htmlFor="title"
                    className="block text-gray-700 font-bold text-lg"
                  >
                    Post Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Enter an amazing title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-lg shadow-sm"
                  />
                </motion.div>

                <motion.div
                  className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 ${
                    dragActive
                      ? "border-blue-500 bg-blue-50 scale-105"
                      : "border-gray-200 hover:border-blue-400 hover:bg-blue-50/50"
                  }`}
                  onClick={handleClick}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="fileInput"
                    accept="image/png, image/jpeg, image/webp"
                  />

                  {preview ? (
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-lg"
                      />
                      <motion.button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 p-3 rounded-full text-white shadow-lg transition-all"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FiX size={20} />
                      </motion.button>
                    </div>
                  ) : (
                    <div className="py-12">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiImage className="text-blue-500 text-3xl" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Add a stunning cover image
                      </h3>
                      <p className="text-gray-600 mb-2">
                        <span className="font-semibold text-blue-600">
                          Click to upload
                        </span>{" "}
                        or drag and drop your image here
                      </p>
                      <p className="text-gray-500 text-sm">
                        PNG, JPG or WEBP (max. 2MB)
                      </p>
                    </div>
                  )}
                </motion.div>

                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="block text-gray-700 font-bold text-lg">
                    Tell Your Story
                  </label>
                  <div className="editor-container border-2 border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:border-blue-300 transition-colors">
                    <ReactQuill
                      className="h-80 bg-white"
                      theme="snow"
                      value={value}
                      onChange={setValue}
                      modules={modules}
                      placeholder="Start writing your amazing story here..."
                    />
                  </div>
                </motion.div>
              </form>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            className="lg:col-span-4 col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="lg:sticky lg:top-8 space-y-6">
              {/* Publish Section */}
              <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaRocket className="text-white text-2xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    Ready to Publish?
                  </h2>
                  <div className="flex items-center justify-center gap-2 text-gray-600 mb-6">
                    <FiCheckCircle className="text-green-500" />
                    <span className="font-medium">
                      {state ? "Update your post" : "Share with the world"}
                    </span>
                  </div>

                  {loading && progress > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-6 overflow-hidden">
                      <motion.div
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  )}

                  <motion.button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={!loading ? { scale: 1.05 } : {}}
                    whileTap={!loading ? { scale: 0.95 } : {}}
                  >
                    {loading ? (
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
                        {state ? "Updating..." : "Publishing..."}
                      </>
                    ) : (
                      <>
                        <FaPenAlt className="text-xl" />
                        {state ? "Update Post" : "Publish Post"}
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Category Section */}
              <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
                  Choose Category
                </h2>
                <div className="space-y-4">
                  {categories.map((category, index) => (
                    <motion.div
                      key={category.value}
                      className="flex items-center"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <input
                        type="radio"
                        name="cat"
                        id={category.value}
                        value={category.value}
                        checked={cat === category.value}
                        onChange={(e) => setCat(e.target.value)}
                        className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-2 border-gray-300"
                      />
                      <label
                        htmlFor={category.value}
                        className="ml-4 cursor-pointer text-gray-700 font-medium hover:text-blue-600 transition-colors text-lg"
                      >
                        {category.label}
                      </label>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Publish Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl z-10">
        <motion.button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl hover:shadow-xl transition-all duration-300 font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50"
          whileHover={!loading ? { scale: 1.02 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-6 w-6 text-white"
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
              Publishing...
            </>
          ) : (
            <>
              <FaPenAlt />
              Publish Post
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default Write;
