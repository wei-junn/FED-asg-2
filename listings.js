const apiKey = 'YOUR_RESTDB_API_KEY'; // Replace with your RestDB API key
const apiUrl = 'https://YOUR_RESTDB_NAME.restdb.io/rest/listings'; // Replace with your RestDB URL
const listingsContainer = document.getElementById('listings-container');
const pageTitle = document.getElementById('page-title');

// Fetch Listings from RestDB
async function fetchListings(category = null) {
    try {
        let url = apiUrl;
        if (category) {
            url += `?q=${encodeURIComponent(JSON.stringify({ category }))}`;
        }

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': apiKey,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch listings');
        }

        const listings = await response.json();
        displayListings(listings);
    } catch (error) {
        console.error(error);
        listingsContainer.innerHTML = '<p>Error loading listings. Please try again later.</p>';
    }
}

// Display Listings in the DOM
function displayListings(listings) {
    listingsContainer.innerHTML = ''; // Clear existing listings

    if (listings.length === 0) {
        listingsContainer.innerHTML = '<p>No listings available.</p>';
        return;
    }

    listings.forEach((listing) => {
        const listingCard = document.createElement('div');
        listingCard.classList.add('listing-card');

        listingCard.innerHTML = `
            <img src="${listing.images[0] || 'placeholder.jpg'}" alt="${listing.title}">
            <h3>${listing.title}</h3>
            <p>Price: $${listing.price}</p>
            <p>Category: ${listing.category}</p>
        `;

        listingsContainer.appendChild(listingCard);
    });
}

// Detect Category from URL and Load Listings
const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('category');
if (category) {
    pageTitle.textContent = category;
}
fetchListings(category);
