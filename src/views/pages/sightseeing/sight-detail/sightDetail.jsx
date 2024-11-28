import "./sightDetail.scss";
import checkOpen from "utils/checkOpenTime";
import { Rating } from "react-simple-star-rating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faPlaceOfWorship } from "@fortawesome/free-solid-svg-icons";
const SightDetail = () => {
  const img_url =
    "https://realbiz.vn/wp-content/uploads/2023/06/nui-Langbiang-da-lat.jpg";
  const img_quantity = 5;
  const imgData = Array.from({ length: img_quantity }, () => img_url);

  const demoData = {
    name: "Hồ Tuyền Lâm",
    address: "Phường 4, thành phố Đà Lạt, tỉnh Lâm Đồng",
    description: `Giới thiệu chung:Nhắc đến du lịch Đà Lạt người ta thường liên tưởng những vườn hoa, hồ nước, vườn thú… Tuy nhiên hãy thử 1 lần bước chân vào thế giới hoang sơ, hùng vĩ của rừng thông Đà Lạt, nơi có cây cỏ hòa quyện cùng hoa lá tạo nên một bức tranh thiên nhiên tuyệt mỹ. Hứa hẹn bạn sẽ có những trải nghiệm sâu sắc không thể nào quên.;
                Cảnh đẹp:nhà cổ Hanok Hàn quốc, khu vườn đá, trà đạo nhật bản, rừng thông đỏ nguyên sinh, đồi hoa mộng mơ, trường đua mô hình Go Kart, chèo thuyền Kayak, vườn thượng uyển Trung Hoa, làng văn hóa Tây Nguyên, thác 7 tầng, con thuyền tình yêu;
                Ẩm thực:hệ thống nhà hàng cao cấp trong khu du lịch;
`,
    image: imgData,
    rating: 4.3,
    comments: [
      {
        comment: "Oishi",
      },
      {
        comment: "yokatta",
      },
    ],
    startTime: 0,
    endTime: 24,
  };
  console.log(demoData);
  console.log(checkOpen(demoData.startTime, demoData.endTime));
  return (
    <div>
      <div className="sight-detail-banner">
        <div className="sight-detail-name">{demoData.name}</div>
        <div className="sight-detail-open">
          <FontAwesomeIcon icon={faClock} />
          {checkOpen(demoData.startTime, demoData.endTime) === true
            ? "Đang mở cửa"
            : "Đóng cửa"}
        </div>

        <div className="sight-detail-address">
          <FontAwesomeIcon icon={faPlaceOfWorship} />
          {demoData.address}
        </div>
        <div className="sight-detail-ratings">
          <Rating initialValue={Math.round(demoData.rating)} readonly />
          <div>{demoData.rating}/5</div>
        </div>
      </div>
      <div className="sight-detail-menu"></div>
    </div>
  );
};

export default SightDetail;
