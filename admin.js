function toggleDropdown() {
    const dropdownMenu = document.getElementById('dropdown-menu');
    dropdownMenu.style.display =
        dropdownMenu.style.display === 'block' ? 'none' : 'block';
}

// Function to Convert File to Base64
async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

document.getElementById("listing-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get form values
    const productName = document.getElementById("product_name").value.trim();
    const price = parseFloat(document.getElementById("price").value).toFixed(2);
    const description = document.getElementById("description").value.trim();
    const category = document.getElementById("category").value.trim();
    const phoneNum = document.getElementById("phone_num").value.trim();
    const userEmail = document.getElementById("user_email").value.trim();
    const condition = document.getElementById("condition").value; // ✅ Get selected condition
    const productImages = document.getElementById("product_img").files;

    // Convert images to Base64 (max 10)
    const imagesBase64 = await Promise.all([...productImages].slice(0, 10).map(fileToBase64));

    // Create request body
    const requestBody = {
        product_name: productName,
        price: price,
        description: description,
        category: category,
        phone_num: phoneNum,
        user_email: userEmail,
        condition: condition, // ✅ Ensure "condition" is included
        product_img: imagesBase64 // Store images as an array of Base64 strings
    };

    console.log("📤 Sending JSON with Base64 images to RestDB:", requestBody);

    const apiKey = "6785c0de630e8a0e140b141d"; // Replace with your RestDB API key
    const databaseUrl = "https://mokesellasg2-66c7.restdb.io/rest/listings"; // Replace with your RestDB URL

    try {
        const response = await fetch(databaseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": apiKey,
                "Cache-Control": "no-cache"
            },
            body: JSON.stringify(requestBody)
        });

        const responseData = await response.json();
        console.log("📩 Response from RestDB:", responseData);

        if (response.ok) {
            alert("✅ Listing posted successfully!");
            document.getElementById("listing-form").reset();
        } else {
            throw new Error("❌ Failed to post listing: " + JSON.stringify(responseData));
        }
    } catch (error) {
        console.error("⚠️ Error:", error);
        alert("⚠️ Error: " + error.message);
    }
});