import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Button } from "antd";
const MapComponent = ({ locations }) => {
  const mapRef = useRef(null);
  const [coordinates, setCoordinates] = useState([]);
  const [summary, setSummary] = useState({ distance: "", duration: "" });
  const geocoderRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowsRef = useRef([]);
  const directionsRendererRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!window.google) {
      console.error("Google Maps API chưa được tải");
      return;
    }

    geocoderRef.current = new window.google.maps.Geocoder();

    return () => {
      clearMapObjects();
    };
  }, []);

  const clearMapObjects = useCallback(() => {
    if (markersRef.current.length) {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    }

    if (infoWindowsRef.current.length) {
      infoWindowsRef.current.forEach((infoWindow) => infoWindow.close());
      infoWindowsRef.current = [];
    }

    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
      directionsRendererRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!window.google || !geocoderRef.current || !locations.length) return;

    const geocodeLocations = async () => {
      try {
        const results = await Promise.all(
          locations.map(
            (loc) =>
              new Promise((resolve) => {
                geocoderRef.current.geocode(
                  { address: loc.address },
                  (res, status) => {
                    if (status === "OK" && res && res[0]) {
                      resolve({
                        lat: res[0].geometry.location.lat(),
                        lng: res[0].geometry.location.lng(),
                        name: loc.title,
                        time: loc.time,
                      });
                    } else {
                      console.error(
                        `Không thể chuyển đổi địa chỉ: ${loc.address}, Status: ${status}`
                      );
                      resolve(null);
                    }
                  }
                );
              })
          )
        );

        const validCoordinates = results.filter(Boolean);
        if (validCoordinates.length > 0) {
          setCoordinates(validCoordinates);
        } else {
          console.error("Không có tọa độ hợp lệ nào được tìm thấy");
        }
      } catch (error) {
        console.error("Lỗi khi chuyển đổi địa chỉ:", error);
      }
    };

    geocodeLocations();
  }, [locations]);

  useEffect(() => {
    if (!window.google || coordinates.length === 0 || !mapRef.current) return;

    try {
      clearMapObjects();

      const mapOptions = {
        center: coordinates[0],
        zoom: 15,
        mapTypeControl: true,
        fullscreenControl: true,
        streetViewControl: true,
        zoomControl: true,
      };
      const map = new window.google.maps.Map(mapRef.current, mapOptions);

      mapInstanceRef.current = map;

      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        suppressMarkers: true,
        preserveViewport: false,
      });
      directionsRenderer.setMap(map);
      directionsRendererRef.current = directionsRenderer;

      let request;
      if (coordinates.length > 2) {
        const waypoints = coordinates.slice(1, -1).map((loc) => ({
          location: { lat: loc.lat, lng: loc.lng },
          stopover: true,
        }));

        request = {
          origin: coordinates[0],
          destination: coordinates[coordinates.length - 1],
          waypoints,
          travelMode: window.google.maps.TravelMode.DRIVING,
          optimizeWaypoints: true,
        };
      } else if (coordinates.length === 2) {
        request = {
          origin: coordinates[0],
          destination: coordinates[1],
          travelMode: window.google.maps.TravelMode.DRIVING,
        };
      } else {
        createMarkers(map);
        return;
      }

      directionsService.route(request, (result, status) => {
        if (status === "OK" && result.routes && result.routes[0]) {
          directionsRenderer.setDirections(result);
          const { distance, duration } = result.routes[0].legs.reduce(
            (acc, leg) => {
              acc.distance += leg.distance.value;
              acc.duration += leg.duration.value;
              return acc;
            },
            { distance: 0, duration: 0 }
          );

          setSummary({
            distance: (distance / 1000).toFixed(2) + " km",
            duration: Math.floor(duration / 60) + " phút",
          });
          const legs = result.routes[0].legs;
          legs.forEach((leg, index) => {
            // Hiển thị thông tin khoảng cách và thời gian giữa các điểm
            const startLat = leg.start_location.lat();
            const startLng = leg.start_location.lng();
            const endLat = leg.end_location.lat();
            const endLng = leg.end_location.lng();
            const googleMapsLink = `https://www.google.com/maps/dir/?api=1&origin=${startLat},${startLng}&destination=${endLat},${endLng}`;
            const midpoint = {
              lat: (leg.start_location.lat() + leg.end_location.lat()) / 2,
              lng: (leg.start_location.lng() + leg.end_location.lng()) / 2,
            };

            const infoWindow = new window.google.maps.InfoWindow({
              content: `<div style="padding: 5px;">
                <strong>🚗 ${leg.duration.text}</strong><br>
                (${leg.distance.text})<br>
                  <a href="${googleMapsLink}" target="_blank" rel="noopener noreferrer">
                    🧭 Hướng dẫn đường đi
                  </a>
              </div>`,
              pixelOffset: new window.google.maps.Size(0, -10),
            });
            infoWindowsRef.current.push(infoWindow);

            const routeMarker = new window.google.maps.Marker({
              position: midpoint,
              map,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 7,
                fillColor: "#4285F4",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2,
              },
              clickable: true,
              zIndex: 1,
            });
            markersRef.current.push(routeMarker);

            routeMarker.addListener("click", () => {
              infoWindowsRef.current.forEach((iw) => iw.close());
              infoWindow.open(map, routeMarker);
            });
          });
        } else {
          console.error("Không thể hiển thị tuyến đường:", status);
          createMarkers(map);
        }
      });

      createMarkers(map);
    } catch (error) {
      console.error("Lỗi khi hiển thị bản đồ:", error);
    }
  }, [coordinates, clearMapObjects]);

  // Tạo các markers cho các địa điểm
  const createMarkers = useCallback(
    (map) => {
      if (!map || !coordinates.length) return;

      coordinates.forEach((loc, index) => {
        const marker = new window.google.maps.Marker({
          position: { lat: loc.lat, lng: loc.lng },
          map,
          label: {
            text: `${index + 1}`,
            color: "#ffffff",
            fontWeight: "bold",
          },
          title: `${loc.name} - Ở đây lúc ${loc.time}`,
          animation: window.google.maps.Animation.DROP,
          zIndex: 2,
        });
        markersRef.current.push(marker);

        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div style="padding: 8px; max-width: 200px;">
          <h3 style="margin: 0 0 5px 0; font-size: 16px;">${index + 1}. ${
            loc.name
          }</h3>
          <p style="margin: 0; font-size: 14px;">⏱️${loc.time}</p>
        </div>`,
        });
        infoWindowsRef.current.push(infoWindow);

        marker.addListener("click", () => {
          infoWindowsRef.current.forEach((iw) => iw.close());
          infoWindow.open(map, marker);
        });
      });
    },
    [coordinates]
  );

  const mapStyle = useMemo(
    () => ({
      width: "100%",
      height: "500px",
      borderRadius: "8px",
      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
    }),
    []
  );

  const handleResetView = () => {
    if (mapInstanceRef.current && coordinates.length) {
      const bounds = new window.google.maps.LatLngBounds();
      coordinates.forEach((loc) => {
        bounds.extend(new window.google.maps.LatLng(loc.lat, loc.lng));
      });
      mapInstanceRef.current.fitBounds(bounds);
    }
  };

  const handleLocationClick = (loc) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo(loc);
      mapInstanceRef.current.setZoom(15);
    }
  };

  return (
    <div>
      {!window.google && (
        <div style={{ padding: "20px", textAlign: "center", color: "#ff4d4f" }}>
          Google Maps API chưa được tải. Vui lòng kiểm tra kết nối internet và
          API key.
        </div>
      )}
      <div style={{ display: "flex" }}>
        <div ref={mapRef} style={mapStyle}></div>
        <div style={{ minWidth: "30%", padding: "16px" }}>
          <div>
            <strong className="header2">Tóm tắt hành trình:</strong>
            <p>📏 Tổng quãng đường: {summary.distance}</p>
            <p>⏱️ Tổng thời gian di chuyển: {summary.duration}</p>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <Button
              onClick={handleResetView}
              className="button"
              style={{ padding: "8px", cursor: "pointer" }}
            >
              Xem tổng quát
            </Button>
          </div>
          <ul>
            {coordinates.map((loc, index) => (
              <li
                key={index}
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() => handleLocationClick(loc)}
              >
                {index + 1}. {loc.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
