async function fetchPixelya(link, method, factionID) {
    if (method == "GET") {
        const response = await fetch(link);
        if (!response.ok) throw new Error(`[HTTP ERROR] - Status: ${response.status}`);

        const data = await response.json();
        return data;
    } else if (method == "POST") {
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
    }
}

module.exports = fetchPixelya;