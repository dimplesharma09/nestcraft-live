"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Upload,
  Link2,
  X,
  Search,
  Image as ImageIcon,
  Clock,
} from "lucide-react";

export const MediaUploader = () => {
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [uploadMethod, setUploadMethod] = useState<string>("file");
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [mediaLibrary, setMediaLibrary] = useState<any[]>([
    {
      id: 1,
      name: "product-image-1.jpg",
      url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      altText: "Minimalist product photography",
      date: "2024-03-15",
      size: "245 KB",
    },
    {
      id: 2,
      name: "banner-image.jpg",
      url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      altText: "Modern headphones on white",
      date: "2024-03-14",
      size: "512 KB",
    },
    {
      id: 3,
      name: "lifestyle-shot.jpg",
      url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f",
      altText: "Sunglasses product shot",
      date: "2024-03-13",
      size: "389 KB",
    },
  ]);
  const [urlInput, setUrlInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<any>(null);

  const handleFileSelect = (e: any) => {
    const files = Array.from(e.target.files);
    const fileObjects = files.map((file: any) => ({
      file,
      name: file.name,
      altText: "",
      preview: URL.createObjectURL(file),
      size: (file.size / 1024).toFixed(0) + " KB",
      foldername: "",
    }));
    setSelectedFiles([...selectedFiles, ...fileObjects]);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const fileObjects = files.map((file: any) => ({
      file,
      name: file.name,
      altText: "",
      preview: URL.createObjectURL(file),
      size: (file.size / 1024).toFixed(0) + " KB",
      foldername: "",
    }));
    setSelectedFiles([...selectedFiles, ...fileObjects]);
  };

  const updateFileMetadata = (index: number, field: string, value: string) => {
    const updated = [...selectedFiles];
    updated[index][field] = value;
    setSelectedFiles(updated);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    const newMedia = selectedFiles.map((file: any, idx: number) => ({
      id: mediaLibrary.length + idx + 1,
      name: file.name,
      url: file.preview,
      altText: file.altText || file.name,
      date: new Date().toISOString().split("T")[0],
      file: file.file,
      foldername: file.foldername ? file.foldername : "Uncategorized",
    }));

    const formData: any = new FormData();
    for (let i of newMedia) {
      formData.append("files", i.file);
      formData.append("name", i.name);
      formData.append("altText", i.altText);
      formData.append("foldername", i.foldername);
    }

    try {
      const response = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        console.log(data.data);
        // setMediaLibrary([...data.data, ...mediaLibrary]);
        // setSelectedFiles([]);
      }
    } catch (error) {
      console.log(error);
    }

    // setMediaLibrary([...newMedia, ...mediaLibrary]);
    // setSelectedFiles([]);
  };

  const handleUrlUpload = () => {
    if (!urlInput) return;

    const newMedia = {
      id: mediaLibrary.length + 1,
      name: "Image from URL",
      url: urlInput,
      altText: "Image from URL",
      date: new Date().toISOString().split("T")[0],
      size: "N/A",
    };

    setMediaLibrary([newMedia, ...mediaLibrary]);
    setUrlInput("");
  };

  const filteredMedia = mediaLibrary.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.altText.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-neutral-50 p-6 font-['Instrument_Sans']">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap');
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-semibold text-neutral-900 mb-1">
            Media Library
          </h1>
          <p className="text-sm text-neutral-500">
            Upload and manage your images
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-1 mb-6 bg-white p-1 rounded-xl shadow-sm w-fit"
        >
          {["upload", "library"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative px-5 py-2 text-sm font-medium rounded-lg transition-colors"
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-neutral-900 rounded-lg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span
                className={`relative z-10 ${activeTab === tab ? "text-white" : "text-neutral-600"}`}
              >
                {tab === "upload" ? "Upload" : "Library"}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "upload" ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Upload Method Toggle */}
              <div className="flex gap-2 p-1 bg-neutral-100 rounded-lg w-fit">
                {[
                  { value: "file", icon: Upload, label: "Files" },
                  { value: "url", icon: Link2, label: "URL" },
                ].map(({ value, icon: Icon, label }) => (
                  <button
                    key={value}
                    onClick={() => setUploadMethod(value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      uploadMethod === value
                        ? "bg-white text-neutral-900 shadow-sm"
                        : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </div>

              {uploadMethod === "file" ? (
                <div className="space-y-4">
                  {/* Drop Zone */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() =>
                      document.getElementById("fileInput")?.click()
                    }
                    className="relative bg-white border-2 border-dashed border-neutral-200 rounded-2xl p-12 text-center cursor-pointer transition-all hover:border-neutral-400 hover:bg-neutral-50 group"
                  >
                    <input
                      id="fileInput"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <motion.div
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      className="w-16 h-16 mx-auto mb-4 bg-neutral-100 rounded-2xl flex items-center justify-center group-hover:bg-neutral-200 transition-colors"
                    >
                      <Upload
                        className="text-neutral-400 group-hover:text-neutral-600 transition-colors"
                        size={28}
                      />
                    </motion.div>
                    <p className="text-base font-medium text-neutral-900 mb-1">
                      Drop files here
                    </p>
                    <p className="text-sm text-neutral-500">
                      or click to browse • Max 100 MB
                    </p>
                  </motion.div>

                  {/* Selected Files */}
                  <AnimatePresence>
                    {selectedFiles.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3"
                      >
                        {selectedFiles.map((file, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-xl p-4 shadow-sm border border-neutral-100"
                          >
                            <div className="flex gap-4">
                              <motion.img
                                whileHover={{ scale: 1.05 }}
                                src={file.preview}
                                alt={file.name}
                                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0 space-y-3">
                                <div className="flex items-start justify-between">
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-neutral-900 truncate">
                                      {file.name}
                                    </p>
                                    <p className="text-xs text-neutral-500">
                                      {file.size}
                                    </p>
                                  </div>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => removeFile(index)}
                                    className="p-1 hover:bg-red-50 rounded-lg transition-colors"
                                  >
                                    <X
                                      size={16}
                                      className="text-neutral-400 hover:text-red-500"
                                    />
                                  </motion.button>
                                </div>
                                <input
                                  type="text"
                                  value={file.altText}
                                  onChange={(e) =>
                                    updateFileMetadata(
                                      index,
                                      "altText",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Alt text (describe the image)"
                                  className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                                />
                                <input
                                  type="text"
                                  value={file.foldername}
                                  onChange={(e) =>
                                    updateFileMetadata(
                                      index,
                                      "foldername",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Folder name"
                                  className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                                />
                              </div>
                            </div>
                          </motion.div>
                        ))}

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleUpload}
                          className="w-full py-3 bg-neutral-900 text-white rounded-xl font-medium text-sm shadow-sm hover:bg-neutral-800 transition-colors"
                        >
                          Upload {selectedFiles.length}{" "}
                          {selectedFiles.length === 1 ? "file" : "files"}
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <label className="block text-sm font-medium text-neutral-900 mb-2">
                    Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1 px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleUrlUpload}
                      className="px-6 py-3 bg-neutral-900 text-white rounded-xl font-medium text-sm hover:bg-neutral-800 transition-colors flex items-center gap-2"
                    >
                      <Link2 size={16} />
                      Insert
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="library"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Search */}
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search media"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all shadow-sm"
                />
              </div>

              {/* Media Grid */}
              <motion.div
                layout
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
              >
                <AnimatePresence>
                  {filteredMedia.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.03 }}
                      whileHover={{ y: -4 }}
                      onClick={() => setSelectedMedia(item)}
                      className="group relative bg-white rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="aspect-square overflow-hidden bg-neutral-100">
                        <motion.img
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                          src={item.url}
                          alt={item.altText}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-medium text-neutral-900 truncate mb-1">
                          {item.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                          <Clock size={12} />
                          <span>{item.size}</span>
                        </div>
                      </div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <p className="text-xs text-white font-medium">
                          Click to select
                        </p>
                      </motion.div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {filteredMedia.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 rounded-2xl flex items-center justify-center">
                    <ImageIcon className="text-neutral-400" size={28} />
                  </div>
                  <p className="text-sm text-neutral-500">No media found</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected Media Preview */}
        {/* <AnimatePresence>
          {selectedMedia && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMedia(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-neutral-900">
                    Media Details
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedMedia(null)}
                    className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </motion.button>
                </div>
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.altText}
                  className="w-full rounded-xl mb-4"
                />
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-neutral-500">Name:</span>
                    <span className="ml-2 text-neutral-900 font-medium">
                      {selectedMedia.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Alt Text:</span>
                    <span className="ml-2 text-neutral-900 font-medium">
                      {selectedMedia.altText}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Size:</span>
                    <span className="ml-2 text-neutral-900 font-medium">
                      {selectedMedia.size}
                    </span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-6 py-3 bg-neutral-900 text-white rounded-xl font-medium text-sm hover:bg-neutral-800 transition-colors"
                >
                  Insert Image
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence> */}
      </motion.div>
    </div>
  );
};
