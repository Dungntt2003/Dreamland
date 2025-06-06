import restaurantApi from "api/restaurantApi";
import CardRestaurant from "components/card/cardRestaurant";
import { useState, useEffect } from "react";
import ListDisplay from "components/list-display/list-display";
const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  useEffect(() => {
    const getRestaurants = async () => {
      try {
        const response = await restaurantApi.getRestaurants();
        setRestaurants(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    getRestaurants();
  }, []);
  return (
    <ListDisplay
      listServices={restaurants}
      CardComponent={CardRestaurant}
      link="restaurant-detail"
    />
  );
};
export default RestaurantList;
