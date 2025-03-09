import hotelApi from "api/hotelApi";
import CardHotel from "components/card/cardHotel";
import { useState, useEffect } from "react";
import ListDisplay from "components/list-display/list-display";
const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  useEffect(() => {
    const getHotels = async () => {
      try {
        const response = await hotelApi.getListHotels();
        console.log(response);
        setHotels(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getHotels();
  }, []);
  return (
    <ListDisplay
      listServices={hotels}
      CardComponent={CardHotel}
      link="hotel-detail"
    />
  );
};

export default HotelList;
