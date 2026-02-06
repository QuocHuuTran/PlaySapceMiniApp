import { BASE_URL } from "@/constants/config";
import { CourtInfo } from "@/models/court";
export const fetchCourtInfo = async (comId: string): Promise<CourtInfo> => {
  try {
    const response = await fetch(`${BASE_URL}/api/get-company-by-id?comId=${comId}`);
    if (!response.ok) {
        throw new Error("Không thể lấy dữ liệu sân");
    }
    return await response.json();
  } catch (error) {
    console.error("Lỗi fetchCourtInfo:", error);
    throw error;
  }
};