import { useParams } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

function ProductDetail() {
  const { id } = useParams();

  return (
    <>
      <Header />
      <h2>Chi tiết sản phẩm #{id}</h2>
      <p>Mô tả trái cây...</p>
      <Footer />
    </>
  );
}

export default ProductDetail;
