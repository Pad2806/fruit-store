import BannerSlider from "../components/banner/BannerSlider";
import FeaturedProducts from "../components/featured_product/FeaturedProducts";

import banner1 from "../assets/banner1.png";
import banner2 from "../assets/banner2.png";
import banner3 from "../assets/banner3.png";
import banner4 from "../assets/banner4.png";

const homeBanners = [
  { image: banner1, link: "/products" },
  { image: banner2, link: "/products" },
  { image: banner3, link: "/products" },
  { image: banner4, link: "/products" },
];

function Home() {
  return (
    <>
      <BannerSlider banners={homeBanners} />
      <FeaturedProducts />
    </>
  );
}

export default Home;
