import { Handler } from "@netlify/functions";
import { getLiveStreams } from "../../src/api/liveTv.ts";

export const handler: Handler = async (event, context) => {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const data = await getLiveStreams(apiKey);
    
    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.error("Netlify Function Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
