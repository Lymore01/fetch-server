import axios from "axios";
import express from "express";
const app = express();

app.get("/", (req, res) => res.send("Express on Vercel"));

app.get("/api/youtube/:channelId", async (req, res) => {
  const results = [];
  let pageToken = null;
  const baseURL = "https://www.googleapis.com/youtube/v3/search";

  try {
    do {
      const response = await axios.get(baseURL, {
        params: {
          part: "snippet",
          channelId: req.params.channelId,
          maxResults: 50,
          type: "video",
          key: "AIzaSyAbEgk0HUGGR5QRN-oGTnDbktemUu_DEX0",
          pageToken: pageToken,
        },
      });

      results.push(...response.data.items);
      pageToken = response.data.nextPageToken || null;
    } while (pageToken);

    res.json(results);
  } catch (error) {
    if (error.response) {
      throw new Error(
        `YouTube API Error: ${error.response.data.error.message}`
      );
    }
    throw error;
  }
});

app.listen(3000, () => console.log("Server ready on port 3000."));

export default app;
