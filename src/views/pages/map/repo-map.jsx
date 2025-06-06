import RepoMapComponent from "components/map/map-component";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import entertainmentApi from "api/entertainmentApi";
import sightApi from "api/sightApi";
import restaurantApi from "api/restaurantApi";
import hotelApi from "api/hotelApi";
import repoApi from "api/repoApi";

const RepoMap = () => {
  const { id } = useParams();
  const [listServices, setListServices] = useState([]);
  const [repo, setRepo] = useState(null);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const getAllServices = async () => {
      try {
        const sightResponse = await sightApi.getAllSights();
        const entertainmentResponse =
          await entertainmentApi.getListEntertaiments();
        const restaurantResponse = await restaurantApi.getRestaurants();
        const hotelResponse = await hotelApi.getListHotels();

        let combinedData = [
          ...sightResponse.data.data,
          ...entertainmentResponse.data.data,
          ...restaurantResponse.data.data,
          ...hotelResponse.data.data,
        ];

        setListServices(combinedData);
      } catch (error) {
        console.log(error);
      }
    };

    const getRepo = async () => {
      try {
        const response = await repoApi.getADemoRepo(id);
        setRepo(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    getAllServices();
    getRepo();
  }, [id]);

  useEffect(() => {
    if (repo && repo.plan && listServices.length > 0) {
      const mappedLocations = repo.plan
        .map((p) => {
          const matchedServices = listServices.filter(
            (s) => p.children && p.children.trim().endsWith(s.name.trim())
          );
          const firstMatch = matchedServices[0];
          return firstMatch
            ? [
                {
                  address: firstMatch.address,
                  time: p.label,
                  title: firstMatch.name,
                },
              ]
            : [];
        })
        .flat()
        .filter((location) => location && location.address);
      setLocations(mappedLocations);
    }
  }, [repo, listServices]);
  return (
    <div>
      {locations.length > 0 ? (
        <RepoMapComponent locations={locations} />
      ) : (
        <div>Đang tải dữ liệu...</div>
      )}
    </div>
  );
};

export default RepoMap;
