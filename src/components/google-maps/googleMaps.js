import React, { useEffect, useRef } from "react";

const GoogleMapComponent = ({ address }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const initMap = (location) => {
      if (mapRef.current) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: location,
          zoom: 18,
        });

        new window.google.maps.Marker({
          position: location,
          map: map,
          title: address || "Hà Nội",
        });
      }
    };

    const geocodeAddress = (address) => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === "OK" && results.length > 0) {
          const location = results[0].geometry.location;
          initMap(location);
        } else {
          console.error("Không tìm thấy địa chỉ hoặc lỗi geocoding:", status);
          initMap({ lat: 21.028511, lng: 105.804817 });
        }
      });
    };

    const checkGoogleMaps = setInterval(() => {
      if (window.google && window.google.maps) {
        clearInterval(checkGoogleMaps);
        if (address) {
          geocodeAddress(address);
        } else {
          initMap({ lat: 21.028511, lng: 105.804817 });
        }
      }
    }, 100);
    return () => clearInterval(checkGoogleMaps);
  }, [address]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "400px",
        border: "1px solid var(--text-color)",
        borderRadius: "10px",
      }}
    />
  );
};

export default GoogleMapComponent;
