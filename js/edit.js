document.addEventListener("DOMContentLoaded", async function () {
    const apiKey = "6785c0de630e8a0e140b141d"; // Your RestDB API Key
    const databaseUrl = "https://mokesellasg2-66c7.restdb.io/rest/listings"; // Your RestDB collection URL

    const listingForm = document.getElementById("listing-form");
    const productImgInput = document.getElementById("product_img"); // File input

    // Create a loading animation container **only once**
    const loadingContainer = document.createElement("div");
    loadingContainer.id = "loading-animation";
    loadingContainer.style.position = "fixed";
    loadingContainer.style.top = "0";
    loadingContainer.style.left = "0";
    loadingContainer.style.width = "100vw";
    loadingContainer.style.height = "100vh";
    loadingContainer.style.display = "flex";
    loadingContainer.style.justifyContent = "center";
    loadingContainer.style.alignItems = "center";
    loadingContainer.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    loadingContainer.style.zIndex = "999";

    // Load Lottie Animation
    const animation = document.createElement("lottie-player");
    animation.setAttribute("src", "../images/loader.json"); // Replace with correct path
    animation.setAttribute("background", "transparent");
    animation.setAttribute("speed", "1");
    animation.setAttribute("loop", "");
    animation.setAttribute("autoplay", "");
    animation.style.width = "300px";
    animation.style.height = "300px";

    loadingContainer.appendChild(animation);
    document.body.appendChild(loadingContainer);

    // Get listing ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const listingId = urlParams.get("id");

    if (!listingId) {
        alert("No listing ID found.");
        window.location.href = "../html/account.html"; // Redirect to My Listings if no ID found
        return;
    }

    let existingImages = []; // Store existing images

    try {
        // Fetch listing details
        const response = await fetch(`${databaseUrl}/${listingId}`, {
            method: "GET",
            headers: {
                "x-apikey": apiKey,
                "Cache-Control": "no-cache",
            },
        });

        if (!response.ok) throw new Error("Failed to fetch listing data.");

        const listing = await response.json();

        // Prefill the form with existing details
        document.getElementById("product_name").value = listing.product_name || "";
        document.getElementById("price").value = listing.price || "";
        document.getElementById("description").value = listing.description || "";
        document.getElementById("category").value = listing.category || "";
        document.getElementById("phone_num").value = listing.phone_num || "";
        document.getElementById("user_email").value = listing.user_email || "";

        // Store existing images
        existingImages = listing.product_img || [];

        // Handle existing images (Display image preview if available)
        const imagePreview = document.createElement("div");
        imagePreview.innerHTML = "<strong>Current Images:</strong><br>";
        if (existingImages.length > 0) {
            existingImages.forEach((imgUrl) => {
                const imgElement = document.createElement("img");
                imgElement.src = imgUrl;
                imgElement.style.width = "100px";
                imgElement.style.marginRight = "10px";
                imagePreview.appendChild(imgElement);
            });
        } else {
            imagePreview.innerHTML += "<p>No images uploaded.</p>";
        }
        productImgInput.insertAdjacentElement("beforebegin", imagePreview);

        // Remove required attribute if there are existing images
        if (existingImages.length > 0) {
            productImgInput.removeAttribute("required");
        }

    } catch (error) {
        console.error("⚠️ Error loading listing:", error);
        alert("Error loading listing details. Please try again.");
    } finally {
        // **Remove the loading animation when data is loaded**
        if (document.body.contains(loadingContainer)) {
            document.body.removeChild(loadingContainer);
        }
    }

    // Handle form submission (Update Listing)
    listingForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission

        // Collect updated data from form fields
        const updatedListing = {
            product_name: document.getElementById("product_name").value,
            price: parseFloat(document.getElementById("price").value),
            description: document.getElementById("description").value,
            category: document.getElementById("category").value,
            condition: document.getElementById("condition").value,
            phone_num: document.getElementById("phone_num").value,
            user_email: document.getElementById("user_email").value,
        };

        try {
            // Update listing in RestDB
            const updateResponse = await fetch(`${databaseUrl}/${listingId}`, {
                method: "PUT",
                headers: {
                    "x-apikey": apiKey,
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                },
                body: JSON.stringify(updatedListing),
            });

            const responseData = await updateResponse.json();
            console.log("🟢 RestDB Response:", responseData);

            if (!updateResponse.ok) {
                console.error("⚠️ RestDB Response Error:", responseData);
                alert(`❌ Failed to update listing: ${JSON.stringify(responseData)}`);
                return;
            }

            alert("✅ Listing updated successfully!");
            window.location.href = "../html/account.html";

        } catch (error) {
            console.error("⚠️ Error updating listing:", error);
            alert("❌ Error updating listing. Please check your inputs and try again.");
        }
    });
});