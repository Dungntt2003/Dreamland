import { useEffect, useRef } from "react";

const GoogleMapComponent = ({ address }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const initMap = (location) => {
      if (!mapRef.current || !window.google || !window.google.maps) return;

      const map = new window.google.maps.Map(mapRef.current, {
        center: location,
        zoom: 18,
      });

      new window.google.maps.Marker({
        position: location,
        map,
        title: address || "Hà Nội",
      });
    };

    const geocodeAddress = (addr) => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: addr }, (results, status) => {
        if (status === "OK" && results.length > 0) {
          initMap(results[0].geometry.location);
        } else {
          console.error("Lỗi geocode hoặc không tìm thấy địa chỉ:", status);
          initMap({ lat: 21.028511, lng: 105.804817 });
        }
      });
    };

    if (window.google && window.google.maps) {
      if (address) {
        geocodeAddress(address);
      } else {
        initMap({ lat: 21.028511, lng: 105.804817 });
      }
    } else {
      console.error("Google Maps chưa được load. Hãy kiểm tra lại script.");
    }
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
