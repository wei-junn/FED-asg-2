document.addEventListener("DOMContentLoaded", async function () {
    const apiKey = "6785c0de630e8a0e140b141d"; // Replace with your RestDB API key
    const databaseUrl = "https://mokesellasg2-66c7.restdb.io/rest/listings"; // Replace with your RestDB URL
    const listingsContainer = document.getElementById("listings-container");
    const pageTitle = document.getElementById("page-title");

    // Get category from URL (if exists)
    const urlParams = new URLSearchParams(window.location.search);
    const selectedCategory = urlParams.get("category");

    // Decode the category name in case it's URL encoded (e.g., "Furniture%20&%20Home%20Living")
    const decodedCategory = selectedCategory ? decodeURIComponent(selectedCategory) : null;

    console.log("🔍 Selected Category:", decodedCategory); // Debugging line

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

        // Filter by category (if selected)
        const filteredListings = decodedCategory
            ? listings.filter(item => item.category.trim().toLowerCase() === decodedCategory.trim().toLowerCase())
            : listings;

        console.log("📄 Filtered Listings:", filteredListings); // Debugging line

        // Update page title
        pageTitle.textContent = decodedCategory ? `Listings for ${decodedCategory}` : "All Listings";

        // Display listings
        if (filteredListings.length === 0) {
            listingsContainer.innerHTML = "<p>No listings found for this category.</p>";
        } else {
            listingsContainer.innerHTML = filteredListings.map(createListingCard).join("");
        }
    } catch (error) {
        console.error("⚠️ Error fetching listings:", error);
        listingsContainer.innerHTML = "<p>Error loading listings. Please try again.</p>";
    }
});

// Function to generate listing card HTML
function createListingCard(listing) {
    return `
        <div class="listing-card">
            <img src="${listing.product_img ? listing.product_img[0] : 'placeholder.jpg'}" alt="${listing.product_name}">
            <div class="listing-details">
                <h3>${listing.product_name}</h3>
                <p><strong>Price:</strong> $${listing.price.toFixed(2)}</p>
                <p><strong>Category:</strong> ${listing.category}</p>
                <p><strong>Description:</strong> ${listing.description}</p>
                <p><strong>Contact:</strong> ${listing.user_email}, ${listing.phone_num}</p>
            </div>
        </div>
    `;
}