import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding";

import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapboxgl.accessToken });

const MapboxMapWithAddress = ({ address }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [lngLat, setLngLat] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const geocodeAddress = async () => {
      if (!address?.trim()) return;

      setLoading(true);
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
          console.log("Coordinates found:", { lng, lat });
          setLngLat({ lng, lat });
        } else {
          console.warn("No geocoding results found for:", address);
        }
      } catch (error) {
        console.error("Geocoding error:", error);
      } finally {
        setLoading(false);
      }
    };

    geocodeAddress();
  }, [address]);

  useEffect(() => {
    if (!lngLat || !mapContainerRef.current) return;

    if (mapRef.current) {
      mapRef.current.remove();
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lngLat.lng, lngLat.lat],
      zoom: 15,
      attributionControl: false,
    });

    map.on("load", () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }

      const marker = new mapboxgl.Marker({
        color: "#FF0000",
        draggable: false,
      })
        .setLngLat([lngLat.lng, lngLat.lat])
        .addTo(map);

      markerRef.current = marker;

      map.flyTo({
        center: [lngLat.lng, lngLat.lat],
        zoom: 15,
        duration: 1000,
      });
    });

    map.on("load", () => {
      setTimeout(() => {
        map.resize();
      }, 100);
    });

    mapRef.current = map;

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [lngLat]);

  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) {
        setTimeout(() => {
          mapRef.current.resize();
        }, 100);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "500px" }}>
      {loading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
            background: "rgba(255, 255, 255, 0.9)",
            padding: "10px 20px",
            borderRadius: "5px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          Đang tải bản đồ...
        </div>
      )}
      <div
        ref={mapContainerRef}
        style={{
          width: "100%",
          height: "500px",
          borderRadius: "8px",
          border: "1px solid #ddd",
        }}
      />
      {!lngLat && !loading && address && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
            background: "rgba(255, 0, 0, 0.8)",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
          }}
        >
          Không tìm thấy địa chỉ: {address}
        </div>
      )}
    </div>
  );
};

export default MapboxMapWithAddress;
