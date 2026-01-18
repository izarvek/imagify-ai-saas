import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { motion } from "motion/react";
import { AppContext } from "../context/AppContext";

const Result = () => {
  const [image, setImage] = useState(assets.sample_img_1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const { generateImages, credits } = useContext(AppContext);
   
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validation checks
    if (!input.trim()) {
      setError("Please enter a prompt");
      return;
    }

    if (credits <= 0) {
      setError("No credits available. Please buy credits.");
      return;
    }

    setLoading(true);

    const generatedImage = await generateImages(input);
    
    if (generatedImage) {
      setIsImageLoaded(true);
      setImage(generatedImage);
      setInput("");
    } else {
      setError("Failed to generate image. Try again.");
    }
    
    setLoading(false);
  };

  return (
    <motion.form
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onSubmit={onSubmitHandler}
      className="flex flex-col min-h-[90vh] justify-center items-center"
    >
      <div className="outfit-regular">
        <div className="relative">
          <img className="max-w-sm rounded" src={image} alt="Generated" />
          <span
            className={`absolute bottom-0 left-0 h-1 bg-blue-500 ${
              loading ? "w-full transition-all duration-[10s]" : "w-0"
            }`}
          ></span>
        </div>
        {loading && <p className="mt-2 text-gray-600">Loading.....</p>}
        {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
      </div>

      {!isImageLoaded && (
        <div className="flex w-full max-w-xl bg-neutral-500 text-white text-sm p-0.5 mt-10 rounded-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            disabled={loading}
            className="flex-1 bg-transparent outline-none ml-8 max-sm:w-20 placeholder-color disabled:opacity-50"
            type="text"
            placeholder="Describe what you want to generate"
          />
          <button
            disabled={loading || !input.trim() || credits <= 0}
            className="bg-zinc-900 px-10 sm:px-16 py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 transition"
            type="submit"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      )}
      
      {isImageLoaded && (
        <div className="flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full">
          <p
            onClick={() => {
              setIsImageLoaded(false);
              setError("");
            }}
            className="bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer hover:bg-gray-100 transition"
          >
            Generate Another
          </p>
          <a
            href={image}
            download
            className="bg-zinc-900 px-10 py-3 rounded-full cursor-pointer hover:bg-zinc-800 transition"
          >
            Download
          </a>
        </div>
      )}
    </motion.form>
  );
};

export default Result;