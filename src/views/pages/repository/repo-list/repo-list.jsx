import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Empty, Button } from "antd";
import repoApi from "api/repoApi";
import CardRepo from "components/card/cardRepo";
import { useAuth } from "context/authContext";
const RepoList = () => {
  const [repo, setRepo] = useState([]);
  const { id } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const getList = async () => {
      try {
        const response = await repoApi.getListRepo(id);
        setRepo(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getList();
  }, []);

  const loadRepos = async () => {
    try {
      const response = await repoApi.getListRepo(id);
      setRepo(response.data.data);
    } catch (error) {
      console.error("Failed to load repos:", error);
    }
  };

  const handleCreateRepo = () => {
    navigate("/create-trip");
  };
  return (
    <div style={{ padding: "16px" }}>
      <div className="header2 register-header">DANH SÁCH LỘ TRÌNH CỦA BẠN</div>
      {repo.length === 0 && (
        <>
          <Button className="button" onClick={handleCreateRepo}>
            Tạo lộ trình ngay
          </Button>
          <Empty />
        </>
      )}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          // justifyContent: "space-evenly",
        }}
      >
        {repo
          .filter((item) => item.isHidden === false)
          .map((item, index) => (
            <CardRepo
              item={item}
              index={index}
              key={item.id}
              loadRepos={loadRepos}
            />
          ))}
      </div>
    </div>
  );
};

export default RepoList;
