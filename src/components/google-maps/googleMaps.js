import React, { useEffect, useRef } from "react";

const GoogleMapComponent = ({ address }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const loadMap = () => {
      if (window.google && window.google.maps) {
        const geocoder = new window.google.maps.Geocoder();

        // Chuyển địa chỉ thành tọa độ bằng Geocoder
        geocoder.geocode({ address: address }, (results, status) => {
          if (status === "OK" && results.length > 0) {
            const location = results[0].geometry.location;

            // Tạo bản đồ với tọa độ lấy được
            const map = new window.google.maps.Map(mapRef.current, {
              center: location,
              zoom: 15,
            });

            // Đặt marker tại vị trí
            new window.google.maps.Marker({
              position: location,
              map: map,
              title: address,
            });
          } else {
            console.error("Không tìm thấy địa chỉ hoặc lỗi geocoding:", status);
          }
        });
      } else {
        console.error("Google Maps chưa được tải.");
      }
    };

    loadMap();
  }, [address]);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "400px", border: "1px solid black" }}
    />
  );
};

export default GoogleMapComponent;
