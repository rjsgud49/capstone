import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

export default function KakaoMap({ livingSpace, id }) {
  // const navigate = useNavigate();

  useEffect(() => {
    if (!livingSpace?.address) {
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://dapi.kakao.com/v2/maps/sdk.js?appkey=75bc5cd267066eb95e92ea0808e8c631&autoload=false&libraries=services";
    script.async = true;

    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          const container = document.getElementById("map");
          if (!container) return;

          const geocoder = new window.kakao.maps.services.Geocoder();
          const address = livingSpace.address;

          geocoder.addressSearch(address, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

              const map = new window.kakao.maps.Map(container, {
                center: coords,
                level: 4,
              });

              const marker = new window.kakao.maps.Marker({
                map,
                position: coords,
              });

              const infoWindow = new window.kakao.maps.InfoWindow({
                content: `<div style="padding:6px;font-size:14px;">📍 ${id}</div>`,
              });
              infoWindow.open(map, marker);
            } else {
              console.error("주소 좌표 변환 실패:", status);
            }
          });
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      const existing = document.querySelector(`script[src="${script.src}"]`);
      if (existing) existing.remove();
    };
  }, [livingSpace]);

  return (
    <div
      id="map"
      style={{
        width: "100%",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      {!livingSpace?.address && "지도 정보를 불러오는 중입니다..."}
    </div>
  );
}
