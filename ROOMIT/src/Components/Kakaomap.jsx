import React, { useEffect } from "react";

export default function KakaoMap({
  livingSpace,
  id,
  style,
  disableControls = false,
  facilityData = {},
  selectedCategories = {},
}) {
  useEffect(() => {
    if (!livingSpace?.lat || !livingSpace?.lng) return;

    let facilityMarkers = [];

    const clearMarkers = () => {
      facilityMarkers.forEach((marker) => marker.setMap(null));
      facilityMarkers = [];
    };

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
        });

        // 메인 매물 마커
        new window.kakao.maps.Marker({ position: coords, map });

        // 시설 분류 맵핑
        const categoryMap = {
          "편의점": "convenience_stores",
          "카페": "cafes",
          "체육관": "gyms",
          "기차역": "subway_stations",
          "병원": "hospitals",
        };

        // 아이콘 이미지 매핑
        const imageSrcMap = {
          "편의점": "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png",
          "카페": "https://maps.gstatic.com/mapfiles/ms2/micons/coffeehouse.png",
          "체육관": "https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png",
          "기차역": "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png",
          "병원": "https://maps.gstatic.com/mapfiles/ms2/micons/hospitals.png",
        };


        clearMarkers(); // ✅ 기존 마커 제거

        // 선택된 카테고리에 대한 마커 생성
        Object.entries(selectedCategories).forEach(([label, isOn]) => {
          if (!isOn) return;

          const categoryKey = categoryMap[label];
          const places = facilityData?.[categoryKey] || [];

          places.forEach((place) => {
            const imageSrc = imageSrcMap[label];
            const imageSize = new window.kakao.maps.Size(30, 30);
            const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);

            const marker = new window.kakao.maps.Marker({
              map,
              position: new window.kakao.maps.LatLng(place.lat, place.lng),
              title: place.name,
              image: markerImage,
            });

            facilityMarkers.push(marker); // 저장해서 나중에 제거할 수 있게

            const infowindow = new window.kakao.maps.InfoWindow({
              content: `<div style="padding:5px;font-size:12px">${place.name}</div>`,
            });

            window.kakao.maps.event.addListener(marker, "click", () => {
              infowindow.open(map, marker);
            });
          });
        });
      });
    };

    // 카카오맵 로딩 여부 확인
    if (window.kakao?.maps) {
      loadMap();
    } else {
      const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
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
  }, [livingSpace, id, disableControls, facilityData, selectedCategories]);

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
