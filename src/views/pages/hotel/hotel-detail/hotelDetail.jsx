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
  faMoneyBill,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { CaretRightOutlined } from "@ant-design/icons";
import {
  Collapse,
  Form,
  Input,
  Button,
  Pagination as AntPagination,
  Card,
  Modal,
} from "antd";
import GoogleMapComponent from "components/google-maps/googleMaps";
import { useParams, Link } from "react-router-dom";
import hotelApi from "api/hotelApi";
import SplitParagraph from "utils/splitPara";
import formatCurrency from "utils/formatCurrency";
const { TextArea } = Input;
const { Meta } = Card;
const { Panel } = Collapse;
const HotelDetail = () => {
  const { id } = useParams();
  const [rating, setRating] = useState(0);
  const [hotel, setHotel] = useState({});
  const [active, setActive] = useState(false);
  const [main, setMain] = useState();
  const [room, setRoom] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modelContent, setModelContent] = useState({});
  const itemsPerPage = 4;

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const getDetail = async () => {
      try {
        const response = await hotelApi.getDetailHotel(id);
        setHotel(response.data.data);
        setMain(response.data.data.images[0]);
        setRoom(response.data.data.room);
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
  const cardData = room.map((rm) => (
    <Card
      hoverable
      style={{
        width: 300,
      }}
      cover={
        <img
          alt="example"
          src={`http://localhost:8000/uploads/${rm.image}`}
          style={{ height: "170px" }}
        />
      }
    >
      <Meta
        title={rm.name}
        description={
          <div>
            <div>
              <FontAwesomeIcon
                icon={faMoneyBill}
                style={{ marginRight: "12px" }}
              />
              {formatCurrency(rm.price)}
            </div>
          </div>
        }
      />
      <Button
        className="button"
        style={{ width: "100%", marginTop: "16px" }}
        onClick={() => showModal(rm)}
      >
        XEM CHI TIẾT
      </Button>
    </Card>
  ));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cardData.slice(indexOfFirstItem, indexOfLastItem);

  const showModal = (rm) => {
    setModelContent(rm);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div>
        <div className="sight-detail-container">
          <div className="sight-detail-banner">
            <div className="sight-detail-name header1">{hotel.name}</div>
            {/* <div className="sight-detail-open">
              <FontAwesomeIcon className="sight-detail-icon" icon={faClock} />
              {checkOpen(restaurant.open, restaurant.close) === true
                ? "Đang mở cửa"
                : "Đóng cửa"}
            </div> */}
            {/* <div
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
            </div> */}

            <div className="sight-detail-address">
              <FontAwesomeIcon
                className="sight-detail-icon"
                icon={faPlaceOfWorship}
              />
              {hotel.address}
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
                  {hotel.images &&
                    hotel.images.map((item, index) => {
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
                  hotel.description &&
                  Object.keys(parseDes(hotel.description)).map(
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
                            {parseList(parseDes(hotel.description)[key]).map(
                              (item) => {
                                return (
                                  <div style={{ margin: "4px 0" }}>
                                    <FontAwesomeIcon
                                      icon={faCheck}
                                      style={{
                                        fontSize: "20px",
                                        marginRight: "16px",
                                        color: "var(--primary-color)",
                                      }}
                                    />
                                    {item}
                                  </div>
                                );
                              }
                            )}
                          </div>
                        ) : (
                          <div style={{ display: "flex", flexWrap: "wrap" }}>
                            {parseList(parseDes(hotel.description)[key]).map(
                              (item) => {
                                return (
                                  <div
                                    style={{
                                      backgroundColor: "var(--primary-color)",
                                      padding: "4px 8px",
                                      width: "fit-content",
                                      color: "white",
                                      borderRadius: "4px",
                                      margin: "4px",
                                    }}
                                  >
                                    {item}
                                  </div>
                                );
                              }
                            )}
                          </div>
                        ),
                      style: panelStyle,
                    })
                  )
                }
              />
            </div>
            <div className="sight-detail-box-item">
              <div className="header2 sight-dettail-header-mark">
                GẦN ĐỊA ĐIỂM NỔI TIẾNG
              </div>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {hotel.near_location &&
                  parseList(hotel.near_location).map((item) => {
                    return <div style={{ width: "50%" }}>{item}</div>;
                  })}
              </div>
            </div>
            <div className="sight-detail-box-item">
              <div className="header2 sight-dettail-header-mark">VỊ TRÍ</div>
              <div className="sight-detail-map">
                <GoogleMapComponent address={hotel.address} />
              </div>
            </div>
            {/* <div className="sight-detail-box-item">
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
            </div> */}
          </div>
        </div>
        <div
          className="restaurant-menu"
          style={{ backgroundColor: "#f2f7f3", padding: "16px" }}
        >
          <div
            className="menu-list"
            style={{ backgroundColor: "white", padding: "16px" }}
          >
            <div className="header2 sight-dettail-header-mark">
              DANH SÁCH PHÒNG
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                marginTop: "16px",
              }}
            >
              {currentItems.map((item, index) => item)}
            </div>
            <AntPagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={room.length}
              onChange={handleChangePage}
              style={{ marginTop: "20px", textAlign: "center" }}
            />
          </div>
        </div>
        <div
          className="hotel-detail-info"
          style={{ backgroundColor: "#f2f7f3", padding: "0px 16px 16px" }}
        >
          <div>
            <Collapse defaultActiveKey={["1"]}>
              <Panel
                style={{
                  backgroundColor: "var(--background-color)",
                  border: "none",
                  fontSize: "16px",
                  color: "var(--primary-color)",
                }}
                header="Quy định 1"
                key="1"
              >
                <div>
                  <div className="header2 sight-dettail-header-mark">
                    Quy định nhận & trả phòng
                  </div>
                  <div>
                    <p>Thời gian nhận phòng: {hotel.checkin}:00</p>
                    <p>Thời gian trả phòng: {hotel.checkout}:00</p>
                    <p>
                      Quy định nhận phòng: <br />
                      Khi đến nhận phòng, quý khách vui lòng mang theo: <br />
                      - CCCD hoặc passport. <br />
                      - Phiếu xác nhận đặt phòng của Best Price <br />
                    </p>
                  </div>
                </div>
              </Panel>
              <Panel
                style={{
                  backgroundColor: "var(--background-color)",
                  border: "none",
                  fontSize: "16px",
                  color: "var(--primary-color)",
                }}
                header="Quy định 2"
                key="2"
              >
                <div>
                  <div className="header2 sight-dettail-header-mark">
                    Quy định hủy/đổi đặt phòng
                  </div>
                  <div>
                    Phí hủy đổi đặt phòng = phí hủy/đổi của khách sạn + phí xử
                    lý giao dịch của Best Price. <br />
                    Phí hủy/đổi của khách sạn được chính khách sạn quy định như
                    sau: <br />
                    Khách hàng đặt phòng sẽ không được quyền hoàn phòng, hủy đặt
                    phòng nhưng được phép thay đổi đơn đặt phòng. <br />
                    <br />
                    Phí xử lý giao dịch của Best Price: <br />
                    - Đặt dịch vụ dưới 3 triệu: 2% tổng giá trị đặt phòng (tối
                    thiểu 30.000 đ) <br />- Đặt dịch vụ trên 3 triệu: 1,5% tổng
                    giá trị đặt phòng <br />
                  </div>
                </div>
              </Panel>
              <Panel
                style={{
                  backgroundColor: "var(--background-color)",
                  border: "none",
                  fontSize: "16px",
                  color: "var(--primary-color)",
                }}
                header="Quy định 3"
                key="3"
              >
                <div>
                  <div className="header2 sight-dettail-header-mark">
                    Trẻ em và giường phụ
                  </div>
                  <div>
                    Em bé (dưới 5 tuổi):Miễn phí tối đa 02 trẻ em dưới 5 tuổi
                    ngủ chung với bố mẹ <br />
                    Trẻ em (5 đến 11 tuổi):Phụ thu trẻ em từ 6 - 11 tuổi theo
                    quy định của khách sạn <br />
                    Khách trên 11 tuổi được coi là người lớn <br />
                    Thông tin giường phụ thì tùy thuộc vào mỗi phòng. Vui lòng
                    kiểm tra thông tin phòng để biết chi tiết. <br />
                  </div>
                </div>
              </Panel>
            </Collapse>
          </div>
        </div>
      </div>
      <Modal
        title="Chi tiết phòng"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width="60%"
      >
        <div style={{ display: "flex" }}>
          <div className="dish-img">
            <img
              src={`http://localhost:8000/uploads/${modelContent.image}`}
              alt="imageScenery"
              style={{ width: "400px" }}
            />
          </div>
          <div
            className="dish-content"
            style={{ marginLeft: "36px", fontSize: "16px" }}
          >
            <p className="dish-description">
              Mô tả:{" "}
              {modelContent.description &&
                parseList(modelContent.description).map((item) => {
                  return (
                    <div>
                      <FontAwesomeIcon
                        icon={faCheck}
                        style={{
                          fontSize: "20px",
                          marginRight: "16px",
                          color: "var(--primary-color)",
                        }}
                      />

                      {item}
                    </div>
                  );
                })}
            </p>
            <p className="dish-price">
              Giá: {formatCurrency(modelContent.price)}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HotelDetail;
