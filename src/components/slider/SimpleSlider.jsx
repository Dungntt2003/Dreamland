import React, { useState, useEffect } from "react";

const SimpleSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [
    "https://i.pinimg.com/736x/18/be/1f/18be1f7af1db345172b4096613fef6a2.jpg",
    "https://i.pinimg.com/736x/9d/6b/af/9d6baf6d9fbc4aa810f9f78b8f42616a.jpg",
    "https://i.pinimg.com/736x/e4/24/10/e424107bec570f1c5089a265f669057f.jpg",
    "https://i.pinimg.com/736x/f5/dc/de/f5dcde257dc627bfdb51acfed2d8b111.jpg",
    "https://i.pinimg.com/736x/18/f8/64/18f8646e29c3c763ea60934b76ef53f8.jpg",
  ];

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="image-slider">
      <div className="slider-container">
        {images.map((image, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? "active" : ""}`}
          >
            <img src={image} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </div>

      <button className="arrow-btn prev-btn" onClick={prevSlide}>
        &#8249;
      </button>
      <button className="arrow-btn next-btn" onClick={nextSlide}>
        &#8250;
      </button>

      <div className="dots-nav">
        {images.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      <style jsx>{`
        .image-slider {
          width: 100%;
          height: 500px;
          position: relative;
          overflow: hidden;
          background: #000;
        }

        .slider-container {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 0.6s ease-in-out;
        }

        .slide.active {
          opacity: 1;
        }

        .slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .arrow-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.8);
          border: none;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          font-size: 24px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
          color: #333;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .arrow-btn:hover {
          background: rgba(255, 255, 255, 1);
          transform: translateY(-50%) scale(1.1);
        }

        .prev-btn {
          left: 20px;
        }

        .next-btn {
          right: 20px;
        }

        .dots-nav {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 10;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .dot:hover {
          background: rgba(255, 255, 255, 0.6);
        }

        .dot.active {
          background: rgba(255, 255, 255, 1);
        }

        @media (max-width: 768px) {
          .image-slider {
            height: 300px;
          }

          .arrow-btn {
            width: 40px;
            height: 40px;
            font-size: 20px;
          }

          .prev-btn {
            left: 10px;
          }

          .next-btn {
            right: 10px;
          }
        }

        @media (max-width: 480px) {
          .image-slider {
            height: 250px;
          }

          .arrow-btn {
            width: 35px;
            height: 35px;
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
};

export default SimpleSlider;
