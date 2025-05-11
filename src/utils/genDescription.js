const activityTypes = [
  {
    type: "sight",
    keywords: ["Tham quan", "Thăm", "Khám phá", "Chiêm ngưỡng"],
    sentence: (label) =>
      `Đoàn sẽ di chuyển đến tham quan **${label}**, một địa danh nổi bật với nét đẹp đặc trưng và giá trị văn hóa độc đáo.`,
  },
  {
    type: "hotel",
    keywords: ["Nghỉ dưỡng", "Resort", "Khách sạn"],
    sentence: (label) =>
      `Quý khách sẽ có thời gian nghỉ ngơi, thư giãn tại **${label}** – một nơi lý tưởng để tái tạo năng lượng sau hành trình.`,
  },
  {
    type: "restaurant",
    keywords: ["Ăn", "Nhà hàng", "Bún", "Phở", "Thưởng thức", "Quán ăn"],
    sentence: (label) =>
      `Đoàn sẽ dùng bữa tại **${label}**, nơi nổi tiếng với các món ăn đặc sản mang đậm hương vị địa phương.`,
  },
  {
    type: "entertainment",
    keywords: ["Vui chơi", "Công viên", "Khu giải trí", "Cáp treo", "Tour"],
    sentence: (label) =>
      `Tham gia các hoạt động giải trí thú vị tại **${label}**, hứa hẹn sẽ mang đến cho quý khách những trải nghiệm sôi động và đáng nhớ.`,
  },
];

function generateItineraryDescription(plan) {
  const itineraryByDate = {};

  plan.forEach((item) => {
    const [date, timeRange] = item.label.split(",");
    const day = date.trim();

    if (!itineraryByDate[day]) itineraryByDate[day] = [];

    const matchedActivity = activityTypes.find((type) =>
      type.keywords.some((keyword) =>
        item.children.toLowerCase().includes(keyword.toLowerCase())
      )
    );

    const description = matchedActivity
      ? `**${timeRange.trim()}**: ${matchedActivity.sentence(item.children)}`
      : `**${timeRange.trim()}**: ${item.children}`;

    itineraryByDate[day].push(description);
  });

  const result = Object.entries(itineraryByDate)
    .map(([day, activities], index) => {
      const formattedActivities = activities.join("\n\n");
      return `### Ngày ${index + 1} (${day})\n\n${formattedActivities}`;
    })
    .join("\n\n");

  return `## **LỊCH TRÌNH CHI TIẾT**\n\n${result}`;
}

export default generateItineraryDescription;
