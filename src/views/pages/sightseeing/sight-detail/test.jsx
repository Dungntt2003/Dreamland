import { useState } from "react";
import GoogleMapComponent from "components/google-maps/googleMaps";
const Test = () => {
  const [address, setAddress] = useState("");

  const handleSearch = () => {
    if (!address) {
      alert("Vui lòng nhập địa chỉ!");
    }
  };
  return (
    <div>
      <h1>Google Maps Keyless Example</h1>
      <input
        type="text"
        placeholder="Nhập địa chỉ"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button onClick={handleSearch}>Tìm kiếm</button>
      <GoogleMapComponent />
    </div>
  );
};

export default Test;
