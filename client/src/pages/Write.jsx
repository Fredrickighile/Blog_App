import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { AuthContext } from "../Context/authContext";
import { motion } from "framer-motion";
import { FiUpload, FiSave, FiX, FiImage, FiCheckCircle } from "react-icons/fi";
import { FaPenAlt } from "react-icons/fa";

// Configure axios defaults for all requests
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "https://blog-app-sable-three.vercel.app";

const Write = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const state = useLocation().state;

  const [title, setTitle] = useState(state?.title || "");
  const [value, setValue] = useState(state?.desc || "");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(
    state?.img ? `${axios.defaults.baseURL}/upload/${state.img}` : null
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
    document.title = state ? "Edit Post | Blog" : "Create Post | Blog";
    return () => {
      document.title = "Blog";
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
    setDragActive(e.type === "dragenter" || e.type === "dragover");
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

      const res = await axios.post("/api/upload", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      });
      return res.data.filename;
    } catch (err) {
      console.error("Upload error:", err);
      throw err.response?.data?.error || "Image upload failed";
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

      const postData = {
        title,
        desc: value,
        cat,
        img: imgUrl,
        date: new Date().toISOString(),
      };

      if (state) {
        await axios.put(`/api/posts/${state.id}`, postData, {
          withCredentials: true,
        });
      } else {
        await axios.post("/api/posts/", postData, {
          withCredentials: true,
        });
      }

      navigate("/");
    } catch (err) {
      console.error("Submission error:", err);
      setError(
        err.message ||
          err.response?.data?.message ||
          "An error occurred while saving the post"
      );
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
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-8 mt-20 pb-20 lg:pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                {state ? "Edit Post" : "Create a New Post"}
              </h1>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="flex flex-col mb-6">
                  <label
                    htmlFor="title"
                    className="mb-2 text-gray-700 font-medium"
                  >
                    Post Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-lg"
                  />
                </div>

                <div
                  className={`mb-6 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                    dragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-400"
                  }`}
                  onClick={handleClick}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
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
                        className="w-full h-48 sm:h-64 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full text-red-600 hover:text-red-700 transition-colors shadow-sm"
                      >
                        <FiX size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="py-8">
                      <FiImage className="mx-auto text-4xl text-gray-400 mb-3" />
                      <p className="text-gray-600">
                        <span className="font-medium text-blue-600">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-gray-500 text-sm mt-2">
                        PNG, JPG or WEBP (max. 2MB)
                      </p>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <label className="mb-2 block text-gray-700 font-medium">
                    Post Content
                  </label>
                  <div className="editor-container border border-gray-200 rounded-lg overflow-hidden">
                    <ReactQuill
                      className="h-64 bg-white"
                      theme="snow"
                      value={value}
                      onChange={setValue}
                      modules={modules}
                      placeholder="Write something amazing..."
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 col-span-1">
            <div className="lg:sticky lg:top-8 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Publish
                </h2>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiCheckCircle className="text-green-500" />
                    <span>
                      {state ? "Update an existing post" : "Create a new post"}
                    </span>
                  </div>

                  {loading && progress > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2.5 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  )}

                  {/* Desktop Publish Button */}
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium shadow-sm flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-white"
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
                          <FaPenAlt />
                          {state ? "Update Post" : "Publish Post"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Category
                </h2>
                <div className="mt-4 space-y-3">
                  {categories.map((category) => (
                    <div key={category.value} className="flex items-center">
                      <input
                        type="radio"
                        name="cat"
                        id={category.value}
                        value={category.value}
                        checked={cat === category.value}
                        onChange={(e) => setCat(e.target.value)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label
                        htmlFor={category.value}
                        className="ml-3 cursor-pointer text-gray-700"
                      >
                        {category.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Publish Button - Fixed at bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-10">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:opacity-90 transition-opacity font-medium shadow-sm flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
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
              Saving...
            </>
          ) : (
            <>
              <FaPenAlt />
              Publish Post
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Write;
