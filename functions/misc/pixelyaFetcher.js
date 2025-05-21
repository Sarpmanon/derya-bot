async function fetchPixelya(link, method, factionID) {
    if (method == "GET") {
      try {
        const response = await fetch(link);
        if (!response.ok) throw new Error(`[HTTP ERROR] - Status: ${response.status}`);

        const data = await response.json();
        return data;
      } catch (error) {
        console.log(`[PIXELYA FETCHER ERROR] - GET ${error}`)
      }
    } else if (method == "POST") {
      try {
        const json = await fetch(link, {
            method: "POST",
            body: JSON.stringify({
              id: factionID
            }),
            headers: {
              "Content-type": "application/json"
            }
          })

          const data = await json.json()
          return data;
      } catch (error) {
        console.log(`[PIXELYA FETCHER ERROR] - POST ${error}`)
      }
    }
}

module.exports = fetchPixelya;