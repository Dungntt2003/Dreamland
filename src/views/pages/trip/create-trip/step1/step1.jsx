import "./step1.scss";
import { Tabs } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMountain,
  faWater,
  faHotel,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import SightView from "views/pages/sightseeing/sight-view/sightView";
import Entertainment from "views/pages/entertainment/entertainment-list/entertainment";
import Restaurant from "views/pages/restaurant/restaurant-view/restaurant";
const Step1 = () => {
  const Items = [
    {
      key: 1,
      label: "Địa điểm thăm quan",
      children: <SightView />,
      icon: <FontAwesomeIcon icon={faMountain} />,
    },
    {
      key: 2,
      label: "Địa điểm vui chơi",
      children: <Entertainment />,
      icon: <FontAwesomeIcon icon={faWater} />,
    },
    {
      key: 3,
      label: "Địa điểm nghỉ dưỡng",
      children: "restaurant",
      icon: <FontAwesomeIcon icon={faHotel} />,
    },
    {
      key: 4,
      label: "Địa điểm ẩm thực",
      children: <Restaurant />,
      icon: <FontAwesomeIcon icon={faUtensils} />,
    },
  ];
  const handleChange = (key) => {
    console.log(key);
  };
  return (
    <div className="box-container">
      <Tabs defaultActiveKey="1" items={Items} onChange={handleChange} />
    </div>
  );
};

export default Step1;
