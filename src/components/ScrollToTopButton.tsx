import React, { useState, useEffect } from "react";

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <button
        onClick={scrollToTop}
        className="p-clamp-3vw bg-[#FFAFAB] border-[#FBE3DE] border-clamp-0.2vw opacity-90 aspect-square text-white rounded-full text-clamp-3vw font-primary font-bold shadow-4xl hover:opacity-70 focus:outline-none"
      >
        TOP
      </button>
    </div>
  );
};

export default ScrollToTopButton;
