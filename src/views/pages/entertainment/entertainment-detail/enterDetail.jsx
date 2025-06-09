import "../../sightseeing/sight-detail/sightDetail";
import checkOpen from "utils/checkOpenTime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import Heart from "react-heart";
import { parseDes } from "utils/parseDescription";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import {
  faClock,
  faPlaceOfWorship,
  faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";
import { CaretRightOutlined } from "@ant-design/icons";
import { Collapse, Input, Rate } from "antd";
import MapboxMapWithAddress from "components/google-maps/mapbox";
import { useParams } from "react-router-dom";
import entertainmentApi from "api/entertainmentApi";
const EnterDetail = () => {
  const { id } = useParams();
  const [rating, setRating] = useState(0);
  const [enter, setEnter] = useState({});
  const [active, setActive] = useState(false);
  const [main, setMain] = useState();

  useEffect(() => {
    const getDetail = async () => {
      try {
        const response = await entertainmentApi.getEntertainmentDetail(id);
        setEnter(response.data.data);
        setMain(response.data.data.images[0]);
        console.log(parseDes(response.data.data.description));
        console.log(response.data.data.images);
      } catch (error) {
        console.log(error);
      }
    };
    getDetail();
  }, [id]);
  const handleClickImg = (index, item) => {
    setMain(item);
  };

  const parsePrice = (price) => {
    const [adultPrice, childPrice] = price
      .replace("Giá vé: ", "")
      .split(",")
      .map((price) => price.trim());

    const result = `Người lớn: ${adultPrice} - Trẻ em: ${
      childPrice ? childPrice : adultPrice
    }`;
    return result;
  };

  return (
    <div>
      <div>
        <div className="sight-detail-container">
          <div className="sight-detail-banner">
            <div className="sight-detail-name header1">{enter.name}</div>
            <div className="sight-detail-open">
              <FontAwesomeIcon className="sight-detail-icon" icon={faClock} />
              {checkOpen(enter.startTime, enter.endTime) === true
                ? "Đang mở cửa"
                : "Đóng cửa"}
            </div>

            <div className="sight-detail-address">
              <FontAwesomeIcon
                className="sight-detail-icon"
                icon={faMoneyBill}
              />
              {enter.price ? parsePrice(enter.price) : "100.000"}
            </div>

            <div className="sight-detail-address">
              <FontAwesomeIcon
                className="sight-detail-icon"
                icon={faPlaceOfWorship}
              />
              {enter.address}
            </div>
            <div style={{ display: "flex" }}>
              <div className="sight-detail-ratings">
                <Rate value={enter.rate} disabled />
              </div>
              <div className="sight-detail-button-grp">
                {/* <Button className="button">THÊM VÀO LỘ TRÌNH</Button> */}
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
          </div>
          <div className="sight-detail-menu">
            <div className="sight-detail-img-grp">
              <div className="sight-detail-img-main">
                <img
                  src={main}
                  alt="imageScenery"
                  style={{ width: "100%", height: "400px" }}
                />
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
                  grabCursor={true}
                  style={{ padding: "24px 0 32px" }}
                >
                  {enter.images &&
                    enter.images.map((item, index) => {
                      return (
                        <SwiperSlide key={index}>
                          <img
                            src={item}
                            alt="imageScenery"
                            style={{ width: "200px", height: "120px" }}
                            onClick={() => handleClickImg(index, item)}
                          />
                        </SwiperSlide>
                      );
                    })}
                </Swiper>
              </div>
            </div>
            <div className="sight-detail-description sight-detail-box-item">
              <div className="header2 sight-dettail-header-mark">
                GIỚI THIỆU
              </div>
              <Collapse
                bordered={false}
                defaultActiveKey={["1"]}
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
                style={{
                  background: "var(--white-color)",
                }}
                items={[
                  {
                    key: "1",
                    label: (
                      <div
                        style={{
                          background: "var(--background-color)",
                          fontSize: "16px",
                          padding: "8px 16px",
                          borderRadius: "16px",
                        }}
                      >
                        Dịch vụ
                      </div>
                    ),
                    children: (
                      <div
                        style={{
                          padding: "4px 8px",
                        }}
                      >
                        {enter.description}
                      </div>
                    ),
                  },
                ]}
              />
            </div>
            <div className="sight-detail-box-item">
              <div className="header2 sight-dettail-header-mark">VỊ TRÍ</div>
              <div className="sight-detail-map">
                {/* <GoogleMapComponent address={enter.address} /> */}
                <MapboxMapWithAddress address={enter.address} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterDetail;
