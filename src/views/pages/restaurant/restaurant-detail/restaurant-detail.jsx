import "../../sightseeing/sight-detail/sightDetail";
import checkOpen from "utils/checkOpenTime";
import { Rating } from "react-simple-star-rating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import Heart from "react-heart";
import { parseDes, parseList } from "utils/parseDescription";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import {
  faClock,
  faPlaceOfWorship,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { CaretRightOutlined } from "@ant-design/icons";
import { Collapse, Form, Input, Button } from "antd";
import GoogleMapComponent from "components/google-maps/googleMaps";
import { useParams, Link } from "react-router-dom";
import restaurantApi from "api/restaurantApi";
import SplitParagraph from "utils/splitPara";
const { TextArea } = Input;

const RestaurantDetail = () => {
  const { id } = useParams();
  const [rating, setRating] = useState(0);
  const [restaurant, setEntertainment] = useState({});
  const [active, setActive] = useState(false);
  const [main, setMain] = useState();

  useEffect(() => {
    const getDetail = async () => {
      try {
        const response = await restaurantApi.getRestaurantDetail(id);
        setEntertainment(response.data.data);
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
  const panelStyle = {
    marginBottom: 16,
    background: "var(--background-color)",
    borderRadius: "10px",
    border: "none",
    color: "var(--text-color)",
  };

  const handleRating = (rate) => {
    setRating(rate);
  };
  const onFinish = (values) => {
    console.log({
      rating: rating,
      comment: values.comment,
    });
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return (
    <div>
      <div>
        <div className="sight-detail-container">
          <div className="sight-detail-banner">
            <div className="sight-detail-name header1">{restaurant.name}</div>
            <div className="sight-detail-open">
              <FontAwesomeIcon className="sight-detail-icon" icon={faClock} />
              {checkOpen(restaurant.open, restaurant.close) === true
                ? "Đang mở cửa"
                : "Đóng cửa"}
            </div>
            <div
              style={{
                margin: "16px 0",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div>
                <FontAwesomeIcon icon={faPhone} className="sight-detail-icon" />
                {restaurant.phone}
              </div>
              <Link
                className="link"
                to={`zalo://call?phone=${restaurant.phone}`}
              >
                <Button
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    marginLeft: "24px",
                  }}
                >
                  Gọi đặt bàn
                </Button>
              </Link>
            </div>

            <div className="sight-detail-address">
              <FontAwesomeIcon
                className="sight-detail-icon"
                icon={faPlaceOfWorship}
              />
              {restaurant.address}
            </div>
            <div className="sight-detail-ratings">
              <Rating initialValue={getRandomInt(3, 5)} readonly />
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
          <div className="sight-detail-menu">
            <div className="sight-detail-img-grp">
              <div className="sight-detail-img-main">
                <img
                  src={`http://localhost:8000/uploads/${main}`}
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
                  {restaurant.images &&
                    restaurant.images.map((item, index) => {
                      return (
                        <SwiperSlide key={index}>
                          <img
                            src={`http://localhost:8000/uploads/${item}`}
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
                items={
                  restaurant.description &&
                  Object.keys(parseDes(restaurant.description)).map(
                    (key, index) => ({
                      key: (index + 1).toString(),
                      label: (
                        <div
                          style={{
                            fontSize: "18px",
                            color: "var(--primary-color)",
                          }}
                        >
                          {key}
                        </div>
                      ),
                      children:
                        key === "Điểm nổi bật" ? (
                          <div>
                            {
                              <SplitParagraph
                                text={parseDes(restaurant.description)[key]}
                              />
                            }
                          </div>
                        ) : (
                          <div>{parseDes(restaurant.description)[key]}</div>
                        ),
                      style: panelStyle,
                    })
                  )
                }
              />
            </div>
            <div className="sight-detail-box-item">
              <div className="header2 sight-dettail-header-mark">VỊ TRÍ</div>
              <div className="sight-detail-map">
                <GoogleMapComponent address={restaurant.address} />
              </div>
            </div>
            <div className="sight-detail-box-item">
              <div className="header2 sight-dettail-header-mark">ĐÁNH GIÁ</div>
              <Form
                name="cmt-form"
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item>
                  <Rating
                    onClick={handleRating}
                    transition="true"
                    showTooltip="true"
                    tooltipDefaultText="Đánh giá của bạn"
                  />
                </Form.Item>
                <Form.Item name="comment">
                  <TextArea
                    rows={4}
                    placeholder="Nhập đánh giá của bạn ở đây"
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" className="button" htmlType="submit">
                    Gửi đánh giá
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
