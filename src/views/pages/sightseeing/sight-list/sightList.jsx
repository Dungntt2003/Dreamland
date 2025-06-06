import sightApi from "api/sightApi";
import CardSight from "components/card/cardSight";
import { useEffect, useState } from "react";
import ListDisplay from "components/list-display/list-display";
const SightList = () => {
  const [sights, setSights] = useState([]);
  useEffect(() => {
    const getListSights = async () => {
      try {
        const response = await sightApi.getAllSights();
        // console.log(response);
        setSights(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    getListSights();
  }, []);

  return (
    <ListDisplay
      listServices={sights}
      CardComponent={CardSight}
      link="sight-seeing-detail"
    />
  );
};

export default SightList;
