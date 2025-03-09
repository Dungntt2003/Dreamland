import React, { useEffect, useRef, useState } from "react";

const RepoMapComponent = ({ locations }) => {
  const mapRef = useRef(null);

  const [coordinates, setCoordinates] = useState([]);

  useEffect(() => {
    if (!window.google) return;

    const geocoder = new window.google.maps.Geocoder();

    const geocodeLocations = async () => {
      const results = await Promise.all(
        locations.map(
          (loc) =>
            new Promise((resolve) => {
              geocoder.geocode({ address: loc.address }, (res, status) => {
                if (status === "OK" && res[0]) {
                  resolve({
                    lat: res[0].geometry.location.lat(),
                    lng: res[0].geometry.location.lng(),
                    name: loc.address,
                    time: loc.time,
                  });
                } else {
                  console.error("Không thể chuyển đổi địa chỉ:", loc.address);
                  resolve(null);
                }
              });
            })
        )
      );

      setCoordinates(results.filter(Boolean));
    };

    geocodeLocations();
  }, [locations]);

  useEffect(() => {
    if (!window.google || coordinates.length === 0) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: coordinates[0],
      zoom: 15,
    });

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      suppressMarkers: true,
    });
    directionsRenderer.setMap(map);

    const waypoints = coordinates.slice(1, -1).map((loc) => ({
      location: { lat: loc.lat, lng: loc.lng },
      stopover: true,
    }));

    const request = {
      origin: coordinates[0],
      destination: coordinates[coordinates.length - 1],
      waypoints,
      travelMode: "DRIVING",
    };

    directionsService.route(request, (result, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(result);

        const legs = result.routes[0].legs;
        legs.forEach((leg, index) => {
          const midpoint = {
            lat: (leg.start_location.lat() + leg.end_location.lat()) / 2,
            lng: (leg.start_location.lng() + leg.end_location.lng()) / 2,
          };

          const infoWindow = new window.google.maps.InfoWindow({
            content: `🚗 ${leg.duration.text} (${leg.distance.text})`,
            position: midpoint,
          });

          infoWindow.open(map);
        });
      } else {
        console.error("Không thể hiển thị tuyến đường:", status);
      }
    });

    coordinates.forEach((loc, index) => {
      new window.google.maps.Marker({
        position: { lat: loc.lat, lng: loc.lng },
        map,
        label: `${index + 1}`,
        title: `${loc.name} - Ở đây lúc ${loc.time}`,
      });
    });
  }, [coordinates]);

  return <div ref={mapRef} style={{ width: "100%", height: "500px" }} />;
};

export default RepoMapComponent;
