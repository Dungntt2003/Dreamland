import "../../sightseeing/sight-view/sightView";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Input, FloatButton, Empty } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import entertainmentApi from "api/entertainmentApi";
import demoRepoApi from "api/demoRepoApi";
import EntertainmentItem from "components/repo-item/entertainmentItem";
import { checkMatchService } from "components/fun-api/like";
import likeApi from "api/likeApi";
import { useAuth } from "context/authContext";
import SuggestionSection from "components/suggestion/suggestionCard";
import nearByApi from "api/nearbyApi";
import PaginationSection from "components/paginationItem/paginationSection";
import getNearCard from "utils/nearCard";
const { Search } = Input;
const Entertainment = ({ data, count, handleUpdateCount, destinationArr }) => {
  const { id: user_id } = useAuth();
  const { id } = useParams();
  const [serviceId, setServiceId] = useState(null);
  const [serviceType, setServiceType] = useState("");
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
          serviceType,
          30
        );
        setNearServices(response.data.nearby);
      } catch (error) {
        console.error(error);
      }
    };
    getNearServices();
  }, [serviceId, serviceType]);

  const checkSightExist = (entertainment_id, type) => {
    const found = data.find(
      (item) =>
        item.service_id === entertainment_id && item.service_type === type
    );
    return found !== undefined;
  };

  const handleAddRepo = (service_id, type) => {
    const params = {
      service_id: service_id,
      service_type: type,
      repository_id: id,
    };

    const addToRepo = async () => {
      try {
        const response = await demoRepoApi.addAService(params);
        console.log(response);
        handleUpdateCount(count + 1);
        data.push(params);
      } catch (error) {
        console.error(error);
      }
    };
    addToRepo();
    setServiceId(service_id);
    setServiceType(type);
  };

  const handleRemoveService = (service_id, type) => {
    const removeService = async () => {
      try {
        const response = await demoRepoApi.removeService(service_id, type, id);
        handleUpdateCount(count - 1);
        const index = data.findIndex(
          (item) => item.service_id === service_id && item.service_type === type
        );
        if (index !== -1) data.splice(index, 1);
      } catch (error) {
        console.error(error);
      }
    };
    removeService();
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
      handleRemoveService={handleRemoveService}
    />
  ));

  const normalizeText = (text) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  const handleSearch = (value, _e, info) => {
    if (!value || value.trim() === "") {
      setFilteredData(enterData);
      setSearch(false);
      return;
    }
    setSearch(true);
    const keyword = normalizeText(value);

    const filteredByDestination = enterData.filter((entertainment) => {
      return destinationArr.some((destination) =>
        entertainment.address.toLowerCase().includes(destination.toLowerCase())
      );
    });

    const finalFiltered = filteredByDestination.filter((item) =>
      normalizeText(item.name).includes(normalizeText(keyword))
    );

    setFilteredData(finalFiltered);
  };

  return (
    <div>
      <div
        style={{ display: "flex", justifyContent: "center", margin: "16px 0" }}
      >
        <Search
          placeholder="Nhập tên địa điểm bạn muốn tìm"
          onSearch={handleSearch}
          className="create-trip-step1-input"
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
              handleRemoveService={handleRemoveService}
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
                    likedServices,
                    handleRemoveService
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
              gap: "16px",
            }}
          >
            {filteredData.length === 0 ? (
              <>
                <Empty />
              </>
            ) : (
              <div>
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
            )}
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
    </div>
  );
};

export default Entertainment;
