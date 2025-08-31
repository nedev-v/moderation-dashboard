import { useState } from "react";
import axios from "axios";
import type { ModerationResponse } from "@/types";

export function useAudioModerationUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ModerationResponse | null>(null);

  const uploadAudio = async (file: File) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("audioFile", file);

      const { data } = await axios.post<ModerationResponse>(
        "http://localhost:3000/uploadAudio",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setResult(null);
  };

  return { uploadAudio, loading, error, result, reset };
}
