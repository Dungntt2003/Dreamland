import "./sightDetail.scss";
import checkOpen from "utils/checkOpenTime";
import { Rating } from "react-simple-star-rating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "antd";
import { useState } from "react";
import Heart from "react-heart";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { faClock, faPlaceOfWorship } from "@fortawesome/free-solid-svg-icons";
import { CaretRightOutlined } from "@ant-design/icons";
import { Collapse, theme } from "antd";
const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
const getItems = (panelStyle) => [
  {
    key: "1",
    label: "This is panel header 1",
    children: <p>{text}</p>,
    style: panelStyle,
  },
  {
    key: "2",
    label: "This is panel header 2",
    children: <p>{text}</p>,
    style: panelStyle,
  },
  {
    key: "3",
    label: "This is panel header 3",
    children: <p>{text}</p>,
    style: panelStyle,
  },
];
const SightDetail = () => {
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
  // console.log(demoData);
  // console.log(checkOpen(demoData.startTime, demoData.endTime));
  const [main, setMain] = useState(demoData.image[0]);
  const handleClickImg = (index, item) => {
    // console.log(item, index);
    setMain(item);
  };
  const { token } = theme.useToken();
  const panelStyle = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
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
                background: token.colorBgContainer,
              }}
              items={getItems(panelStyle)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SightDetail;
