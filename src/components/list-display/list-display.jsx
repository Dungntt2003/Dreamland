import { useEffect, useState } from "react";
import { Pagination, Input, Select } from "antd";
import publicApi from "api/publicApi";
const ListDisplay = ({ listServices, CardComponent, link }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [search, setSearch] = useState(false);
  const [star, setStar] = useState(0);
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
  }, []);
  const options = provinces.map((item) => {
    return { value: item.name, label: item.name };
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = listServices.slice(indexOfFirstItem, indexOfLastItem);
  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  //   const handleFilter = (e, value) => {
  //     if (e.target.value === "" && value === 0) {
  //       setSearch(false);
  //       setFilteredData(sights);
  //       setSearchTerm("");
  //       return;
  //     }
  //     setSearch(true);
  //     const keyword = e.target.value.toLowerCase();
  //     setSearchTerm(keyword);
  //     if (value === 0) {
  //       const filtered = sights.filter((item) =>
  //         item.name.toLowerCase().includes(keyword)
  //       );
  //       setFilteredData(filtered);
  //       return;
  //     } else if (e.target.value === "") {
  //       const filtered = sights.filter((item) => item.rating === value);
  //       setFilteredData(filtered);
  //       return;
  //     } else {
  //       const filtered = sights.filter(
  //         (item) =>
  //           item.rating === value &&
  //           item.name.toLowerCase().includes(searchTerm.toLowerCase())
  //       );
  //       setFilteredData(filtered);
  //       return;
  //     }
  //   };

  const handleSearch = (e) => {
    if (e.target.value === "") {
      setSearch(false);
      setFilteredData(listServices);
      setSearchTerm("");
      return;
    }
    setSearch(true);
    const keyword = e.target.value.toLowerCase();
    setSearchTerm(keyword);
    const filtered = listServices.filter((item) => {
      return item.name.toLowerCase().includes(keyword);
    });
    // console.log(filtered);
    setFilteredData(filtered);
  };

  const listStar = Array.from({ length: 5 }, (_, i) => {
    return {
      value: i + 1,
      label: `${i + 1} sao`,
    };
  });

  const handleChange = (value) => {
    console.log(value);
    setStar(value);
  };
  return (
    <div style={{ padding: "16px" }}>
      <div style={{ display: "flex", margin: "16px 0" }}>
        <Input
          placeholder="Nhập tên địa điểm"
          value={searchTerm}
          onChange={handleSearch}
          style={{
            width: "50%",
          }}
        />
        <Select
          showSearch
          placeholder="Chọn tỉnh/thành phố"
          optionFilterProp="label"
          // onChange={onChange}
          // onSearch={onSearch}
          options={options}
        />

        <Select
          showSearch
          placeholder="Chọn đánh giá"
          optionFilterProp="label"
          onChange={handleChange}
          //   onSearch={handleSearchStar}
          options={[
            {
              value: 0,
              label: "Tất cả",
            },
            ...listStar,
          ]}
        />
      </div>
      {search === false ? (
        <>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              // justifyContent: "space-between",
            }}
          >
            {currentItems.map((item) => (
              <CardComponent item={item} key={item.id} link={link} />
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
            {filteredData.map((item) => {
              return <CardComponent item={item} key={item.id} link={link} />;
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ListDisplay;
