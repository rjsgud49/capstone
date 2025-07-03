import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

export default function KakaoMap({ livingSpace, id, style, disableControls = false }) {
  useEffect(() => {
    if (!livingSpace?.lat || !livingSpace?.lng) return;

    const loadMap = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        if (!container) return;

        const coords = new window.kakao.maps.LatLng(livingSpace.lat, livingSpace.lng);

        const map = new window.kakao.maps.Map(container, {
          center: coords,
          level: 4,
          draggable: !disableControls,
          scrollwheel: !disableControls,
          disableDoubleClickZoom: disableControls,
        });

        const marker = new window.kakao.maps.Marker({
          position: coords,
          map,
        });

        const content = `
          <div style="
            background: white;
            border-radius: 12px;
            padding: 10px 15px;
            font-size: 14px;
            color: #333;
            box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.1);
            min-width: 180px;
            max-width: 240px;
            white-space: nowrap;
            font-family: 'Segoe UI', sans-serif;
          ">
            <div style="font-weight: 600; font-size: 16px; color: #2a2a2a; margin-bottom: 4px;">
              📍 추천 매물
            </div>
            <div style="font-size: 13px; color: #666;">
              ${livingSpace.name}
            </div>
          </div>
        `;

        const customOverlay = new window.kakao.maps.CustomOverlay({
          content,
          position: coords,
          yAnchor: 1.5,
        });

        window.kakao.maps.event.addListener(marker, "click", () => {
          customOverlay.setMap(map);
        });
      });
    };

    if (window.kakao?.maps) loadMap();
    else {
      const existingScript = document.querySelector('script[src*="dapi.kakao.com/v2/maps/sdk.js"]');
      if (!existingScript) {
        const script = document.createElement("script");
        script.src =
          "https://dapi.kakao.com/v2/maps/sdk.js?appkey=75bc5cd267066eb95e92ea0808e8c631&autoload=false&libraries=services";
        script.async = true;
        script.onload = loadMap;
        document.head.appendChild(script);
      } else {
        existingScript.addEventListener("load", loadMap);
      }
    }
  }, [livingSpace, id, disableControls]);

  return (
    <div
      id="map"
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "10px",
        overflow: "hidden",
        ...style,
      }}
    >
      {!livingSpace?.lat || !livingSpace?.lng ? "지도 정보를 불러오는 중입니다..." : null}
    </div>
  );
}
