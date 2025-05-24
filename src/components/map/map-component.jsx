import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Button } from "antd";
import mapboxgl from "mapbox-gl";

// Thêm CSS cho Mapbox GL JS
const mapboxCSS = `
@import url('https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css');

.mapboxgl-popup-content {
  padding: 10px;
  border-radius: 8px;
}

.mapboxgl-popup-close-button {
  font-size: 18px;
}

.custom-marker {
  background-color: #3b82f6;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 3px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.route-marker {
  background-color: #4285F4;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid white;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0,0,0,0.2);
}
`;

const MapComponent = ({ locations }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [coordinates, setCoordinates] = useState([]);
  const [summary, setSummary] = useState({ distance: "", duration: "" });
  const [isLoading, setIsLoading] = useState(false);
  const markersRef = useRef([]);
  const currentPopup = useRef(null);

  const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = mapboxCSS;
    document.head.appendChild(styleElement);

    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [106.6297, 10.8231],
      zoom: 12,
    });

    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new mapboxgl.FullscreenControl());

    mapInstance.current = map;

    // Thêm event listener để đóng popup khi click vào map
    map.on("click", () => {
      if (currentPopup.current) {
        currentPopup.current.remove();
        currentPopup.current = null;
      }
    });

    return () => {
      if (currentPopup.current) {
        currentPopup.current.remove();
      }
      map.remove();
    };
  }, [MAPBOX_TOKEN]);

  const clearMapObjects = useCallback(() => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    if (currentPopup.current) {
      currentPopup.current.remove();
      currentPopup.current = null;
    }

    if (mapInstance.current) {
      if (mapInstance.current.getSource("route")) {
        mapInstance.current.removeLayer("route");
        mapInstance.current.removeSource("route");
      }
    }
  }, []);

  const geocodeLocations = useCallback(async () => {
    if (!locations.length) return;

    setIsLoading(true);
    try {
      const results = await Promise.all(
        locations.map(async (loc) => {
          try {
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                loc.address
              )}.json?access_token=${MAPBOX_TOKEN}&country=VN&limit=1`
            );
            const data = await response.json();

            if (data.features && data.features.length > 0) {
              const [lng, lat] = data.features[0].center;
              return {
                lat,
                lng,
                name: loc.title,
                time: loc.time,
                address: loc.address,
              };
            }
            return null;
          } catch (error) {
            console.error(`Lỗi geocoding cho ${loc.address}:`, error);
            return null;
          }
        })
      );

      const validCoordinates = results.filter(Boolean);
      if (validCoordinates.length > 0) {
        setCoordinates(validCoordinates);
      } else {
        console.error("Không có tọa độ hợp lệ nào được tìm thấy");
      }
    } catch (error) {
      console.error("Lỗi khi geocoding:", error);
    } finally {
      setIsLoading(false);
    }
  }, [locations, MAPBOX_TOKEN]);

  useEffect(() => {
    geocodeLocations();
  }, [geocodeLocations]);

  const createRoute = useCallback(
    async (coords) => {
      if (coords.length < 2) return null;

      try {
        const coordinatesString = coords
          .map((coord) => `${coord.lng},${coord.lat}`)
          .join(";");

        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinatesString}?geometries=geojson&access_token=${MAPBOX_TOKEN}&language=vi`
        );

        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          return data.routes[0];
        }
        return null;
      } catch (error) {
        console.error("Lỗi tạo route:", error);
        return null;
      }
    },
    [MAPBOX_TOKEN]
  );

  const showPopup = useCallback((content, lngLat) => {
    // Đóng popup hiện tại nếu có
    if (currentPopup.current) {
      currentPopup.current.remove();
    }

    // Tạo popup mới
    const popup = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false,
      offset: 25,
    })
      .setLngLat(lngLat)
      .setHTML(content)
      .addTo(mapInstance.current);

    currentPopup.current = popup;

    // Xử lý khi popup bị đóng
    popup.on("close", () => {
      currentPopup.current = null;
    });
  }, []);

  useEffect(() => {
    if (!mapInstance.current || coordinates.length === 0) return;

    const displayMap = async () => {
      clearMapObjects();

      // Tạo markers cho các địa điểm
      coordinates.forEach((loc, index) => {
        const markerElement = document.createElement("div");
        markerElement.className = "custom-marker";
        markerElement.textContent = (index + 1).toString();

        const marker = new mapboxgl.Marker(markerElement)
          .setLngLat([loc.lng, loc.lat])
          .addTo(mapInstance.current);

        // Xử lý click vào marker
        markerElement.addEventListener("click", (e) => {
          e.stopPropagation();

          const popupContent = `
            <div style="padding: 8px; max-width: 200px;">
              <h3 style="margin: 0 0 5px 0; font-size: 16px; color: #333;">${
                index + 1
              }. ${loc.name}</h3>
              <p style="margin: 0; font-size: 14px; color: #666;">⏰ ${
                loc.time
              }</p>
              <p style="margin: 5px 0 0 0; font-size: 12px; color: #888;">${
                loc.address
              }</p>
            </div>
          `;

          showPopup(popupContent, [loc.lng, loc.lat]);
        });

        markersRef.current.push(marker);
      });

      // Tạo route nếu có nhiều hơn 1 điểm
      if (coordinates.length > 1) {
        const route = await createRoute(coordinates);

        if (route) {
          // Thêm route lên map
          mapInstance.current.addSource("route", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: route.geometry,
            },
          });

          mapInstance.current.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#3b82f6",
              "line-width": 4,
            },
          });

          const totalDistance = route.distance / 1000; // km
          const totalDuration = route.duration / 60; // phút

          setSummary({
            distance: totalDistance.toFixed(2) + " km",
            duration: Math.floor(totalDuration) + " phút",
          });

          // Thêm markers cho route segments
          if (route.legs) {
            route.legs.forEach((leg, index) => {
              if (index < coordinates.length - 1) {
                const start = coordinates[index];
                const end = coordinates[index + 1];
                const midpoint = {
                  lng: (start.lng + end.lng) / 2,
                  lat: (start.lat + end.lat) / 2,
                };

                const routeMarkerElement = document.createElement("div");
                routeMarkerElement.className = "route-marker";

                const routeMarker = new mapboxgl.Marker(routeMarkerElement)
                  .setLngLat([midpoint.lng, midpoint.lat])
                  .addTo(mapInstance.current);

                // Xử lý click vào route marker
                routeMarkerElement.addEventListener("click", (e) => {
                  e.stopPropagation();

                  const routePopupContent = `
                    <div style="padding: 8px; min-width: 180px;">
                      <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #333;">
                        📍 ${start.name} → ${end.name}
                      </h4>
                      <div style="background: #f5f5f5; padding: 8px; border-radius: 4px; margin-bottom: 8px;">
                        <p style="margin: 0 0 4px 0; font-size: 13px;">
                          <strong>🚗 Thời gian: ${Math.floor(
                            leg.duration / 60
                          )} phút</strong>
                        </p>
                        <p style="margin: 0; font-size: 13px;">
                          <strong>📏 Khoảng cách: ${(
                            leg.distance / 1000
                          ).toFixed(1)} km</strong>
                        </p>
                      </div>
                      <a href="https://www.google.com/maps/dir/?api=1&origin=${
                        start.lat
                      },${start.lng}&destination=${end.lat},${end.lng}" 
                         target="_blank" rel="noopener noreferrer" 
                         style="color: #1890ff; text-decoration: none; font-size: 12px;">
                        🧭 Mở Google Maps để chỉ đường
                      </a>
                    </div>
                  `;

                  showPopup(routePopupContent, [midpoint.lng, midpoint.lat]);
                });

                markersRef.current.push(routeMarker);
              }
            });
          }
        }
      }

      // Fit bounds để hiển thị tất cả các điểm
      if (coordinates.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        coordinates.forEach((coord) => {
          bounds.extend([coord.lng, coord.lat]);
        });
        mapInstance.current.fitBounds(bounds, { padding: 50 });
      }
    };

    displayMap();
  }, [coordinates, clearMapObjects, createRoute, showPopup]);

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
    if (mapInstance.current && coordinates.length) {
      // Đóng popup hiện tại
      if (currentPopup.current) {
        currentPopup.current.remove();
        currentPopup.current = null;
      }

      const bounds = new mapboxgl.LngLatBounds();
      coordinates.forEach((coord) => {
        bounds.extend([coord.lng, coord.lat]);
      });
      mapInstance.current.fitBounds(bounds, { padding: 50 });
    }
  };

  const handleLocationClick = (loc, index) => {
    if (mapInstance.current) {
      // Di chuyển camera đến vị trí
      mapInstance.current.flyTo({
        center: [loc.lng, loc.lat],
        zoom: 15,
        duration: 1000,
      });

      // Hiển thị popup sau khi animation hoàn thành
      setTimeout(() => {
        const popupContent = `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="margin: 0 0 5px 0; font-size: 16px; color: #333;">${
              index + 1
            }. ${loc.name}</h3>
            <p style="margin: 0; font-size: 14px; color: #666;">⏰ ${
              loc.time
            }</p>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #888;">${
              loc.address
            }</p>
          </div>
        `;

        showPopup(popupContent, [loc.lng, loc.lat]);
      }, 1000);
    }
  };

  return (
    <div>
      {!MAPBOX_TOKEN || !MAPBOX_TOKEN.includes("pk.ey") ? (
        <div style={{ padding: "20px", textAlign: "center", color: "#ff4d4f" }}>
          Vui lòng cấu hình Mapbox Access Token để sử dụng bản đồ.
        </div>
      ) : null}

      {isLoading && (
        <div style={{ padding: "10px", textAlign: "center", color: "#1890ff" }}>
          Đang tải dữ liệu địa điểm...
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
                style={{
                  cursor: "pointer",
                  color: "blue",
                  marginBottom: "5px",
                  padding: "4px",
                  borderRadius: "4px",
                }}
                onClick={() => handleLocationClick(loc, index)}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#f0f0f0";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                }}
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
