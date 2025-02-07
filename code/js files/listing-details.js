document.addEventListener("DOMContentLoaded", async function () {
    const apiKey = "6785c0de630e8a0e140b141d"; // Replace with your actual RestDB API Key
    const databaseUrl = "https://mokesellasg2-66c7.restdb.io/rest/listings"; // Your RestDB URL
    const listingContainer = document.getElementById("listing-details-container");

    // Get listing ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const listingId = urlParams.get("id");

    if (!listingId) {
        listingContainer.innerHTML = "<h2>❌ Listing not found!</h2>";
        return;
    }

    try {
        // Fetch the listing from RestDB
        const response = await fetch(`${databaseUrl}/${listingId}`, {
            method: "GET",
            headers: {
                "x-apikey": apiKey,
                "Cache-Control": "no-cache"
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch listing details.");
        }

        const listing = await response.json();

        // Update the page with listing details
        listingContainer.innerHTML = `
            <div class="listing-card">
                <img src="${listing.product_img ? listing.product_img[0] : 'placeholder.jpg'}" alt="${listing.product_name}">
                <h2>${listing.product_name}</h2>
                <p><strong>Price:</strong> $${parseFloat(listing.price).toFixed(2)}</p>
                <p><strong>Category:</strong> ${listing.category || "Unknown"}</p>
                <p><strong>Condition:</strong> ${listing.condition || "Unknown"}</p>
                <p><strong>Description:</strong> ${listing.description || "No description available"}</p>
                <p><strong>Seller Contact:</strong> ${listing.user_email || "Not provided"}, ${listing.phone_num || "Not provided"}</p>
                <a href="/code/listings.html" class="back-button">Back to Listings</a>
            </div>
        `;

    } catch (error) {
        console.error("⚠️ Error fetching listing details:", error);
        listingContainer.innerHTML = "<h2>Error loading listing details. Please try again.</h2>";
    }
});
