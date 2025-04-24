import { useState, useEffect } from "react";
import { Tabs } from "antd";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWater,
  faHotel,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import PaymentEntertainment from "./paymentEntertainment";
import PaymentHotel from "./paymentHotel";
import PaymentRestaurant from "./paymentRestaurant";
import repoApi from "api/repoApi";
import entertainmentApi from "api/entertainmentApi";
const PaymentService = () => {
  const { id } = useParams();
  useEffect(() => {
    const getRealRepo = async () => {
      try {
        const response = await repoApi.getADemoRepo(id);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    getRealRepo();
  }, [id]);
  const Items = [
    {
      key: 1,
      label: "Vui chơi",
      children: <PaymentEntertainment />,
      icon: <FontAwesomeIcon icon={faWater} />,
    },
    {
      key: 2,
      label: "Khách sạn",
      children: <PaymentHotel />,
      icon: <FontAwesomeIcon icon={faHotel} />,
    },
    {
      key: 3,
      label: "Nhà hàng",
      children: <PaymentRestaurant />,
      icon: <FontAwesomeIcon icon={faUtensils} />,
    },
  ];
  const handleChange = (key) => {
    // console.log(key);
  };
  return (
    <div style={{ padding: "16px" }}>
      <Tabs defaultActiveKey="1" items={Items} onChange={handleChange} />
    </div>
  );
};

export default PaymentService;
