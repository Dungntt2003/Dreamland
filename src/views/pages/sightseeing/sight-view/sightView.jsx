import "./sightView.scss";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Card, Button } from "antd";
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
  ));
  return (
    <div>
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
  );
};

export default SightView;
