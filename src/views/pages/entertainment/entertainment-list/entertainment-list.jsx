import entertainmentApi from "api/entertainmentApi";
import { useState, useEffect } from "react";
import CardEntertainment from "components/card/cardEntertainment";
import ListDisplay from "components/list-display/list-display";
const EntertainmentList = () => {
  const [entertainments, setEntertainments] = useState([]);
  useEffect(() => {
    const getEntertainments = async () => {
      try {
        const response = await entertainmentApi.getListEntertaiments();
        setEntertainments(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    getEntertainments();
  }, []);
  return (
    <ListDisplay
      listServices={entertainments}
      CardComponent={CardEntertainment}
      link="entertainment-detail"
    />
  );
};

export default EntertainmentList;
