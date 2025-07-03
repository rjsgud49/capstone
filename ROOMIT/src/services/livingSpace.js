import gcpAPI from "./gcp"; // ✅ 외부 axios 인스턴스 import
import axios from "axios"; // ✅ axios 라이브러리 import

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});

// 전체 매물 조회
export const fetchAllLivingSpace = async (query = "상인동") => {
  try {
    console.log("📡 요청 query:", query);
    const response = await api.get("/listings/search", {
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
  const response = await api.get(`/listings/${id}`);
  return response.data;
};

// AI 요약 문장 생성 요청
export const fetchAiSummary = async (data) => {
  const response = await api.post("/summary", {
    address: data.address,
    netLeasableArea: data.area,
    deposit: data.deposit,
    monthly: data.monthly,
  });
  return response.data.summary;
};
