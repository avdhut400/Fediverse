// utils/fetchInboxUrl.js
const axios = require("axios");

async function fetchInboxUrl(actorUrl) {
  try {
    const res = await axios.get(actorUrl, {
      headers: {
        Accept: "application/activity+json",
      },
    });

    if (res.status === 200 && res.data.inbox) {
      return res.data.inbox; 
    } else {
      console.error("⚠️ No inbox found in actor data for", actorUrl);
      return null;
    }
  } catch (error) {
    console.error("❌ Error fetching inbox URL from:", actorUrl, error.message);
     console.error("STATUS:", error.response?.status);
  console.error("DATA:", error.response?.data);
  console.error("HEADERS:", error.response?.headers);
  console.error("URL:", actorUrl);
    return null;
  }
}

module.exports = fetchInboxUrl;
