import gcpAPI from "./gcp"; // ✅ 외부 axios 인스턴스 import

// 전체 매물 조회
export const fetchAllLivingSpace = async (query = "상인동") => {
  try {
    console.log("📡 요청 query:", query);
    const response = await gcpAPI.get("/listings/search", {
      params: { query },
    });
    console.log("📥 받은 응답:", response.data);

    // listings 키에서 추출
    const listings = Array.isArray(response.data.listings) ? response.data.listings : [];
    console.log("✅ 추출된 listings 배열:", listings);
    return listings;
  } catch (error) {
    const errorMessage = error.response
      ? `에러: ${error.response.status} - ${error.response.data.message || "알 수 없는 에러"}`
      : error.message || "네트워크 에러";
    console.error("❌ LivingSpace fetch 실패:", errorMessage);
    throw new Error(errorMessage);
  }
};

// ID로 개별 매물 조회
export const fetchListingById = async (id) => {
  const response = await gcpAPI.get(`/listings/${id}`);
  return response.data;
};

// AI 요약 문장 생성 요청
export const fetchAiSummary = async (data) => {
  const response = await gcpAPI.post("/summary", {
    address: data.address,
    netLeasableArea: data.area,
    deposit: data.deposit,
    monthly: data.monthly,
  });
  return response.data.summary;
};


/**
 * 주변 시설 정보 조회
 * @param {string} address - 주소 (예: "대구 달서구 상인동 1456-11")
 * @returns {Promise<Object>} 카페, 편의점, 병원 등 카테고리별 데이터 객체
 */
export const fetchFacilitiesByAddress = async (address) => {
  try {
    const encoded = encodeURIComponent(address);
    const res = await gcpAPI.get(`/facilities?query=${encoded}`);
    return res.data;
  } catch (err) {
    console.error("❌ 시설 정보 API 호출 실패:", err);
    throw err;
  }
};