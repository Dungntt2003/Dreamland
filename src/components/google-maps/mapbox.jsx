import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapboxgl.accessToken });

const MapboxMapWithAddress = ({ address }) => {
  const mapContainerRef = useRef(null);
  const [lngLat, setLngLat] = useState(null);

  useEffect(() => {
    const geocodeAddress = async () => {
      try {
        const response = await geocodingClient
          .forwardGeocode({
            query: address,
            limit: 1,
          })
          .send();

        const match = response.body.features[0];
        if (match) {
          const [lng, lat] = match.geometry.coordinates;
          setLngLat({ lng, lat });
        }
      } catch (error) {
        console.error("Lỗi geocoding:", error);
      }
    };

    if (address) {
      geocodeAddress();
    }
  }, [address]);

  useEffect(() => {
    if (!lngLat) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lngLat.lng, lngLat.lat],
      zoom: 14,
    });

    new mapboxgl.Marker().setLngLat([lngLat.lng, lngLat.lat]).addTo(map);

    return () => map.remove();
  }, [lngLat]);

  return (
    <div>
      <div
        ref={mapContainerRef}
        style={{ width: "100%", height: "500px", borderRadius: "8px" }}
      />
    </div>
  );
};

export default MapboxMapWithAddress;
