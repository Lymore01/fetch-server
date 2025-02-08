import axios from "axios";

export default async (req, res) => {
  try {
    const authToken = req.headers.authorization;
    if (!authToken || authToken !== process.env.AUTH_TOKEN) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // parameters from query string
    const { channelId, maxResults = 50 } = req.query;

    // Fetch from YouTube API
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          channelId,
          maxResults,
          type: "video",
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

    // Return simplified items
    const items = response.data.items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      channelTitle: item.snippet.channelTitle,
    }));

    res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN);
    res.status(200).json(items);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({
      error: error.response?.data?.error?.message || "Server error",
    });
  }
};
