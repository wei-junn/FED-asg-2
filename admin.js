function toggleDropdown() {
    const dropdownMenu = document.getElementById('dropdown-menu');
    dropdownMenu.style.display =
        dropdownMenu.style.display === 'block' ? 'none' : 'block';
}

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
    const productName = document.getElementById("product_name").value;
    const price = parseFloat(document.getElementById("price").value);
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
    const phoneNum = parseInt(document.getElementById("phone_num").value, 10);
    const userEmail = document.getElementById("user_email").value;
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