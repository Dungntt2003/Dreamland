import RepoMapComponent from "components/map/map-component";
const RepoMap = () => {
  const locations = [
    {
      name: "Khách sạn Hải Uyên",
      lat: 10.775659,
      lng: 106.700424,
      time: "08:00",
    },
    { name: "Nhà thờ Đức Bà", lat: 10.77942, lng: 106.699215, time: "09:00" },
    { name: "Chợ Bến Thành", lat: 10.772108, lng: 106.698306, time: "10:30" },
    { name: "Bitexco Tower", lat: 10.771556, lng: 106.704484, time: "12:00" },
  ];
  return (
    <div>
      <h1>Lộ trình du lịch</h1>
      <RepoMapComponent locations={locations} />
    </div>
  );
};

export default RepoMap;
