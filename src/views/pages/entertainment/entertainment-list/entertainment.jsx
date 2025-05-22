import "../../sightseeing/sight-view/sightView";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Input, FloatButton } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import entertainmentApi from "api/entertainmentApi";
import demoRepoApi from "api/demoRepoApi";
import { ToastContainer, toast } from "react-toastify";
import EntertainmentItem from "components/repo-item/entertainmentItem";
import { checkMatchService } from "components/fun-api/like";
import likeApi from "api/likeApi";
import { useAuth } from "context/authContext";
import SuggestionSection from "components/suggestion/suggestionCard";
import nearByApi from "api/nearbyApi";
import PaginationSection from "components/paginationItem/paginationSection";
import getNearCard from "utils/nearCard";

const Entertainment = ({ data, count, handleUpdateCount, destinationArr }) => {
  const { id: user_id } = useAuth();
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceId, setServiceId] = useState(null);
  const [nearServices, setNearServices] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState(false);
  const [likedServices, setLikedServices] = useState([]);
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
    const getLiked = async () => {
      try {
        const response = await likeApi.getLikeList(user_id);
        setLikedServices(response.data.likes);
      } catch (error) {
        console.log(error);
      }
    };
    getLiked();
    getListEnters();
  }, []);

  useEffect(() => {
    if (serviceId === null) return;
    const getNearServices = async () => {
      try {
        const response = await nearByApi.getNearServices(
          serviceId,
          "entertainment",
          30
        );
        setNearServices(response.data.nearby);
      } catch (error) {
        console.error(error);
      }
    };
    getNearServices();
  }, [serviceId]);

  const checkSightExist = (entertainment_id) => {
    const found = data.find((item) => item.service_id === entertainment_id);
    return found !== undefined;
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
        handleUpdateCount(count + 1);
        data.push(params);
      } catch (error) {
        console.error(error);
      }
    };
    addToRepo();
    setServiceId(service_id);
  };
  const likedData = enterData.filter(
    (enter) =>
      checkMatchService(likedServices, enter.id, "entertainment") &&
      destinationArr.some((destination) =>
        enter.address.toLowerCase().includes(destination.toLowerCase())
      )
  );
  const likedCard = likedData.map((enter) => (
    <EntertainmentItem
      key={enter.id}
      item={enter}
      checkSightExist={checkSightExist}
      handleAddRepo={handleAddRepo}
      active={checkMatchService(likedServices, enter.id, "entertainment")}
    />
  ));

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
          {likedCard.length > 0 && (
            <>
              <div>
                <div style={{ fontSize: "20px" }}>
                  DANH SÁCH YÊU THÍCH CỦA BẠN
                </div>
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
                  {likedCard.map((item, index) => {
                    return <SwiperSlide key={index}>{item}</SwiperSlide>;
                  })}
                </Swiper>
              </div>
            </>
          )}
          <div>
            <SuggestionSection
              SightItem={EntertainmentItem}
              sightData={enterData}
              likedServices={likedServices}
              destinationArr={destinationArr}
              checkMatchService={checkMatchService}
              checkSightExist={checkSightExist}
              handleAddRepo={handleAddRepo}
              type="entertainment"
            />
          </div>
          <div>
            <div style={{ fontSize: "20px", marginTop: "24px" }}>
              CÁC ĐỊA ĐIỂM Ở GẦN
            </div>
            {nearServices.length > 0 ? (
              <>
                <PaginationSection
                  data={getNearCard(
                    nearServices,
                    checkSightExist,
                    handleAddRepo,
                    checkMatchService,
                    likedServices
                  )}
                />
              </>
            ) : (
              <p style={{ color: "red", fontSize: "16px" }}>
                Chưa có địa điểm nào đề xuất
              </p>
            )}
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {filteredData.map((enter) => (
              <EntertainmentItem
                key={enter.id}
                item={enter}
                checkSightExist={checkSightExist}
                handleAddRepo={handleAddRepo}
                active={checkMatchService(
                  likedServices,
                  enter.id,
                  "entertainment"
                )}
              />
            ))}
          </div>
        </>
      )}
      <Link to={`/schedule/${id}`}>
        <FloatButton
          tooltip={<div>Nhấn để sắp xếp lộ trình</div>}
          type="primary"
          className="demo-repo-icon"
          badge={{
            count: count,
            color: "red",
          }}
        />
      </Link>
      <ToastContainer />
    </div>
  );
};

export default Entertainment;
