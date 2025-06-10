import "./sightDetail.scss";
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
import { faClock, faPlaceOfWorship } from "@fortawesome/free-solid-svg-icons";
import { CaretRightOutlined } from "@ant-design/icons";
import { Collapse, Rate } from "antd";
import { useParams } from "react-router-dom";
import sightApi from "api/sightApi";
import splitTextIntoParagraphs from "utils/splitParaChunk";
import MapboxMapWithAddress from "components/google-maps/mapbox";
const SightDetail = () => {
  const { id } = useParams();
  const [sight, setSight] = useState({});
  const [active, setActive] = useState(false);
  const [main, setMain] = useState();
  useEffect(() => {
    const getDetail = async () => {
      try {
        const response = await sightApi.getSightDetail(id);
        setSight(response.data.data);
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

  return (
    <div>
      <div className="sight-detail-container">
        <div className="sight-detail-banner">
          <div className="sight-detail-name header1">{sight.name}</div>
          <div className="sight-detail-open">
            <FontAwesomeIcon className="sight-detail-icon" icon={faClock} />
            {checkOpen(sight.startTime, sight.endTime) === true
              ? "Đang mở cửa"
              : "Đóng cửa"}
          </div>

          <div className="sight-detail-address">
            <FontAwesomeIcon
              className="sight-detail-icon"
              icon={faPlaceOfWorship}
            />
            {sight.address}
          </div>
          <div style={{ display: "flex" }}>
            <div className="sight-detail-ratings">
              <Rate disabled value={sight.rate} />
            </div>
            <div className="sight-detail-button-grp">
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
                {sight.images &&
                  sight.images.map((item, index) => {
                    return (
                      <SwiperSlide key={index}>
                        <img
                          src={item}
                          alt="imageScenery"
                          className="sight-detail-img-slider-item"
                          onClick={() => handleClickImg(index, item)}
                        />
                      </SwiperSlide>
                    );
                  })}
              </Swiper>
            </div>
          </div>
          <div className="sight-detail-description sight-detail-box-item">
            <div className="header2 sight-dettail-header-mark">GIỚI THIỆU</div>
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
                        fontSize: "18px",
                        color: "var(--primary-color)",
                        background: "var(--background-color)",
                        padding: "4px 12px",
                        borderRadius: "10px",
                      }}
                    >
                      Giới thiệu chi tiết
                    </div>
                  ),
                  children: (
                    <div>
                      {sight.description &&
                        splitTextIntoParagraphs(sight.description).map(
                          (para, index) => (
                            <p
                              key={index}
                              style={{ marginBottom: "1.5em", lineHeight: 1.6 }}
                            >
                              {para}
                            </p>
                          )
                        )}
                    </div>
                  ),
                },
              ]}
            />
          </div>
          <div className="sight-detail-box-item">
            <div className="header2 sight-dettail-header-mark">VỊ TRÍ</div>
            <div className="sight-detail-map">
              {/* <GoogleMapComponent address={sight.address} /> */}
              <MapboxMapWithAddress
                address={sight.address}
                style={{ with: "100%" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SightDetail;
