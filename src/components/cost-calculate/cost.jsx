import React, { useState, useEffect } from "react";
import { MapPin, Utensils, Hotel, Gamepad2, Calculator } from "lucide-react";
import "./cost.scss";

const CostCalculator = ({ eventData, numberOfNights }) => {
  const [costBreakdown, setCostBreakdown] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  const parsePrice = (priceString) => {
    if (!priceString) return 0;
    const cleanPrice = priceString.replace(/[đ.,\s]/g, "");
    return parseInt(cleanPrice) || 0;
  };

  const getMinPrice = (priceRange) => {
    if (!priceRange || !priceRange.includes("-")) return parsePrice(priceRange);

    const prices = priceRange.split("-").map((p) => parsePrice(p.trim()));
    return Math.min(...prices);
  };

  const getCheapestRoom = (rooms) => {
    if (!rooms || rooms.length === 0)
      return { price: 0, name: "Không có phòng" };

    const cheapestRoom = rooms.reduce((min, room) => {
      const currentPrice = room.price;
      const minPrice = min.price;
      return currentPrice < minPrice ? room : min;
    });

    return {
      price: cheapestRoom.price,
      name: cheapestRoom.name,
    };
  };

  const getServiceType = (title) => {
    if (title.includes("Vui chơi tại"))
      return { type: "entertainment", icon: <Gamepad2 />, color: "#10B981" };
    if (title.includes("Ăn tại"))
      return { type: "restaurant", icon: <Utensils />, color: "#F59E0B" };
    if (title.includes("Nghỉ dưỡng"))
      return { type: "hotel", icon: <Hotel />, color: "#8B5CF6" };
    return { type: "sightseeing", icon: <MapPin />, color: "#3B82F6" };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  useEffect(() => {
    let hasHandledHotel = false;
    const seenTitles = new Set();
    let firstResortFound = false;

    const filteredEventData = eventData.filter((item) => {
      const title = item.title;

      if (title.startsWith("Nghỉ trưa tại")) {
        return false;
      }

      if (title.startsWith("Nghỉ dưỡng tại")) {
        if (!firstResortFound) {
          firstResortFound = true;
        } else {
          return false;
        }
      }

      if (seenTitles.has(title)) {
        return false;
      }

      seenTitles.add(title);
      return true;
    });

    const breakdown = filteredEventData
      .map((item) => {
        const serviceInfo = getServiceType(item.title);
        let cost = 0;
        let details = "";

        if (item.title.includes("Nghỉ dưỡng tại")) {
          if (hasHandledHotel) {
            return null;
          }
          hasHandledHotel = true;

          const cheapestRoom = getCheapestRoom(item.room);
          cost = cheapestRoom.price * numberOfNights;
          details = `Phòng rẻ nhất: ${cheapestRoom.name} - ${formatCurrency(
            cheapestRoom.price
          )} - ${numberOfNights} đêm`;
        } else if (item.title.includes("Vui chơi tại")) {
          cost = parsePrice(item.price);
          details = `Vé: ${item.price || "0đ"}`;
        } else if (item.title.includes("Ăn tại")) {
          cost = getMinPrice(item.price);
          details = `Giá từ: ${item.price || "0đ"} (lấy giá thấp nhất)`;
        } else {
          cost = parsePrice(item.price);
          details = `Giá: ${item.price || "Miễn phí"}`;
        }

        return {
          id: item.id,
          title: item.title,
          cost: cost,
          details: details,
          serviceType: serviceInfo.type,
          icon: serviceInfo.icon,
          color: serviceInfo.color,
          date: item.start.toLocaleDateString("vi-VN"),
          time: `${item.start.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          })} - ${item.end.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          })}`,
        };
      })
      .filter(Boolean);

    setCostBreakdown(breakdown);
    // console.log("Cost Breakdown:", breakdown);
    const total = breakdown.reduce((sum, item) => sum + item.cost, 0);
    setTotalCost(total);
  }, [eventData]);

  return (
    <div className="cost-calculator">
      <h1 className="main-title">
        <Calculator />
        Tính Toán Chi Phí Du Lịch
      </h1>

      <div className="cost-breakdown-section">
        <h2 className="section-title">Chi Tiết Chi Phí</h2>

        {costBreakdown.map((item) => (
          <div
            key={item.id}
            className="cost-item"
            style={{ borderLeftColor: item.color }}
          >
            <div className="cost-item-content">
              <div className="cost-item-left">
                <div className="service-icon" style={{ color: item.color }}>
                  {item.icon}
                </div>
                <div className="service-details">
                  <h3 className="service-title">{item.title}</h3>
                  <div className="service-info">
                    <div className="datetime-info">
                      <span>📅 {item.date}</span>
                      <span>⏰ {item.time}</span>
                    </div>
                    <div className="price-details">{item.details}</div>
                  </div>
                </div>
              </div>
              <div className="cost-item-right">
                <div className="item-cost">{formatCurrency(item.cost)}</div>
                <div className="service-type">
                  {item.serviceType === "entertainment" && "Vui chơi"}
                  {item.serviceType === "restaurant" && "Ăn uống"}
                  {item.serviceType === "hotel" && "Lưu trú"}
                  {item.serviceType === "sightseeing" && "Tham quan"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="total-cost-card">
        <div className="total-cost-content">
          <div className="total-cost-left">
            <h2 className="total-title">Tổng Chi Phí</h2>
            <div className="total-subtitle">
              Tổng cộng {costBreakdown.length} hoạt động
            </div>
          </div>
          <div className="total-cost-right">
            <div className="total-amount">{formatCurrency(totalCost)}</div>
          </div>
        </div>
      </div>

      <div className="categories-grid">
        {["entertainment", "restaurant", "hotel", "sightseeing"].map((type) => {
          const items = costBreakdown.filter(
            (item) => item.serviceType === type
          );
          const categoryTotal = items.reduce((sum, item) => sum + item.cost, 0);
          const categoryNames = {
            entertainment: "Vui chơi",
            restaurant: "Ăn uống",
            hotel: "Lưu trú",
            sightseeing: "Tham quan",
          };
          const categoryIcons = {
            entertainment: <Gamepad2 />,
            restaurant: <Utensils />,
            hotel: <Hotel />,
            sightseeing: <MapPin />,
          };

          return (
            <div key={type} className="category-card">
              <div className="category-icon">{categoryIcons[type]}</div>
              <div className="category-name">{categoryNames[type]}</div>
              <div className="category-total">
                {formatCurrency(categoryTotal)}
              </div>
              <div className="category-count">{items.length} hoạt động</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CostCalculator;
