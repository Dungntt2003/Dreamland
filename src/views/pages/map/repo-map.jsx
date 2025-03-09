import RepoMapComponent from "components/map/map-component";
const RepoMap = () => {
  const locations = [
    { address: "Hồ Gươm, Hà Nội, Việt Nam", time: "08:00" },
    { address: "Lăng Bác, Hà Nội, Việt Nam", time: "08:30" },
    { address: "Hồ Tây, Hà Nội, Việt Nam", time: "09:00" },
  ];
  return (
    <div>
      <h1>Lộ trình du lịch</h1>
      <RepoMapComponent locations={locations} />
    </div>
  );
};

export default RepoMap;
