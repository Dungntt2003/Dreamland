import React, { useState } from "react";
import { Pagination as AntPagination } from "antd";

const SuggestionSection = ({
  SightItem,
  sightData,
  likedServices,
  destinationArr,
  checkMatchService,
  checkSightExist,
  handleAddRepo,
  type,
  handleRemoveService,
}) => {
  const [itemsPerPage, setItemsPerPage] = useState(4);

  const [currentPages, setCurrentPages] = useState({});

  const handleChangePage = (destination, page, pageSize) => {
    setCurrentPages((prev) => ({
      ...prev,
      [destination]: page,
    }));
    setItemsPerPage(pageSize);
  };

  return (
    <>
      {destinationArr.map((destination) => {
        const filteredData = sightData.filter(
          (sight) =>
            !checkMatchService(likedServices, sight.id, type) &&
            sight.address.toLowerCase().includes(destination.toLowerCase())
        );

        const cards = filteredData.map((sight) => (
          <SightItem
            key={sight.id}
            item={sight}
            checkSightExist={checkSightExist}
            handleAddRepo={handleAddRepo}
            handleRemoveService={handleRemoveService}
            active={false}
          />
        ));

        const currentPage = currentPages[destination] || 1;
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = cards.slice(indexOfFirstItem, indexOfLastItem);

        return (
          <div key={destination} style={{ marginBottom: "40px" }}>
            <div style={{ fontSize: "20px", margin: "16px 0" }}>
              DANH SÁCH ĐỊA ĐIỂM Ở{" "}
              <span style={{ color: "orange", fontWeight: "bold" }}>
                {destination.toUpperCase()}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                marginTop: "16px",
              }}
            >
              {currentItems.length > 0 ? (
                currentItems
              ) : (
                <div>Không có địa điểm đề xuất.</div>
              )}
            </div>
            {cards.length > itemsPerPage && (
              <AntPagination
                current={currentPage}
                pageSize={itemsPerPage}
                total={cards.length}
                onChange={(page, pageSize) =>
                  handleChangePage(destination, page, pageSize)
                }
                onShowSizeChange={(current, size) =>
                  handleChangePage(destination, current, size)
                }
                pageSizeOptions={["4", "8", "12"]}
                showSizeChanger
                style={{ marginTop: "20px", textAlign: "center" }}
              />
            )}
          </div>
        );
      })}
    </>
  );
};

export default SuggestionSection;
