import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export interface Producer {
  id: number;
  name: string;
  product: string;
  latitude: number;
  longitude: number;
  created_at: string;
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getProducers = async (): Promise<Producer[]> => {
  const response = await apiClient.get("/producers");
  return response.data;
};

export const createProducer = async (producer: Omit<Producer, "id" | "created_at">) => {
  const response = await apiClient.post("/producers", producer);
  return response.data;
};

export const deleteProducer = async (id: number) => {
  const response = await apiClient.delete(`/producers/${id}`);
  return response.data;
};

export default apiClient;
