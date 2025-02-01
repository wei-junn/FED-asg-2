document.addEventListener("DOMContentLoaded", async function () {
    const apiKey = "6785c0de630e8a0e140b141d"; // Replace with your RestDB API key
    const databaseUrl = "https://mokesellasg2-66c7.restdb.io/rest/listings"; // Replace with your RestDB URL
    const listingsContainer = document.getElementById("listings-container");
    const pageTitle = document.getElementById("page-title");
    const conditionFilter = document.getElementById("condition-filter");

    // Get URL parameters (category & condition)
    const urlParams = new URLSearchParams(window.location.search);
    const selectedCategory = urlParams.get("category");
    const selectedCondition = urlParams.get("condition") || "all"; // Default to 'all'

    // Decode the category name if URL encoded
    const decodedCategory = selectedCategory ? decodeURIComponent(selectedCategory) : null;

    console.log("🔍 Selected Category:", decodedCategory);
    console.log("🔍 Selected Condition:", selectedCondition);

    try {
        // Fetch data from RestDB
        const response = await fetch(databaseUrl, {
            method: "GET",
            headers: {
                "x-apikey": apiKey,
                "Cache-Control": "no-cache"
            }
        });

        const listings = await response.json();

        // Filter listings by category if selected
        let filteredListings = decodedCategory
            ? listings.filter(item => item.category.trim().toLowerCase() === decodedCategory.trim().toLowerCase())
            : listings;

        // Filter by condition
        if (selectedCondition !== "all") {
            filteredListings = filteredListings.filter(item =>
                selectedCondition === "New" ? item.condition === "New" : item.condition !== "New"
            );
        }

        console.log("📄 Filtered Listings:", filteredListings);

        // Update page title
        pageTitle.textContent = decodedCategory ? `Listings for ${decodedCategory}` : "All Listings";

        // Display listings
        if (filteredListings.length === 0) {
            listingsContainer.innerHTML = "<p>No listings found for this category and condition.</p>";
        } else {
            listingsContainer.innerHTML = filteredListings.map(createListingCard).join("");
        }

        // Set filter dropdown to match the selected condition
        conditionFilter.value = selectedCondition;

    } catch (error) {
        console.error("⚠️ Error fetching listings:", error);
        listingsContainer.innerHTML = "<p>Error loading listings. Please try again.</p>";
    }
});

// Function to generate listing card HTML with Condition
function createListingCard(listing) {
    return `
        <div class="listing-card">
            <img src="${listing.product_img ? listing.product_img[0] : 'placeholder.jpg'}" alt="${listing.product_name}">
            <div class="listing-details">
                <h3>${listing.product_name}</h3>
                <p><strong>Price:</strong> $${listing.price.toFixed(2)}</p>
                <p><strong>Category:</strong> ${listing.category}</p>
                <p><strong>Condition:</strong> ${listing.condition}</p>
                <p><strong>Description:</strong> ${listing.description}</p>
                <p><strong>Contact:</strong> ${listing.user_email}, ${listing.phone_num}</p>
            </div>
        </div>
    `;
}

// Event Listener for Condition Filter
document.getElementById("condition-filter").addEventListener("change", function () {
    const selectedCondition = this.value;
    const urlParams = new URLSearchParams(window.location.search);
    if (selectedCondition === "all") {
        urlParams.delete("condition");
    } else {
        urlParams.set("condition", selectedCondition);
    }
    window.location.search = urlParams.toString(); // Update URL and reload page
});