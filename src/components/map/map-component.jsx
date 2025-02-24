import React, { useEffect, useRef } from "react";

const RepoMapComponent = ({ locations }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!window.google) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: locations[0].lat, lng: locations[0].lng },
      zoom: 15,
    });

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      suppressMarkers: true,
    });
    directionsRenderer.setMap(map);

    const waypoints = locations.slice(1, -1).map((loc) => ({
      location: { lat: loc.lat, lng: loc.lng },
      stopover: true,
    }));

    const request = {
      origin: { lat: locations[0].lat, lng: locations[0].lng },
      destination: {
        lat: locations[locations.length - 1].lat,
        lng: locations[locations.length - 1].lng,
      },
      waypoints: waypoints,
      travelMode: "DRIVING",
    };

    directionsService.route(request, (result, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(result);

        const legs = result.routes[0].legs;

        legs.forEach((leg, index) => {
          const infoWindow = new window.google.maps.InfoWindow({
            content: `🚗 Thời gian di chuyển: ${leg.duration.text}`,
            position: leg.start_location,
          });

          infoWindow.open(map);
        });
      } else {
        console.error("Không thể hiển thị tuyến đường:", status);
      }
    });

    locations.forEach((loc, index) => {
      new window.google.maps.Marker({
        position: { lat: loc.lat, lng: loc.lng },
        map,
        label: `${index + 1}`,
        title: `${loc.name} - Ở đây lúc ${loc.time}`,
      });
    });
  }, [locations]);

  return <div ref={mapRef} style={{ width: "100%", height: "500px" }} />;
};

export default RepoMapComponent;
