import "./sightView.scss";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Card, Button, Pagination as AntPagination } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

const { Meta } = Card;

const SightView = () => {
  const cardData = Array.from({ length: 10 }, (_, index) => (
    <Link to="/sight-seeing-detail" className="link">
      <Card
        hoverable
        style={{
          width: 300,
        }}
        cover={
          <img
            alt="example"
            src="https://static.vinwonders.com/production/canh-dep-da-lat-thumb.jpg"
          />
        }
      >
        <Meta
          title="Hồ Xuân Hương"
          description={
            <div>
              <FontAwesomeIcon
                icon={faLocationDot}
                style={{ marginRight: "12px" }}
              />
              Xóm 1, huyện Hữu Sơn, thành phố Đà Lạt
            </div>
          }
        />
        <Button className="button" style={{ width: "100%", marginTop: "16px" }}>
          THÊM VÀO LỘ TRÌNH
        </Button>
      </Card>
    </Link>
  ));

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cardData.slice(indexOfFirstItem, indexOfLastItem);

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };
  return (
    <div>
      <div>
        <div>DANH SÁCH ĐỀ XUẤT</div>
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={50}
          slidesPerView={4}
          navigation
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          onSwiper={(swiper) => console.log(swiper)}
          onSlideChange={() => console.log("slide change")}
          grabCursor={true}
          style={{ padding: "24px 0 32px" }}
        >
          {cardData.map((item, index) => {
            return <SwiperSlide key={index}>{item}</SwiperSlide>;
          })}
          {/* <SwiperSlide>Slide 1</SwiperSlide> */}
        </Swiper>
      </div>
      <div style={{ margin: "16px 0" }}>
        <div>DANH SÁCH YÊU THÍCH CỦA BẠN</div>
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={50}
          slidesPerView={4}
          navigation
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          onSwiper={(swiper) => console.log(swiper)}
          onSlideChange={() => console.log("slide change")}
          grabCursor={true}
          style={{ padding: "24px 0 32px" }}
        >
          {cardData.map((item, index) => {
            return <SwiperSlide key={index}>{item}</SwiperSlide>;
          })}
          {/* <SwiperSlide>Slide 1</SwiperSlide> */}
        </Swiper>
      </div>
      <div>
        <div>DANH SÁCH ĐỊA ĐIỂM ĐỀ XUẤT KHÁC</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          {currentItems.map((item, index) => item)}
        </div>
        <AntPagination
          current={currentPage}
          pageSize={itemsPerPage}
          total={cardData.length}
          onChange={handleChangePage}
          style={{ marginTop: "20px", textAlign: "center" }}
        />
      </div>
    </div>
  );
};

export default SightView;
