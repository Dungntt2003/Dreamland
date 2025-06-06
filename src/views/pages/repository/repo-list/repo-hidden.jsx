import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Empty, Button } from "antd";
import repoApi from "api/repoApi";
import CardRepo from "components/card/cardRepo";
import { useAuth } from "context/authContext";

const RepoHidden = () => {
  const [hiddenRepo, setHiddenRepo] = useState([]);
  const { id } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getHiddenList = async () => {
      try {
        const response = await repoApi.getListRepo(id);
        const hiddenRepos = response.data.data.filter(
          (item) => item.isHidden === true
        );
        setHiddenRepo(hiddenRepos);
      } catch (error) {
        console.log(error);
      }
    };
    getHiddenList();
  }, [id]);

  const loadHiddenRepos = async () => {
    try {
      const response = await repoApi.getListRepo(id);
      const hiddenRepos = response.data.data.filter(
        (item) => item.isHidden === true
      );
      setHiddenRepo(hiddenRepos);
    } catch (error) {
      console.error("Failed to load hidden repos:", error);
    }
  };

  const handleBackToRepoList = () => {
    navigate("/repository");
  };

  const handleCreateRepo = () => {
    navigate("/create-trip");
  };

  return (
    <div style={{ padding: "16px" }}>
      <div className="header2">DANH SÁCH LỘ TRÌNH ĐÃ ẨN</div>

      <div style={{ marginBottom: "16px" }}>
        <Button
          className="button"
          onClick={handleBackToRepoList}
          style={{ marginRight: "8px" }}
        >
          Quay lại danh sách chính
        </Button>
      </div>

      {hiddenRepo.length === 0 && (
        <>
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <p style={{ color: "#666", marginBottom: "16px" }}>
              Bạn chưa có lộ trình nào bị ẩn
            </p>
            <Button className="button" onClick={handleCreateRepo}>
              Tạo lộ trình mới
            </Button>
          </div>
          <Empty
            description="Không có lộ trình ẩn nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </>
      )}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {hiddenRepo.map((item, index) => (
          <CardRepo
            item={item}
            index={index}
            key={item.id}
            loadRepos={loadHiddenRepos}
            isHiddenView={true}
          />
        ))}
      </div>
    </div>
  );
};

export default RepoHidden;
