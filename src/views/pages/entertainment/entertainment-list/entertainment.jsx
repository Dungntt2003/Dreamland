import "../../sightseeing/sight-view/sightView";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import {
  Card,
  Button,
  Pagination as AntPagination,
  Rate,
  Input,
  FloatButton,
} from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import entertainmentApi from "api/entertainmentApi";
import demoRepoApi from "api/demoRepoApi";
import { ToastContainer, toast } from "react-toastify";
const { Meta } = Card;

const Entertainment = ({ data, count, handleUpdateCount }) => {
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState(false);
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  const [enterData, setEnterData] = useState([]);
  useEffect(() => {
    const getListEnters = async () => {
      try {
        const response = await entertainmentApi.getListEntertaiments();
        setEnterData(response.data.data);
        setFilteredData(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    getListEnters();
  }, []);

  const checkSightExist = (entertainment_id) => {
    const found = data.find((item) => item.service_id === entertainment_id);
    return found !== undefined;
  };
  const cardData = enterData.map((enter) => (
    <Card
      hoverable
      style={{
        width: 300,
      }}
      cover={
        <img
          alt="example"
          src={`http://localhost:8000/uploads/${enter.images[0]}`}
          style={{ height: "170px" }}
        />
      }
    >
      <Link
        to={`/entertainment-detail/${enter.id}`}
        className="link"
        key={enter.id}
      >
        <Meta
          title={enter.name}
          description={
            <div>
              <div className="truncate-2-lines">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  style={{ marginRight: "12px" }}
                />
                {enter.address}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "8px 0",
                }}
              >
                <Rate disabled value={getRandomInt(3, 5)} />
                {/* <div
                    style={{ color: "var(--text-color)", marginLeft: "12px" }}
                  >{`${getRandomInt(3, 5)}/5`}</div> */}
              </div>
            </div>
          }
        />
      </Link>
      {checkSightExist(enter.id) === false ? (
        <Button
          className="button"
          style={{ width: "100%", marginTop: "16px" }}
          onClick={() => handleAddRepo(enter.id)}
        >
          THÊM VÀO LỘ TRÌNH
        </Button>
      ) : (
        <Button
          className="button"
          style={{
            width: "100%",
            marginTop: "16px",
            opacity: "0.5",
            cursor: "none",
          }}
          disabled
        >
          ĐÃ THÊM VÀO LỘ TRÌNH
        </Button>
      )}
    </Card>
  ));

  const fiftyPercentLength = Math.floor(cardData.length * 0.5);
  const card1Data = cardData.slice(0, fiftyPercentLength);
  const card2Data = cardData.slice(fiftyPercentLength);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = card2Data.slice(indexOfFirstItem, indexOfLastItem);

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };
  const handleSearch = (e) => {
    if (e.target.value === "") {
      setSearch(false);
      setFilteredData(enterData);
      setSearchTerm("");
      return;
    }
    setSearch(true);
    const keyword = e.target.value.toLowerCase();
    setSearchTerm(keyword);
    const filtered = enterData.filter((item) =>
      item.name.toLowerCase().includes(keyword)
    );
    setFilteredData(filtered);
  };
  const handleAddRepo = (service_id) => {
    const params = {
      service_id: service_id,
      service_type: "entertainment",
      repository_id: id,
    };

    const addToRepo = async () => {
      try {
        const response = await demoRepoApi.addAService(params);
        // toast.success("Đã thêm vào lộ trình", {
        //   position: "top-right",
        //   autoClose: 1000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   progress: undefined,
        //   theme: "light",
        // });
        handleUpdateCount(count + 1);
        data.push(params);
      } catch (error) {
        console.error(error);
        // toast.error("Đã xảy ra lỗi, vui lòng thử lại", {
        //   position: "top-right",
        //   autoClose: 1000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   progress: undefined,
        //   theme: "light",
        // });
      }
    };
    addToRepo();
  };
  return (
    <div>
      <div
        style={{ display: "flex", justifyContent: "center", margin: "16px 0" }}
      >
        <Input
          placeholder="Nhập tên địa điểm bạn muốn tìm"
          value={searchTerm}
          onChange={handleSearch}
          style={{
            width: "50%",
          }}
        />
      </div>
      {search === false ? (
        <>
          <div>
            <div style={{ fontSize: "20px" }}>DANH SÁCH ĐỀ XUẤT</div>
            <Swiper
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              spaceBetween={50}
              slidesPerView={4}
              navigation
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
              grabCursor={true}
              style={{ padding: "24px 0 32px" }}
            >
              {card1Data.map((item, index) => {
                return <SwiperSlide key={index}>{item}</SwiperSlide>;
              })}
            </Swiper>
          </div>
          <div style={{ margin: "16px 0" }}>
            <div style={{ fontSize: "20px" }}>DANH SÁCH YÊU THÍCH CỦA BẠN</div>
            <Swiper
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              spaceBetween={50}
              slidesPerView={4}
              navigation
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
              grabCursor={true}
              style={{ padding: "24px 0 32px" }}
            >
              {cardData.map((item, index) => {
                return <SwiperSlide key={index}>{item}</SwiperSlide>;
              })}
            </Swiper>
          </div>
          <div>
            <div style={{ fontSize: "20px" }}>
              DANH SÁCH ĐỊA ĐIỂM ĐỀ XUẤT KHÁC
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
              total={card2Data.length}
              onChange={handleChangePage}
              style={{ marginTop: "20px", textAlign: "center" }}
            />
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {filteredData.map((enter) => (
              <Card
                hoverable
                style={{
                  width: 300,
                  marginRight: "36px",
                }}
                cover={
                  <img
                    alt="example"
                    src={`http://localhost:8000/uploads/${enter.images[0]}`}
                    style={{ height: "170px" }}
                  />
                }
              >
                <Link
                  to={`/entertainment-detail/${enter.id}`}
                  className="link"
                  key={enter.id}
                >
                  <Meta
                    title={enter.name}
                    description={
                      <div>
                        <div className="truncate-2-lines">
                          <FontAwesomeIcon
                            icon={faLocationDot}
                            style={{ marginRight: "12px" }}
                          />
                          {enter.address}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            margin: "8px 0",
                          }}
                        >
                          <Rate disabled value={getRandomInt(3, 5)} />
                        </div>
                      </div>
                    }
                  />
                </Link>
                {checkSightExist(enter.id) === false ? (
                  <Button
                    className="button"
                    style={{ width: "100%", marginTop: "16px" }}
                    onClick={() => handleAddRepo(enter.id)}
                  >
                    THÊM VÀO LỘ TRÌNH
                  </Button>
                ) : (
                  <Button
                    className="button"
                    style={{
                      width: "100%",
                      marginTop: "16px",
                      opacity: "0.5",
                      cursor: "none",
                    }}
                    disabled
                  >
                    ĐÃ THÊM VÀO LỘ TRÌNH
                  </Button>
                )}
              </Card>
            ))}
          </div>
        </>
      )}
      <FloatButton
        href="https://ant.design/index-cn"
        tooltip={<div>Lịch trình của bạn</div>}
        type="primary"
        className="demo-repo-icon"
        badge={{
          count: count,
          color: "red",
        }}
      />
      <ToastContainer />
    </div>
  );
};

export default Entertainment;
