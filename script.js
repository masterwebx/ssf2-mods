// script.js
document.getElementById("dataForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    // Get JSON data from form
    const jsonData = document.getElementById("jsonData").value;

    try {
        // Parse JSON data
        const parsedData = JSON.parse(jsonData);

        // Validate JSON structure
        const validStructure = validateJSONStructure(parsedData);

        if (validStructure) {
            // Fetch existing JSON file
            fetch("data.json")
                .then(response => response.json())
                .then(existingData => {
                    // Merge user-submitted data with existing data
                    const newData = {
                        ...existingData,
                        newData: parsedData
                    };

                    // Convert merged data to JSON string
                    const json = JSON.stringify(newData, null, 4);

                    // Update existing JSON file
                    fetch("data.json", {
                        method: "PUT",
                        body: json,
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                    .then(() => {
                        // Provide download link to users
                        const downloadLink = document.createElement("a");
                        downloadLink.href = "data.json";
                        downloadLink.download = "data.json";
                        downloadLink.textContent = "Download Updated Data";
                        document.body.appendChild(downloadLink);
                    })
                    .catch(error => console.error("Error updating JSON file:", error));
                })
                .catch(error => console.error("Error fetching JSON file:", error));
        } else {
            alert("Invalid JSON structure. Please make sure the JSON data has the correct structure.");
        }
    } catch (error) {
        alert("Invalid JSON format. Please enter valid JSON data.");
    }
});

function validateJSONStructure(data) {
    // Check if data has the same subsections as the provided example
    return (
        data.hasOwnProperty("info") &&
        data.hasOwnProperty("paletteSwap") &&
        data.hasOwnProperty("paletteSwapPA") &&
        typeof data.info === "string" &&
        typeof data.paletteSwap === "object" &&
        typeof data.paletteSwapPA === "object" &&
        Array.isArray(data.paletteSwap.colors) &&
        Array.isArray(data.paletteSwap.replacements) &&
        Array.isArray(data.paletteSwapPA.colors) &&
        Array.isArray(data.paletteSwapPA.replacements)
    );
}
