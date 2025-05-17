import "./step1.scss";
import { useState, useEffect } from "react";
import { Tabs } from "antd";
import { useParams } from "react-router-dom";
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
import HotelView from "views/pages/hotel/hotel-list/hotelView";
import repoApi from "api/repoApi";
const Step1 = () => {
  const { id } = useParams();
  const [count, setCount] = useState(0);
  const [demoRepo, setDemoRepo] = useState([]);
  const [destinationArr, setDestinationArr] = useState([]);
  useEffect(() => {
    const getDemoRepo = async () => {
      try {
        const response = await repoApi.getADemoRepo(id);
        setCount(response.data.data.demorepodetail.length);
        setDestinationArr(
          response.data.data.destination.split(",").map((item) => item.trim())
        );
        setDemoRepo(response.data.data.demorepodetail);
      } catch (error) {
        console.log(error);
      }
    };
    getDemoRepo();
  }, [id]);

  const handleCount = (newValue) => {
    setCount(newValue);
  };

  const Items = [
    {
      key: 1,
      label: "Địa điểm thăm quan",
      children: (
        <SightView
          data={demoRepo}
          count={count}
          handleUpdateCount={handleCount}
          destinationArr={destinationArr}
        />
      ),
      icon: <FontAwesomeIcon icon={faMountain} />,
    },
    {
      key: 2,
      label: "Địa điểm vui chơi",
      children: (
        <Entertainment
          data={demoRepo}
          count={count}
          handleUpdateCount={handleCount}
        />
      ),
      icon: <FontAwesomeIcon icon={faWater} />,
    },
    {
      key: 3,
      label: "Địa điểm nghỉ dưỡng",
      children: (
        <HotelView
          data={demoRepo}
          count={count}
          handleUpdateCount={handleCount}
        />
      ),
      icon: <FontAwesomeIcon icon={faHotel} />,
    },
    {
      key: 4,
      label: "Địa điểm ẩm thực",
      children: (
        <Restaurant
          data={demoRepo}
          count={count}
          handleUpdateCount={handleCount}
        />
      ),
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
