import { useEffect, useState } from "react";
import "./BannerSlider.css";
import { Link } from "react-router-dom";

import banner1 from "../../../../assets/banner1.png";
import banner2 from "../../../../assets/banner2.png";
import banner3 from "../../../../assets/banner3.png";
import banner4 from "../../../../assets/banner4.png";

const banners = [
  { id: 1, image: banner1, link: "/products" },
  { id: 2, image: banner2, link: "/products" },
  { id: 3, image: banner3, link: "/products" },
  { id: 4, image: banner4, link: "/products" },
];

function BannerSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <section className="banner-slider">
      <div className="slider-wrapper">

        {banners.map((item, i) => (
          <Link
            key={item.id}
            to={item.link}
            className={`slide ${i === index ? "active" : ""}`}
          >
            <img src={item.image} alt={`Banner ${item.id}`} />
          </Link>
        ))}

        <div className="banner-dots">
          {banners.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === index ? "active" : ""}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>

        <button className="nav prev" onClick={prevSlide}>‹</button>
        <button className="nav next" onClick={nextSlide}>›</button>

      </div>
    </section>
  );
}

export default BannerSlider;
