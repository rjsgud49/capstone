import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});

export const fetchAllLivingSpace = async () => {
  const response = await api.get("/listings");
  return response.data;
};

export const fetchLivingSpace = async (id) => {
  try {
    const response = await api.get(`/listings/${id}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response
      ? `서버 에러: ${error.response.status} - ${error.response.data.message || "알 수 없는 에러"}`
      : error.message || "네트워크 에러가 발생했습니다.";
    console.error("❌ 매물 데이터를 가져오는 데 실패했습니다:", errorMessage);
    throw new Error(errorMessage);
  }
};

export const deleteLivingSpace = async (id) => {
  try {
    const response = await api.delete(`/listings/${id}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response
      ? `삭제 실패: ${error.response.status} - ${error.response.data.message || "알 수 없는 에러"}`
      : error.message || "네트워크 에러가 발생했습니다.";
    console.error("❌ 매물 삭제에 실패했습니다:", errorMessage);
    throw new Error(errorMessage);
  }
};

export const fetchFacilities = async (id) => {
  try {
    const response = await api.get(`/listings/${id}/facilities`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response
      ? `편의시설 불러오기 실패: ${error.response.status} - ${
          error.response.data.message || "알 수 없는 에러"
        }`
      : error.message || "네트워크 에러 발생";
    console.error("❌ 주변 편의시설 정보 실패:", errorMessage);
    throw new Error(errorMessage);
  }
};
