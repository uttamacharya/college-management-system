import {
  aiClient,
} from "@/lib/axios";

export const aiApi = {

  askAI: async (
    prompt: string
  ) => {

    const response =
      await aiClient.post(
        "/ask",
        {
          prompt,
        }
      );

    return response.data;
  },
};