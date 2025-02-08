document.addEventListener("DOMContentLoaded", async function () {
    const apiKey = "6785c0de630e8a0e140b141d";
    const databaseUrl = "https://mokesellasg2-66c7.restdb.io/rest/listings";
    
    // Get elements safely
    const userListingsContainer = document.getElementById("user-listings-container");
    const pageTitle = document.getElementById("page-title");
    const categoryFilter = document.getElementById("category-filter");
    const conditionFilter = document.getElementById("condition-filter");
    const filtersWrapper = document.querySelector(".filters-wrapper");

    // Redirect to login if user is not logged in
    const loggedInUserEmail = localStorage.getItem("user_email");
    if (!loggedInUserEmail) {
        window.location.href = "index.html";
        return;
    }

    // Ensure elements exist before modifying them
    if (pageTitle) pageTitle.style.display = "none";
    if (filtersWrapper) filtersWrapper.style.display = "none";
    if (userListingsContainer) userListingsContainer.style.display = "none";

    // Ensure category and condition filters exist before adding event listeners
    if (categoryFilter) {
        categoryFilter.addEventListener("change", function () {
            updateFilters("category", this.value);
        });
    }

    if (conditionFilter) {
        conditionFilter.addEventListener("change", function () {
            updateFilters("condition", this.value);
        });
    }

    // Create a loading animation container
    const loadingContainer = document.createElement("div");
    loadingContainer.id = "loading-animation";
    loadingContainer.innerHTML = `
        <lottie-player 
            id="loading-animation"
            src="/images/Animation - 1738385306623.json"
            background="transparent"
            speed="1"
            style="width: 200px; height: 200px;"
            loop
            autoplay>
        </lottie-player>
    `;

    loadingContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    document.body.appendChild(loadingContainer);

    try {
        // Fetch user listings from RestDB
        const response = await fetch(databaseUrl, {
            method: "GET",
            headers: { "x-apikey": apiKey }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch listings.");
        }

        const listings = await response.json();

        // Remove loading animation when data is loaded
        document.body.removeChild(loadingContainer);

        // Show content now that data is loaded
        if (pageTitle) pageTitle.style.display = "block";
        if (filtersWrapper) filtersWrapper.style.display = "flex";
        if (userListingsContainer) userListingsContainer.style.display = "grid";

        // Filter listings by logged-in user
        let userListings = listings.filter(item => item.user_email === loggedInUserEmail);

        // Get filters from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const selectedCategory = urlParams.get("category") || "All";
        const selectedCondition = urlParams.get("condition") || "all";

        // Apply category filter
        if (selectedCategory !== "All") {
            userListings = userListings.filter(item => item.category.trim().toLowerCase() === selectedCategory.trim().toLowerCase());
        }

        // Apply condition filter
        if (selectedCondition !== "all") {
            userListings = userListings.filter(item =>
                selectedCondition === "New" ? item.condition === "New" : item.condition !== "New"
            );
        }

        // Display listings
        userListingsContainer.innerHTML = userListings.length
            ? userListings.map(createUserListingCard).join("")
            : "<p>No listings found for this category and condition.</p>";

        // Update dropdowns to match selected filters
        if (categoryFilter) categoryFilter.value = selectedCategory;
        if (conditionFilter) conditionFilter.value = selectedCondition;

        // Update page title
        if (pageTitle) {
            pageTitle.textContent = `My Listings for ${selectedCategory} (${selectedCondition !== "all" ? selectedCondition : "All Conditions"})`;
        }

    } catch (error) {
        console.error("⚠️ Error fetching user listings:", error);
        if (userListingsContainer) {
            userListingsContainer.innerHTML = "<p>Error loading listings. Please try again.</p>";
        }
    }
});

// Function to generate user listing card
function createUserListingCard(listing) {
    return `
        <div class="listing-card">
            <img src="${listing.product_img ? listing.product_img[0] : 'placeholder.jpg'}" alt="${listing.product_name}">
            <h3>${listing.product_name}</h3>
            <p><strong>Price:</strong> $${parseFloat(listing.price).toFixed(2)}</p>
            <p><strong>Category:</strong> ${listing.category}</p>
            <p><strong>Condition:</strong> ${listing.condition}</p>
            <div class="buttons">
                <button onclick="editListing('${listing._id}')">✏️ Edit</button>
                <button onclick="deleteListing('${listing._id}')" class="delete-button">🗑️ Delete</button>
            </div>
        </div>
    `;
}

// Function to update filters
function updateFilters(filterType, value) {
    let queryParams = new URLSearchParams(window.location.search);

    if (value !== "All" && value !== "all") {
        queryParams.set(filterType, value);
    } else {
        queryParams.delete(filterType); // Removes from URL
    }

    window.location.search = queryParams.toString();
}

// Function to delete a listing
async function deleteListing(id) {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
        await fetch(`https://mokesellasg2-66c7.restdb.io/rest/listings/${id}`, {
            method: "DELETE",
            headers: { "x-apikey": "6785c0de630e8a0e140b141d" }
        });

        alert("✅ Listing deleted successfully!");
        location.reload();
    } catch (error) {
        alert("Error deleting listing.");
    }
}

// Function to edit a listing
function editListing(id) {
    window.location.href = `edit.html?id=${id}`;
}
