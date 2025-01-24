function toggleDropdown() {
    const dropdownMenu = document.getElementById('dropdown-menu');
    dropdownMenu.style.display =
        dropdownMenu.style.display === 'block' ? 'none' : 'block';
}

// Form submission event listener
document.getElementById('listing-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent default form submission

    // Gather form data
    const productName = document.getElementById('product_name').value;
    const productImages = document.getElementById('product_img').files;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const phoneNum = document.getElementById('phone_num').value;
    const userEmail = document.getElementById('user_email').value;

    // Ensure at least one image is uploaded
    if (productImages.length === 0) {
        alert('Please upload at least one product image.');
        return;
    }

    // Upload images to Cloudinary (if using Cloudinary)
    const imageUrls = [];
    for (let i = 0; i < productImages.length; i++) {
        const formData = new FormData();
        formData.append('file', productImages[i]);
        formData.append('upload_preset', 'your_upload_preset'); // Replace with your Cloudinary preset

        try {
            const response = await fetch('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            imageUrls.push(data.secure_url);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload images. Please try again.');
            return;
        }
    }

    // Prepare listing data
    const listingData = {
        product_name: productName,
        product_img: imageUrls,
        price: price,
        description: description,
        category: category,
        phone_num: phoneNum,
        user_email: userEmail,
    };

    // Post data to RestDB
    try {
        const response = await fetch('https://mokesellasg2-66c7.restdb.io/rest/listings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': '6785c0de630e8a0e140b141d',
            },
            body: JSON.stringify(listingData),
        });

        if (response.ok) {
            document.getElementById('listing-form').reset();
            document.getElementById('success-animation').style.display = 'block';
            setTimeout(() => {
                document.getElementById('success-animation').style.display = 'none';
            }, 3000);
        } else {
            alert('Failed to post the listing. Please try again.');
        }
    } catch (error) {
        console.error('Error posting listing:', error);
        alert('An error occurred. Please try again later.');
    }
});
