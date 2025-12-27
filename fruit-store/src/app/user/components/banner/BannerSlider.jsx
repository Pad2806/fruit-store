import { useEffect, useState } from "react";
import "./BannerSlider.css";
import { Link } from "react-router-dom";

function BannerSlider({ banners }) {
  const [index, setIndex] = useState(0);
  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % banners.length);
  };

  useEffect(() => {
    if (!banners || banners.length === 0) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners]);

  if (!banners || banners.length === 0) return null;

  return (
    <div className="banner-slider">
      <div className="slider-wrapper">
        <Link to={banners[index].link} className="slide active">
          <img src={banners[index].image} alt="Banner" />
        </Link>
      

        <button className="nav prev" onClick={prevSlide}>
          ‹
        </button>

        <button className="nav next" onClick={nextSlide}>
          ›
        </button>
        <div className="banner-dots">
          {banners.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === index ? "active" : ""}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default BannerSlider;
