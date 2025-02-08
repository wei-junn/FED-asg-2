document.addEventListener("DOMContentLoaded", async function () {
    const apiKey = "6785c0de630e8a0e140b141d";
    const databaseUrl = "https://mokesellasg2-66c7.restdb.io/rest/listings";
    const urlParams = new URLSearchParams(window.location.search);
    const listingId = urlParams.get("id");

    // Create a loading animation element
    const loadingOverlay = document.createElement("div");
    loadingOverlay.id = "loading-overlay";
    loadingOverlay.innerHTML = `
        <div class="loader">
            <div class="spinner"></div>
            <p>Loading listing details...</p>
        </div>
    `;
    document.body.appendChild(loadingOverlay);

    // Apply styles for the loading overlay
    const style = document.createElement("style");
    style.innerHTML = `
        #loading-overlay {
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
        }
        
        .loader {
            text-align: center;
            font-size: 1.2em;
        }

        .spinner {
            border: 6px solid #f3f3f3;
            border-top: 6px solid #3498db;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin: auto;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    if (!listingId) {
        document.querySelector(".listing-container").innerHTML = "<h2>❌ Listing not found!</h2>";
        loadingOverlay.remove(); // Remove animation if no listing found
        return;
    }

    try {
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

        // Populate HTML elements with listing details
        document.getElementById("listing-image").src = listing.product_img ? listing.product_img[0] : "placeholder.jpg";
        document.getElementById("listing-name").textContent = listing.product_name || "Unknown Item";
        document.getElementById("listing-price").textContent = `$${parseFloat(listing.price).toFixed(2)}`;
        document.getElementById("listing-description").textContent = listing.description || "No description available";

        // Update contact buttons
        document.getElementById("seller-phone").textContent = listing.phone_num || "N/A";
        document.getElementById("seller-phone").href = `tel:${listing.phone_num}`;
        document.getElementById("seller-email").textContent = listing.user_email || "N/A";
        document.getElementById("seller-email").href = `mailto:${listing.user_email}`;

    } catch (error) {
        console.error("⚠️ Error fetching listing details:", error);
        document.querySelector(".listing-container").innerHTML = "<h2>Error loading listing details. Please try again.</h2>";
    } finally {
        // Remove the loading animation once data is fetched
        loadingOverlay.remove();
    }
});