import likeApi from "api/likeApi";
import sightApi from "api/sightApi";
import entertainmentApi from "api/entertainmentApi";
import restaurantApi from "api/restaurantApi";
import hotelApi from "api/hotelApi";
import { useState, useEffect } from "react";
import { useAuth } from "context/authContext";
import ListDisplay from "components/list-display/list-display";
import CardSight from "components/card/cardSight";
import CardEntertainment from "components/card/cardEntertainment";
import CardRestaurant from "components/card/cardRestaurant";
import CardHotel from "components/card/cardHotel";
const LikedItem = ({ current }) => {
  const { id } = useAuth();
  const [sight, setSight] = useState([]);
  const [entertainment, setEntertainment] = useState([]);
  const [restaurant, setRestaurant] = useState([]);
  const [hotel, setHotel] = useState([]);
  const [likedItems, setLikedItems] = useState([]);
  useEffect(() => {
    const getAllServices = async () => {
      try {
        const likedServices = await likeApi.getLikeList(id);
        setLikedItems(likedServices.data.likes);
        const sightRes = await sightApi.getAllSights();
        setSight(sightRes.data.data);
        const entertainmentRes = await entertainmentApi.getListEntertaiments();
        setEntertainment(entertainmentRes.data.data);
        const restaurantRes = await restaurantApi.getRestaurants();
        setRestaurant(restaurantRes.data.data);
        const hotelRes = await hotelApi.getListHotels();
        setHotel(hotelRes.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllServices();
  }, [id]); // Add id as a dependency

  const serviceMap = {
    sight: {
      data: sight.filter((item) =>
        likedItems.some(
          (liked) =>
            liked.service_id === item.id && liked.service_type === "sight"
        )
      ),
      Card: CardSight,
      link: "sight-seeing-detail",
    },
    entertainment: {
      data: entertainment.filter((item) =>
        likedItems.some(
          (liked) =>
            liked.service_id === item.id &&
            liked.service_type === "entertainment"
        )
      ),
      Card: CardEntertainment,
      link: "entertainment-detail",
    },
    hotel: {
      data: hotel.filter((item) =>
        likedItems.some(
          (liked) =>
            liked.service_id === item.id && liked.service_type === "hotel"
        )
      ),
      Card: CardHotel,
      link: "hotel-detail",
    },
    restaurant: {
      data: restaurant.filter((item) =>
        likedItems.some(
          (liked) =>
            liked.service_id === item.id && liked.service_type === "restaurant"
        )
      ),
      Card: CardRestaurant,
      link: "restaurant-detail",
    },
  };

  const getListServices = () => {
    const config = serviceMap[current];
    if (!config) return <div>Please select a service category.</div>;

    return (
      <ListDisplay
        listServices={config.data}
        CardComponent={config.Card}
        link={config.link}
      />
    );
  };

  return <div>{getListServices()}</div>;
};

export default LikedItem;
