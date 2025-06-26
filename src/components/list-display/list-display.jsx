import { useEffect, useState, useMemo } from "react";
import { Pagination, Input, Select, Radio, Empty } from "antd";
import publicApi from "api/publicApi";
import likeApi from "api/likeApi";
import { useAuth } from "context/authContext";
import formatLocation from "utils/formatLocation";
import PaginationSection from "components/paginationItem/paginationSection";
const { Search } = Input;
const ListDisplay = ({ listServices, CardComponent, link }) => {
  const { id } = useAuth();
  const [likedServices, setLikedServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [search, setSearch] = useState(false);
  const [checked, setChecked] = useState(false);
  const [filter, setFilter] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [sortRating, setSortRating] = useState(0);

  const toggle = () => {
    setChecked((prev) => !prev);
  };
  const handleChangeLocation = (value) => {
    setSelectedLocation(value);
  };

  const handleChangeRating = (value) => {
    setSortRating(value);
  };

  useEffect(() => {
    let result = [...listServices];

    if (selectedLocation !== "All") {
      result = result.filter((item) => item.address.includes(selectedLocation));
    }

    if (checked) {
      result = result.filter((item) => checkLiked(item.id, link));
    }

    if (sortRating === 1) {
      result.sort((a, b) => b.rate - a.rate);
    } else if (sortRating === 2) {
      result.sort((a, b) => a.rate - b.rate);
    }
    setFilter(true);
    setFilteredData(result);
    if (sortRating === 0 && selectedLocation === "All" && checked === false)
      setFilter(false);
  }, [sortRating, selectedLocation, checked]);

  const itemsPerPage = 8;
  useEffect(() => {
    const getProvinces = async () => {
      try {
        const response = await publicApi.getListProvinces();
        setProvinces(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getProvinces();
    const getLikeServices = async () => {
      try {
        const response = await likeApi.getLikeList(id);
        setLikedServices(response.data.likes);
      } catch (error) {
        console.log(error);
      }
    };
    getLikeServices();
  }, []);
  const options = provinces.map((item) => {
    return { value: formatLocation(item.name), label: item.name };
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = listServices.slice(indexOfFirstItem, indexOfLastItem);
  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const checkMatch = (link, type) => {
    if (link === "sight-seeing-detail" && type === "sight") return true;
    if (link === "entertainment-detail" && type === "entertainment")
      return true;
    if (link === "restaurant-detail" && type === "restaurant") return true;
    if (link === "hotel-detail" && type === "hotel") return true;
    return false;
  };

  const checkLiked = (id, link) => {
    return likedServices.some(
      (service) =>
        service.service_id === id && checkMatch(link, service.service_type)
    );
  };
  const normalizeText = (text) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  const handleSearch = (value, _e, info) => {
    if (!value || value.trim() === "") {
      setFilteredData(listServices);
      setSearch(false);
      return;
    }
    setSearch(true);
    const keyword = normalizeText(value);

    const filtered = listServices.filter((item) =>
      normalizeText(item.name).includes(keyword)
    );
    setFilteredData(filtered);
  };

  return (
    <div style={{ padding: "16px" }}>
      <div className="list-play-search">
        <div style={{ width: "40%" }}>
          <Search
            placeholder="Nhập tên địa điểm"
            onSearch={handleSearch}
            style={{
              width: "100%",
            }}
          />
        </div>
        <div>
          <Select
            style={{ width: "180px" }}
            showSearch
            placeholder="Chọn tỉnh/thành phố"
            optionFilterProp="label"
            value={selectedLocation}
            onChange={handleChangeLocation}
            options={[
              {
                value: "All",
                label: "Tất cả thành phố",
              },
              ...options,
            ]}
          />

          <Select
            style={{ margin: "0 24px", width: "150px" }}
            showSearch
            placeholder="Chọn đánh giá"
            optionFilterProp="label"
            value={sortRating}
            onChange={handleChangeRating}
            options={[
              {
                value: 0,
                label: "Mặc định",
              },
              {
                value: 1,
                label: "Giảm dần",
              },
              {
                value: 2,
                label: "Tăng dần",
              },
            ]}
          />
          <Radio checked={checked} onClick={toggle}>
            Yêu thích
          </Radio>
        </div>
      </div>
      {search === false && filter === false ? (
        <>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {currentItems.map((item) => (
              <CardComponent
                item={item}
                key={item.id}
                link={link}
                active={checkLiked(item.id, link)}
              />
            ))}
          </div>
          <Pagination
            current={currentPage}
            pageSize={itemsPerPage}
            total={listServices.length}
            onChange={handleChangePage}
            style={{ marginTop: "20px", textAlign: "center" }}
          />
        </>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              // justifyContent: "space-between",
            }}
          >
            {filteredData.length === 0 ? (
              <>
                <Empty />
              </>
            ) : (
              <>
                <PaginationSection
                  data={filteredData.map((item) => {
                    return (
                      <CardComponent
                        item={item}
                        key={item.id}
                        link={link}
                        active={checkLiked(item.id, link)}
                      />
                    );
                  })}
                />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ListDisplay;
