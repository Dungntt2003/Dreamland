import SightItem from "components/repo-item/sightItem";
import EntertainmentItem from "components/repo-item/entertainmentItem";
import HotelItem from "components/repo-item/hotelItem";
import RestaurantItem from "components/repo-item/restaurantItem";

const componentMap = {
  sight: SightItem,
  entertainment: EntertainmentItem,
  hotel: HotelItem,
  restaurant: RestaurantItem,
};

const getNearCard = (
  nearServices,
  checkSightExist,
  handleAddRepo,
  checkMatchService,
  likedServices
) => {
  return nearServices.map((item) => {
    const Component = componentMap[item.type];
    if (!Component) return null;

    return (
      <Component
        key={item.id}
        item={item}
        checkSightExist={checkSightExist}
        handleAddRepo={handleAddRepo}
        active={checkMatchService(likedServices, item.id, item.type)}
      />
    );
  });
};

export default getNearCard;
