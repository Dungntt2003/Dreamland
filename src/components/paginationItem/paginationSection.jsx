import { useState } from "react";
import { Pagination } from "antd";
const PaginationSection = ({ data }) => {
  const itemsPerPage = 4;

  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };
  return (
    <>
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
      <Pagination
        current={currentPage}
        pageSize={itemsPerPage}
        total={data.length}
        onChange={handleChangePage}
        style={{ marginTop: "20px", textAlign: "center" }}
      />
    </>
  );
};

export default PaginationSection;
