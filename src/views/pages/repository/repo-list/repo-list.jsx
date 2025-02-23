import { useState, useEffect } from "react";
import repoApi from "api/repoApi";
import CardRepo from "components/card/cardRepo";
import { useAuth } from "context/authContext";
const RepoList = () => {
  const [repo, setRepo] = useState([]);
  const { id } = useAuth();
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
  return (
    <div style={{ padding: "16px" }}>
      <div className="header2">DANH SÁCH LỘ TRÌNH CỦA BẠN</div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          // justifyContent: "space-evenly",
        }}
      >
        {repo.map((item, index) => (
          <CardRepo item={item} index={index} key={item.id} />
        ))}
      </div>
    </div>
  );
};

export default RepoList;
