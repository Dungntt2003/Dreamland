import "./sightView.scss";
import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Button, Input, FloatButton, Tour } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import sightApi from "api/sightApi";
import demoRepoApi from "api/demoRepoApi";
import SightItem from "components/repo-item/sightItem";
import { checkMatchService } from "components/fun-api/like";
import likeApi from "api/likeApi";
import { useAuth } from "context/authContext";
import nearByApi from "api/nearbyApi";
import SuggestionSection from "components/suggestion/suggestionCard";
import PaginationSection from "components/paginationItem/paginationSection";
import getNearCard from "utils/nearCard";

const SightView = ({ data, count, handleUpdateCount, destinationArr }) => {
  const { id: user_id } = useAuth();
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const [open, setOpen] = useState(false);
  const steps = [
    {
      title: "Chọn dịch vụ",
      description:
        "Bạn xem xét các dịch vụ tại các tab 'Thăm quan', 'Vui chơi', 'Khách sạn', 'Nhà hàng', ấn nút 'Thêm vào lộ trình' đối với những dịch vụ mà bạn hứng thú",
      target: () => ref1.current,
    },
    {
      title: "Tìm kiếm",
      description: "Ấn tên dịch vụ mà bạn muốn tìm kiếm tại đây",
      target: () => ref2.current,
    },
    {
      title: "Lộ trình",
      description:
        "Những dịch vụ mà bạn thêm sẽ được lưu ở đây, hãy ấn vào nút này để sắp xếp lộ trình của bạn",
      target: () => ref3.current,
    },
  ];
  const { id } = useParams();
  const [serviceId, setServiceId] = useState(null);
  const [nearServices, setNearServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [likedServices, setLikedServices] = useState([]);
  const [search, setSearch] = useState(false);
  const [sightData, setSightData] = useState([]);

  useEffect(() => {
    const getListSights = async () => {
      try {
        const response = await sightApi.getAllSights();
        // làm từ đoạn này
        setSightData(response.data.data);
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
    getListSights();
    getLiked();
  }, []);

  useEffect(() => {
    if (serviceId === null) return;
    const getNearServices = async () => {
      try {
        const response = await nearByApi.getNearServices(
          serviceId,
          "sight",
          30
        );
        setNearServices(response.data.nearby);
      } catch (error) {
        console.error(error);
      }
    };
    getNearServices();
  }, [serviceId]);

  const checkSightExist = (sight_id) => {
    const found = data.find((item) => item.service_id === sight_id);
    return found !== undefined;
  };
  const handleAddRepo = (service_id) => {
    const params = {
      service_id: service_id,
      service_type: "sight",
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

  const handleRemoveService = (service_id) => {
    const removeService = async () => {
      try {
        const response = await demoRepoApi.removeService(
          service_id,
          "sight",
          id
        );
        handleUpdateCount(count - 1);
        const index = data.findIndex(
          (item) =>
            item.service_id === service_id && item.service_type === "sight"
        );
        if (index !== -1) data.splice(index, 1);
      } catch (error) {
        console.error(error);
      }
    };
    removeService();
  };

  const likedData = sightData.filter(
    (sight) =>
      checkMatchService(likedServices, sight.id, "sight") &&
      destinationArr.some((destination) =>
        sight.address.toLowerCase().includes(destination.toLowerCase())
      )
  );
  const likedCard = likedData.map((sight) => (
    <SightItem
      key={sight.id}
      item={sight}
      checkSightExist={checkSightExist}
      handleAddRepo={handleAddRepo}
      handleRemoveService={handleRemoveService}
      active={checkMatchService(likedServices, sight.id, "sight")}
    />
  ));

  const handleSearch = (e) => {
    if (e.target.value === "") {
      setSearch(false);
      setFilteredData(sightData);
      setSearchTerm("");
      return;
    }
    setSearch(true);
    const keyword = e.target.value.toLowerCase();
    setSearchTerm(keyword);
    const filtered = sightData.filter((item) =>
      item.name.toLowerCase().includes(keyword)
    );
    setFilteredData(filtered);
  };
  return (
    <div>
      <Button
        className="button create-trip-step1-btn"
        onClick={() => setOpen(true)}
      >
        HƯỚNG DẪN
      </Button>
      <div
        style={{ display: "flex", justifyContent: "center", margin: "16px 0" }}
        ref={ref2}
      >
        <Input
          placeholder="Nhập tên địa điểm bạn muốn tìm"
          value={searchTerm}
          onChange={handleSearch}
          className="create-trip-step1-input"
        />
      </div>
      {search === false ? (
        <>
          <div>
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
          </div>

          <div>
            <SuggestionSection
              SightItem={SightItem}
              sightData={sightData}
              likedServices={likedServices}
              destinationArr={destinationArr}
              checkMatchService={checkMatchService}
              checkSightExist={checkSightExist}
              handleAddRepo={handleAddRepo}
              handleRemoveService={handleRemoveService}
              type="sight"
            />
          </div>

          {/* near location  */}
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
                    handleRemoveService,
                    true
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
            {filteredData.map((sight) => (
              <SightItem
                key={sight.id}
                item={sight}
                checkSightExist={checkSightExist}
                handleAddRepo={handleAddRepo}
                handleRemoveService={handleRemoveService}
              />
            ))}
          </div>
        </>
      )}
      <Link to={`/schedule/${id}`}>
        <FloatButton
          ref={ref3}
          tooltip={<div>Nhấn để sắp xếp lộ trình</div>}
          type="primary"
          className="demo-repo-icon"
          badge={{
            count: count,
            color: "red",
          }}
        />
      </Link>
      <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
    </div>
  );
};

export default SightView;
