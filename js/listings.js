document.addEventListener("DOMContentLoaded", async function () {
    const apiKey = "6785c0de630e8a0e140b141d"; // Replace with your RestDB API key
    const databaseUrl = "https://mokesellasg2-66c7.restdb.io/rest/listings";
    const listingsContainer = document.getElementById("listings-container");
    const pageTitle = document.getElementById("page-title");
    const categoryFilter = document.getElementById("category-filter");
    const conditionFilter = document.getElementById("condition-filter");
    const filtersWrapper = document.querySelector(".filters-wrapper");

    // Get category and condition from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const selectedCategory = urlParams.get("category") || "All"; // Default to "All"
    const selectedCondition = urlParams.get("condition") || "all"; // Default to "all"

    // Hide content before loading
    pageTitle.style.display = "none";
    filtersWrapper.style.display = "none";
    listingsContainer.style.display = "none";

    // Create a loading animation container
    const loadingContainer = document.createElement("div");
    loadingContainer.id = "loading-animation";
    loadingContainer.style.display = "flex";
    loadingContainer.style.justifyContent = "center";
    loadingContainer.style.alignItems = "center";
    loadingContainer.style.height = "100vh";
    loadingContainer.style.width = "100%";
    loadingContainer.style.position = "absolute";
    loadingContainer.style.top = "0";
    loadingContainer.style.left = "0";
    loadingContainer.style.background = "#fff";

    // Create an inner div to contain the animation & reduce size
    const animationWrapper = document.createElement("div");
    animationWrapper.style.width = "200px";
    animationWrapper.style.height = "200px";

    // Append animation wrapper to the loading container
    loadingContainer.appendChild(animationWrapper);
    document.body.appendChild(loadingContainer);

    // Load Lottie Animation
    const animation = lottie.loadAnimation({
        container: animationWrapper,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "FED-asg-2/images/Animation%20-%201738385306623.json" // Ensure correct path
    });

    try {
        // Fetch data from RestDB
        const response = await fetch(databaseUrl, {
            method: "GET",
            headers: {
                "x-apikey": apiKey,
                "Cache-Control": "no-cache"
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch listings. Please try again.");
        }

        const listings = await response.json();

        // Sort listings by most recent first (Higher ID first)
        listings.sort((a, b) => b._id.localeCompare(a._id));

        // Remove the loading animation when data is loaded
        document.body.removeChild(loadingContainer);

        // Show the content now that data is loaded
        pageTitle.style.display = "block";
        filtersWrapper.style.display = "flex";
        listingsContainer.style.display = "grid";

        // Filter listings by category
        let filteredListings = selectedCategory !== "All"
            ? listings.filter(item => item.category && item.category.trim().toLowerCase() === selectedCategory.trim().toLowerCase())
            : listings;

        // Filter listings by condition
        if (selectedCondition !== "all") {
            filteredListings = filteredListings.filter(item =>
                selectedCondition === "New" ? item.condition === "New" : item.condition !== "New"
            );
        }

        // Display listings or show a message if none found
        listingsContainer.innerHTML = filteredListings.length
            ? filteredListings.map(createListingCard).join("")
            : "<p>No listings found for this category and condition.</p>";

        // Set category filter dropdown to match the selected category
        if (categoryFilter) {
            categoryFilter.value = selectedCategory;
        }

        // Set condition filter dropdown to match the selected condition
        if (conditionFilter) {
            conditionFilter.value = selectedCondition;
        }

        // Update page title
        if (pageTitle) {
            pageTitle.textContent = `Listings for ${selectedCategory} (${selectedCondition !== "all" ? selectedCondition : "All Conditions"})`;
        }

    } catch (error) {
        console.error("⚠️ Error fetching listings:", error);
        listingsContainer.innerHTML = "<p>Error loading listings. Please try again.</p>";
    }
});

// Function to generate listing card HTML
function createListingCard(listing) {
    let price = parseFloat(listing.price); // Convert price to a number
    if (isNaN(price)) {
        price = "N/A";
    } else {
        price = `$${price.toFixed(2)}`;
    }

    return `
        <div class="listing-card">
            <a href="listing-details.html?id=${listing._id}">
                <img src="${listing.product_img ? listing.product_img[0] : 'placeholder.jpg'}" alt="${listing.product_name}">
                <div class="listing-details">
                    <h3>${listing.product_name}</h3>
                    <p class="price-text"><strong>Price:</strong> ${price}</p>
                    <p><strong>Category:</strong> ${listing.category || "Unknown"}</p>
                    <p><strong>Condition:</strong> ${listing.condition || "Unknown"}</p>
                </div>
            </a>
        </div>
    `;
}

// Redirect function for clicking on a listing
function viewListing(id) {
    window.location.href = `../listing-details.html?id=${id}`;
}

// Event Listener for Category Change
document.getElementById("category-filter").addEventListener("change", function () {
    const selectedCategory = this.value;
    let queryParams = new URLSearchParams(window.location.search);

    if (selectedCategory !== "All") {
        queryParams.set("category", selectedCategory);
    } else {
        queryParams.delete("category");
    }

    window.location.search = queryParams.toString();
});

// Event Listener for Condition Change
document.getElementById("condition-filter").addEventListener("change", function () {
    const selectedCondition = this.value;
    let queryParams = new URLSearchParams(window.location.search);

    if (selectedCondition !== "all") {
        queryParams.set("condition", selectedCondition);
    } else {
        queryParams.delete("condition");
    }

    window.location.search = queryParams.toString();
});