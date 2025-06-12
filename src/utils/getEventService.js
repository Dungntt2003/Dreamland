import sightApi from "api/sightApi";
import entertainmentApi from "api/entertainmentApi";
import hotelApi from "api/hotelApi";
import restaurantApi from "api/restaurantApi";

const getAllServices = async () => {
  try {
    const [
      sightResponse,
      entertainmentResponse,
      restaurantResponse,
      hotelResponse,
    ] = await Promise.all([
      sightApi.getAllSights(),
      entertainmentApi.getListEntertaiments(),
      restaurantApi.getRestaurants(),
      hotelApi.getListHotels(),
    ]);

    return [
      ...sightResponse.data.data,
      ...entertainmentResponse.data.data,
      ...restaurantResponse.data.data,
      ...hotelResponse.data.data,
    ];
  } catch (error) {
    console.log("Lỗi khi lấy dịch vụ:", error);
    throw error;
  }
};

const mapEventToServices = (events, services) => {
  return events
    .map((p) => {
      const matchedServices = services.filter(
        (s) => p.title && p.title.trim().endsWith(s.name.trim())
      );
      const firstMatch = matchedServices[0];
      return firstMatch ? [{ ...p, ...firstMatch }] : [];
    })
    .flat()
    .filter((location) => location?.address);
};

export { getAllServices, mapEventToServices };
