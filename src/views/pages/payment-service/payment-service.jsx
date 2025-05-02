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
import restaurantApi from "api/restaurantApi";
const PaymentService = () => {
  const { id } = useParams();
  const [enterList, setEnterList] = useState([]);
  const [resList, setResList] = useState([]);
  useEffect(() => {
    const getRealRepo = async () => {
      try {
        const response = await repoApi.getADemoRepo(id);
        const enterRes = await entertainmentApi.getListEntertaiments();
        const resRes = await restaurantApi.getRestaurants();
        const filteredEnter = response.data.data.plan.filter(
          (item) => item.children && item.children.includes("Vui chơi tại")
        );
        const repoEnter = enterRes.data.data
          .filter(
            (item) =>
              item.name &&
              filteredEnter.some(
                (enter) => enter.children && enter.children.includes(item.name)
              )
          )
          .filter(
            (item, index, self) =>
              index === self.findIndex((t) => t.name === item.name)
          );

        const filteredRes = response.data.data.plan.filter(
          (item) => item.children && item.children.includes("Ăn tại")
        );
        const repoRes = resRes.data.data
          .filter(
            (item) =>
              item.name &&
              filteredRes.some(
                (enter) => enter.children && enter.children.includes(item.name)
              )
          )
          .filter(
            (item, index, self) =>
              index === self.findIndex((t) => t.name === item.name)
          );
        setResList(repoRes);
        setEnterList(repoEnter);
      } catch (error) {
        console.log(error);
      }
    };
    getRealRepo();
  }, [id]);
  const handleChange = (key) => {
    // console.log(key);
  };
  return (
    <div style={{ padding: "16px" }}>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: 1,
            label: "Vui chơi",
            children: (
              <PaymentEntertainment listService={enterList} repoId={id} />
            ),
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
            children: <PaymentRestaurant listService={resList} repoId={id} />,
            icon: <FontAwesomeIcon icon={faUtensils} />,
          },
        ]}
        onChange={handleChange}
      />
    </div>
  );
};

export default PaymentService;
