import React, { useEffect, useRef, useState } from "react";

const GoogleMapComponent = ({ address }) => {
  const mapRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMap = (center) => {
      if (!window.google || !window.google.maps) {
        console.error("Google Maps chưa được tải.");
        return;
      }

      const map = new window.google.maps.Map(mapRef.current, {
        center: center,
        zoom: 15,
      });
      new window.google.maps.Marker({
        position: center,
        map: map,
        title: address || "Vị trí mặc định",
      });
    };

    const initializeMap = () => {
      if (address) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address }, (results, status) => {
          if (status === "OK" && results.length > 0) {
            const location = results[0].geometry.location;
            loadMap({ lat: location.lat(), lng: location.lng() });
          } else {
            setError("Không tìm thấy địa chỉ hoặc lỗi geocoding: " + status);
            // Nếu không tìm thấy địa chỉ, sử dụng vị trí mặc định
            loadMap({ lat: 21.028511, lng: 105.804817 }); // Hà Nội
          }
        });
      } else {
        // Nếu không có địa chỉ, sử dụng vị trí mặc định
        loadMap({ lat: 21.028511, lng: 105.804817 }); // Hà Nội
      }
    };

    const checkGoogleMaps = setInterval(() => {
      if (window.google && window.google.maps) {
        clearInterval(checkGoogleMaps);
        initializeMap();
      }
    }, 100);

    return () => clearInterval(checkGoogleMaps);
  }, [address]);

  return (
    <div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <div
        ref={mapRef}
        style={{ width: "100%", height: "400px", border: "1px solid black" }}
      />
    </div>
  );
};

export default GoogleMapComponent;
