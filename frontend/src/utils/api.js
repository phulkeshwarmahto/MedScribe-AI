import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const generateSOAP = async (summary, language = "english") => {
  const res = await axios.post(`${BASE_URL}/soap-note`, { summary, language });
  return res.data.soap;
};

export const explainRx = async (imageFile, language) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("language", language);
  const res = await axios.post(`${BASE_URL}/explain-rx`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data.explanation;
};
