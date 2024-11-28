import "./sightDetail.scss";
import checkOpen from "utils/checkOpenTime";
import { Rating } from "react-simple-star-rating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "antd";
import { useState } from "react";
import Heart from "react-heart";
import { parseDes, parseList } from "utils/parseDescription";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { faClock, faPlaceOfWorship } from "@fortawesome/free-solid-svg-icons";
import { CaretRightOutlined } from "@ant-design/icons";
import { Collapse } from "antd";
import GoogleMapComponent from "components/google-maps/googleMaps";

const SightDetail = () => {
  window.initMap = () => {
    console.log("Google Maps API đã sẵn sàng.");
  };

  const [active, setActive] = useState(false);
  const img_url =
    "https://realbiz.vn/wp-content/uploads/2023/06/nui-Langbiang-da-lat.jpg";
  const img_quantity = 5;
  const imgData = Array.from({ length: img_quantity }, () => img_url);

  const demoData = {
    name: "Hồ Tuyền Lâm",
    address: "Phường 4, thành phố Đà Lạt, tỉnh Lâm Đồng",
    description: `Giới thiệu chung:Nhắc đến du lịch Đà Lạt người ta thường liên tưởng những vườn hoa, hồ nước, vườn thú… Tuy nhiên hãy thử 1 lần bước chân vào thế giới hoang sơ, hùng vĩ của rừng thông Đà Lạt, nơi có cây cỏ hòa quyện cùng hoa lá tạo nên một bức tranh thiên nhiên tuyệt mỹ. Hứa hẹn bạn sẽ có những trải nghiệm sâu sắc không thể nào quên.;
                Cảnh đẹp:nhà cổ Hanok Hàn quốc, khu vườn đá, trà đạo nhật bản, rừng thông đỏ nguyên sinh, đồi hoa mộng mơ, trường đua mô hình Go Kart, chèo thuyền Kayak, vườn thượng uyển Trung Hoa, làng văn hóa Tây Nguyên, thác 7 tầng, con thuyền tình yêu;
                Ẩm thực:hệ thống nhà hàng cao cấp trong khu du lịch;
`,
    image: imgData,
    rating: 4.3,
    comments: [
      {
        comment: "Oishi",
      },
      {
        comment: "yokatta",
      },
    ],
    startTime: 0,
    endTime: 24,
  };
  const [main, setMain] = useState(demoData.image[0]);
  const handleClickImg = (index, item) => {
    setMain(item);
  };
  const panelStyle = {
    marginBottom: 16,
    background: "var(--background-color)",
    borderRadius: "10px",
    border: "none",
    color: "var(--text-color)",
  };
  const parsedObject = parseDes(demoData.description);
  const getItems = (panelStyle) => {
    return Object.keys(parsedObject).map((key, index) => ({
      key: (index + 1).toString(),
      label: (
        <div style={{ fontSize: "18px", color: "var(--primary-color)" }}>
          {key}
        </div>
      ),
      children:
        key === "Cảnh đẹp" ? (
          <div>
            {parseList(parsedObject[key]).map((item, index) => (
              <div style={{ margin: "6px 0" }}>{item}</div>
            ))}
          </div>
        ) : (
          <div>{parsedObject[key]}</div>
        ),
      style: panelStyle,
    }));
  };
  return (
    <div>
      <div className="sight-detail-container">
        <div className="sight-detail-banner">
          <div className="sight-detail-name header1">{demoData.name}</div>
          <div className="sight-detail-open">
            <FontAwesomeIcon className="sight-detail-icon" icon={faClock} />
            {checkOpen(demoData.startTime, demoData.endTime) === true
              ? "Đang mở cửa"
              : "Đóng cửa"}
          </div>

          <div className="sight-detail-address">
            <FontAwesomeIcon
              className="sight-detail-icon"
              icon={faPlaceOfWorship}
            />
            {demoData.address}
          </div>
          <div className="sight-detail-ratings">
            <Rating initialValue={Math.round(demoData.rating)} readonly />
            <div>{demoData.rating}/5</div>
          </div>
          <div className="sight-detail-button-grp">
            <Button className="button">THÊM VÀO LỘ TRÌNH</Button>
            <div style={{ width: "2rem", marginLeft: "48px" }}>
              <Heart
                isActive={active}
                onClick={() => setActive(!active)}
                animationScale={1.2}
                animationTrigger="both"
                animationDuration={0.2}
                className={`customHeart${active ? " active" : ""}`}
              />
            </div>
          </div>
        </div>
        {/* <div className="sight-detail-box" style={{ width: "35%" }}></div> */}
        <div className="sight-detail-menu">
          <div className="sight-detail-img-grp">
            <div className="sight-detail-img-main">
              <img src={main} alt="imageScenery" style={{ width: "100%" }} />
            </div>
            <div className="sight-detail-img-slider">
              <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                spaceBetween={50}
                slidesPerView={4}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                onSwiper={(swiper) => console.log(swiper)}
                // onSlideChange={() => console.log("slide change")}
                grabCursor={true}
                style={{ padding: "24px 0 32px" }}
              >
                {demoData.image.map((item, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <img
                        src={item}
                        alt="imageScenery"
                        style={{ width: "200px" }}
                        onClick={() => handleClickImg(index, item)}
                      />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </div>
          <div className="sight-detail-description">
            <Collapse
              bordered={false}
              defaultActiveKey={["1"]}
              expandIcon={({ isActive }) => (
                <CaretRightOutlined rotate={isActive ? 90 : 0} />
              )}
              style={{
                background: "var(--white-color)",
              }}
              items={getItems(panelStyle)}
            />
          </div>
          <div className="sight-detail-map">
            <GoogleMapComponent address={demoData.address} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SightDetail;
