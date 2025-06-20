class TravelScheduler {
  constructor() {
    this.timeSlots = {
      sight: [
        { start: 8, end: 12, duration: 4 },
        { start: 14, end: 18, duration: 4 },
      ],
      entertainment: [
        { start: 8, end: 12, duration: 4 },
        { start: 14, end: 18, duration: 4 },
      ],
      restaurant: [
        { start: 11, end: 12, duration: 1 },
        { start: 19, end: 20, duration: 1 },
      ],
      hotel: [
        { start: 12, end: 13, duration: 1 },
        { start: 21, end: 8, duration: 11 },
      ],
    };
  }

  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  toRad(deg) {
    return deg * (Math.PI / 180);
  }

  formatServiceTitle(service, isNoonRest = false) {
    const prefixes = {
      sight: "Tham quan ",
      entertainment: "Vui chơi tại ",
      hotel: "Nghỉ dưỡng tại ",
      restaurant: "Ăn tại ",
    };

    if (service.type === "hotel") {
      return isNoonRest
        ? `Nghỉ trưa tại ${service.name}`
        : `${prefixes[service.type]}${service.name}`;
    }

    return `${prefixes[service.type] || ""}${service.name}`;
  }

  createVirtualHotel(services) {
    if (services.length === 0) {
      return {
        id: "virtual-hotel",
        name: "Địa điểm tạm thời",
        type: "hotel",
        lat: 21.0285,
        lng: 105.8542,
      };
    }

    const validServices = services.filter((s) => s.lat && s.lng);
    if (validServices.length === 0) {
      return {
        id: "virtual-hotel",
        name: "Địa điểm tạm thời",
        type: "hotel",
        lat: 21.0285,
        lng: 105.8542,
      };
    }

    const avgLat =
      validServices.reduce((sum, s) => sum + s.lat, 0) / validServices.length;
    const avgLng =
      validServices.reduce((sum, s) => sum + s.lng, 0) / validServices.length;

    return {
      id: "virtual-hotel",
      name: "Điểm nghỉ ngơi",
      type: "hotel",
      lat: avgLat,
      lng: avgLng,
    };
  }

  optimizeSchedule(services, numberOfDays = 3) {
    if (!Array.isArray(services) || services.length === 0) {
      console.warn("Services array is empty, creating empty schedule");
      return Array.from({ length: numberOfDays }, (_, i) => ({
        day: i + 1,
        events: [],
      }));
    }

    const validServices = services.filter(
      (s) =>
        s &&
        s.lat !== undefined &&
        s.lng !== undefined &&
        s.lat !== null &&
        s.lng !== null
    );

    if (validServices.length === 0) {
      console.warn("No valid services with coordinates found");
      return Array.from({ length: numberOfDays }, (_, i) => ({
        day: i + 1,
        events: [],
      }));
    }

    const schedule = [];
    let hotel = validServices.find((s) => s.type === "hotel");

    if (!hotel) {
      hotel = this.createVirtualHotel(validServices);
      console.log("Created virtual hotel:", hotel);
    }

    const otherServices = validServices.filter((s) => s.type !== "hotel");
    const globalUsedServices = new Set();

    if (otherServices.length === 0) {
      for (let day = 0; day < numberOfDays; day++) {
        schedule.push({
          day: day + 1,
          events: this.createMinimalDaySchedule(hotel, day, numberOfDays),
        });
      }
      return schedule;
    }

    const servicesPerDay = this.distributeServicesAcrossDays(
      otherServices,
      numberOfDays
    );

    for (let day = 0; day < numberOfDays; day++) {
      const dayServices = servicesPerDay[day] || [];
      const daySchedule = this.scheduleSingleDayWithAllServices(
        dayServices,
        hotel,
        day,
        globalUsedServices,
        numberOfDays
      );
      schedule.push({
        day: day + 1,
        events: daySchedule,
      });
    }

    const remainingServices = otherServices.filter(
      (s) => !globalUsedServices.has(s.id)
    );
    if (remainingServices.length > 0) {
      console.log(
        `Còn ${remainingServices.length} dịch vụ chưa được xếp:`,
        remainingServices.map((s) => s.name)
      );
      this.addRemainingServices(
        schedule,
        remainingServices,
        hotel,
        globalUsedServices
      );
    }

    return schedule;
  }

  createMinimalDaySchedule(hotel, dayIndex, totalDays) {
    const isLastDay = dayIndex === totalDays - 1;
    const events = [];
    events.push({
      id: `${hotel.id}-12-day${dayIndex}`,
      title: this.formatServiceTitle(hotel, true),
      start: this.formatTime(12),
      end: this.formatTime(13),
      extendedProps: {
        service: hotel,
        type: "hotel",
      },
    });

    if (!isLastDay) {
      events.push({
        id: `${hotel.id}-21-day${dayIndex}`,
        title: this.formatServiceTitle(hotel, false),
        start: this.formatTime(21),
        end: this.formatTime(32),
        extendedProps: {
          service: hotel,
          type: "hotel",
        },
      });
    }

    return events;
  }

  distributeServicesAcrossDays(services, numberOfDays) {
    const servicesPerDay = Array.from({ length: numberOfDays }, () => []);
    const servicesByType = {
      sight: services.filter((s) => s.type === "sight"),
      entertainment: services.filter((s) => s.type === "entertainment"),
      restaurant: services.filter((s) => s.type === "restaurant"),
    };

    Object.keys(servicesByType).forEach((type) => {
      const typeServices = servicesByType[type];
      typeServices.forEach((service, index) => {
        const dayIndex = index % numberOfDays;
        servicesPerDay[dayIndex].push(service);
      });
    });

    return servicesPerDay;
  }

  scheduleSingleDayWithAllServices(
    dayServices,
    hotel,
    dayIndex,
    globalUsedServices,
    totalDays
  ) {
    const dayEvents = [];
    const isLastDay = dayIndex === totalDays - 1;

    if (!hotel || !hotel.lat || !hotel.lng) {
      console.error(
        "Hotel missing coordinates in scheduleSingleDayWithAllServices:",
        hotel
      );
      return dayEvents;
    }

    const flexibleTimeFramework = this.createFlexibleTimeFramework(
      dayServices,
      isLastDay
    );

    let currentLocation = hotel;

    flexibleTimeFramework.forEach((slot) => {
      if (slot.type.includes("hotel")) {
        const isNoonRest = slot.time === 12;
        dayEvents.push({
          id: `${hotel.id}-${slot.time}-day${dayIndex}`,
          title: this.formatServiceTitle(hotel, isNoonRest),
          start: this.formatTime(slot.time),
          end: this.formatTime(slot.time + slot.duration),
          extendedProps: {
            service: hotel,
            type: "hotel",
          },
        });
        currentLocation = hotel;
        return;
      }

      const availableServices = dayServices.filter(
        (s) => slot.type.includes(s.type) && !globalUsedServices.has(s.id)
      );

      if (availableServices.length > 0) {
        const validServices = availableServices.filter(
          (s) => s.lat !== undefined && s.lng !== undefined
        );

        if (validServices.length === 0) {
          console.warn(
            "No valid services with coordinates found for slot:",
            slot
          );
          return;
        }

        if (!currentLocation || !currentLocation.lat || !currentLocation.lng) {
          console.error(
            "currentLocation missing coordinates:",
            currentLocation
          );
          currentLocation = hotel;
        }

        const sortedServices = validServices.sort((a, b) => {
          const distA = this.calculateDistance(
            currentLocation.lat,
            currentLocation.lng,
            a.lat,
            a.lng
          );
          const distB = this.calculateDistance(
            currentLocation.lat,
            currentLocation.lng,
            b.lat,
            b.lng
          );
          return distA - distB;
        });

        const selectedService = sortedServices[0];
        globalUsedServices.add(selectedService.id);

        dayEvents.push({
          id: `${selectedService.id}-${slot.time}-day${dayIndex}`,
          title: this.formatServiceTitle(selectedService),
          start: this.formatTime(slot.time),
          end: this.formatTime(slot.time + slot.duration),
          extendedProps: {
            service: selectedService,
            type: selectedService.type,
            distance: this.calculateDistance(
              currentLocation.lat,
              currentLocation.lng,
              selectedService.lat,
              selectedService.lng
            ).toFixed(2),
          },
        });

        currentLocation = selectedService;
      }
    });

    return dayEvents;
  }

  createFlexibleTimeFramework(dayServices, isLastDay = false) {
    const sightEntertainmentServices = dayServices.filter(
      (s) => s.type === "sight" || s.type === "entertainment"
    );
    const restaurantServices = dayServices.filter(
      (s) => s.type === "restaurant"
    );

    const sightEntertainmentCount = sightEntertainmentServices.length;
    const restaurantCount = restaurantServices.length;

    const framework = [];

    if (sightEntertainmentCount > 0) {
      const morningSlots = Math.min(sightEntertainmentCount, 2);
      for (let i = 0; i < morningSlots; i++) {
        framework.push({
          time: 8 + i * 2,
          type: ["sight", "entertainment"],
          duration: 2,
        });
      }
    }

    if (restaurantCount > 0) {
      framework.push({
        time: 11,
        type: ["restaurant"],
        duration: 1,
      });
    }

    framework.push({
      time: 12,
      type: ["hotel"],
      duration: 1,
    });

    if (sightEntertainmentCount > 0) {
      const remainingSightEntertainment =
        sightEntertainmentCount - Math.min(sightEntertainmentCount, 2);
      const afternoonSlots = Math.min(remainingSightEntertainment, 2);
      for (let i = 0; i < afternoonSlots; i++) {
        framework.push({
          time: 14 + i * 2,
          type: ["sight", "entertainment"],
          duration: 2,
        });
      }
    }

    if (
      restaurantCount > 1 ||
      (restaurantCount === 1 &&
        !framework.find((f) => f.type.includes("restaurant")))
    ) {
      framework.push({
        time: 19,
        type: ["restaurant"],
        duration: 1,
      });
    }

    if (!isLastDay) {
      framework.push({
        time: 21,
        type: ["hotel"],
        duration: 11,
      });
    }

    return framework.sort((a, b) => a.time - b.time);
  }

  addRemainingServices(schedule, remainingServices, hotel, globalUsedServices) {
    remainingServices.forEach((service) => {
      let added = false;

      for (let dayIndex = 0; dayIndex < schedule.length && !added; dayIndex++) {
        const day = schedule[dayIndex];
        const possibleTimes = this.findAvailableSlots(day.events, service.type);

        if (possibleTimes.length > 0) {
          const bestTime = possibleTimes[0];
          const duration = this.getServiceDuration(service.type);

          day.events.push({
            id: `${service.id}-${bestTime}-day${dayIndex}`,
            title: this.formatServiceTitle(service),
            start: this.formatTime(bestTime),
            end: this.formatTime(bestTime + duration),
            extendedProps: {
              service: service,
              type: service.type,
              distance: "0.00",
            },
          });

          day.events.sort((a, b) => a.start.localeCompare(b.start));
          globalUsedServices.add(service.id);
          added = true;
        }
      }

      if (!added) {
        console.warn(`Không thể xếp dịch vụ: ${service.name}`);
      }
    });
  }

  getServiceDuration(serviceType) {
    switch (serviceType) {
      case "restaurant":
        return 1;
      case "sight":
      case "entertainment":
        return 2;
      case "hotel":
        return 1;
      default:
        return 2;
    }
  }

  findAvailableSlots(dayEvents, serviceType) {
    const occupiedTimes = dayEvents
      .map((event) => {
        const startHour = parseInt(event.start.split(":")[0]);
        const endHour = parseInt(event.end.split(":")[0]);
        return { start: startHour, end: endHour };
      })
      .sort((a, b) => a.start - b.start);

    const availableSlots = [];
    const duration = this.getServiceDuration(serviceType);

    for (let hour = 8; hour <= 20; hour++) {
      const slotEnd = hour + duration;
      if (slotEnd > 21) continue;

      const isOccupied = occupiedTimes.some(
        (occupied) =>
          (hour >= occupied.start && hour < occupied.end) ||
          (slotEnd > occupied.start && slotEnd <= occupied.end) ||
          (hour < occupied.start && slotEnd > occupied.end)
      );

      if (!isOccupied) {
        const isValidTime = this.isValidTimeForService(hour, serviceType);
        if (isValidTime) {
          availableSlots.push(hour);
        }
      }
    }

    return availableSlots;
  }

  isValidTimeForService(hour, serviceType) {
    switch (serviceType) {
      case "sight":
      case "entertainment":
        return hour >= 8 && hour <= 18;
      case "restaurant":
        return (hour >= 11 && hour <= 12) || (hour >= 18 && hour <= 20);
      case "hotel":
        return hour === 12 || hour === 21;
      default:
        return hour >= 8 && hour <= 20;
    }
  }

  scheduleSingleDay(services, hotel, dayIndex, globalUsedServices = new Set()) {
    const dayEvents = [];

    if (!hotel) {
      hotel = this.createVirtualHotel(services);
    }

    if (!hotel || !hotel.lat || !hotel.lng) {
      console.error("Hotel missing coordinates in scheduleSingleDay:", hotel);
      return dayEvents;
    }

    const timeFramework = [
      { time: 8, type: ["sight", "entertainment"], duration: 4 },
      { time: 11, type: ["restaurant"], duration: 1 },
      { time: 12, type: ["hotel"], duration: 1 },
      { time: 14, type: ["sight", "entertainment"], duration: 4 },
      { time: 19, type: ["restaurant"], duration: 1 },
      { time: 21, type: ["hotel"], duration: 11 },
    ];

    let currentLocation = hotel;

    timeFramework.forEach((slot) => {
      if (slot.type.includes("hotel")) {
        const isNoonRest = slot.time === 12;
        dayEvents.push({
          id: `${hotel.id}-${slot.time}-day${dayIndex}`,
          title: this.formatServiceTitle(hotel, isNoonRest),
          start: this.formatTime(slot.time),
          end: this.formatTime(slot.time + slot.duration),
          extendedProps: {
            service: hotel,
            type: "hotel",
          },
        });
        currentLocation = hotel;
        return;
      }

      const availableServices = services.filter(
        (s) => slot.type.includes(s.type) && !globalUsedServices.has(s.id)
      );

      if (availableServices.length > 0) {
        const validServices = availableServices.filter(
          (s) => s.lat !== undefined && s.lng !== undefined
        );

        if (validServices.length === 0) {
          console.warn(
            "No valid services with coordinates found for slot:",
            slot
          );
          return;
        }

        const sortedServices = validServices.sort((a, b) => {
          const distA = this.calculateDistance(
            currentLocation.lat,
            currentLocation.lng,
            a.lat,
            a.lng
          );
          const distB = this.calculateDistance(
            currentLocation.lat,
            currentLocation.lng,
            b.lat,
            b.lng
          );
          return distA - distB;
        });

        const selectedService = sortedServices[0];
        globalUsedServices.add(selectedService.id);

        dayEvents.push({
          id: `${selectedService.id}-${slot.time}-day${dayIndex}`,
          title: this.formatServiceTitle(selectedService),
          start: this.formatTime(slot.time),
          end: this.formatTime(slot.time + slot.duration),
          extendedProps: {
            service: selectedService,
            type: selectedService.type,
            distance: this.calculateDistance(
              currentLocation.lat,
              currentLocation.lng,
              selectedService.lat,
              selectedService.lng
            ).toFixed(2),
          },
        });

        currentLocation = selectedService;
      }
    });

    return dayEvents;
  }

  formatTime(hour) {
    const adjustedHour = hour >= 24 ? hour - 24 : hour;
    return `${adjustedHour.toString().padStart(2, "0")}:00:00`;
  }

  optimizeWithSimulatedAnnealing(
    services,
    numberOfDays = 3,
    maxIterations = 1000
  ) {
    if (!Array.isArray(services) || services.length === 0) {
      console.warn(
        "Invalid services array for simulated annealing, returning empty schedule"
      );
      return Array.from({ length: numberOfDays }, (_, i) => ({
        day: i + 1,
        events: [],
      }));
    }

    let currentSchedule = this.optimizeSchedule(services, numberOfDays);

    if (!currentSchedule || currentSchedule.length === 0) {
      console.error(
        "Failed to create initial schedule for simulated annealing"
      );
      return Array.from({ length: numberOfDays }, (_, i) => ({
        day: i + 1,
        events: [],
      }));
    }

    const hasEvents = currentSchedule.some((day) => day.events.length > 0);
    if (!hasEvents) {
      return currentSchedule;
    }

    let currentCost = this.calculateTotalCost(currentSchedule);
    let bestSchedule = JSON.parse(JSON.stringify(currentSchedule));
    let bestCost = currentCost;

    let temperature = 1000;
    const coolingRate = 0.995;

    for (let i = 0; i < maxIterations; i++) {
      const newSchedule = this.generateNeighborSchedule(
        currentSchedule,
        services
      );
      const newCost = this.calculateTotalCost(newSchedule);

      if (
        newCost < currentCost ||
        Math.random() < Math.exp((currentCost - newCost) / temperature)
      ) {
        currentSchedule = newSchedule;
        currentCost = newCost;

        if (newCost < bestCost) {
          bestSchedule = JSON.parse(JSON.stringify(newSchedule));
          bestCost = newCost;
        }
      }

      temperature *= coolingRate;
    }

    return bestSchedule;
  }

  calculateTotalCost(schedule) {
    let totalDistance = 0;

    schedule.forEach((day) => {
      for (let i = 0; i < day.events.length - 1; i++) {
        const current = day.events[i].extendedProps.service;
        const next = day.events[i + 1].extendedProps.service;

        if (
          current &&
          next &&
          current.lat !== undefined &&
          current.lng !== undefined &&
          next.lat !== undefined &&
          next.lng !== undefined
        ) {
          totalDistance += this.calculateDistance(
            current.lat,
            current.lng,
            next.lat,
            next.lng
          );
        }
      }
    });

    return totalDistance;
  }

  generateNeighborSchedule(schedule, services) {
    const newSchedule = JSON.parse(JSON.stringify(schedule));

    const daysWithEvents = newSchedule.filter(
      (day) =>
        day.events.filter((e) => e.extendedProps.type !== "hotel").length >= 2
    );

    if (daysWithEvents.length === 0) {
      return newSchedule;
    }

    const randomDay =
      daysWithEvents[Math.floor(Math.random() * daysWithEvents.length)];
    const dayEvents = randomDay.events.filter(
      (e) => e.extendedProps.type !== "hotel"
    );

    if (dayEvents.length >= 2) {
      const idx1 = Math.floor(Math.random() * dayEvents.length);
      let idx2 = Math.floor(Math.random() * dayEvents.length);
      while (idx2 === idx1) {
        idx2 = Math.floor(Math.random() * dayEvents.length);
      }

      const service1 = dayEvents[idx1].extendedProps.service;
      const service2 = dayEvents[idx2].extendedProps.service;

      dayEvents[idx1].extendedProps.service = service2;
      dayEvents[idx1].title = this.formatServiceTitle(service2);
      dayEvents[idx2].extendedProps.service = service1;
      dayEvents[idx2].title = this.formatServiceTitle(service1);
    }

    return newSchedule;
  }

  convertToFullCalendarFormat(schedule, startDate = new Date()) {
    const events = [];

    schedule.forEach((day, index) => {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + index);
      const dateStr = currentDate.toISOString().split("T")[0];

      day.events.forEach((event) => {
        events.push({
          ...event,
          start: `${dateStr}T${event.start}`,
          end: `${dateStr}T${event.end}`,
          backgroundColor: this.getColorByType(event.extendedProps.type),
          borderColor: this.getColorByType(event.extendedProps.type),
        });
      });
    });

    return events;
  }

  getColorByType(type) {
    const colors = {
      sight: "#3788d8",
      entertainment: "#f39c12",
      restaurant: "#e74c3c",
      hotel: "#27ae60",
    };
    return colors[type] || "#95a5a6";
  }
}

export default TravelScheduler;
