Project Idea for MokeSell Web Application
Overview:
The web application will be a consumer-to-consumer marketplace for buying and selling goods, featuring user account management, listing management, search functionality, and communication features. It will integrate with RestDB for database operations, incorporate external APIs for enhanced functionality, use JavaScript for interactivity, and include Lottie animations to improve user experience.

Features
1. Listing Management:
Feature Set:

Create New Listing: Allow sellers to add new items with categories, photos, descriptions, and price. Users have to input name, email and phone number for buyers to contact them.
Manage Listings: Sellers can view, edit, and delete their active listings on the admin webpage.
Active Listings Limit: Limit free active listings to 30 per user.
Listing timeframe: Limit active listings to a maximum of 30 days.
Bump Listing: Sellers can promote their listings by purchasing a "bump" (using a credit card simulation API like Stripe API).
Filters: Allow buyers to filter listings by their price, condition(brand new or second hand), category

Implementation Details:

Store listings in a RestDB collection (listings) with fields: title, category, price, condition, images, sellerID, status.
Use Stripe API for payment processing when users purchase a bump.
Use JavaScript to dynamically update the listing UI without page reloads.
Display success or error feedback with Lottie animations when a listing is created or updated.

2. Search and Browsing:
Feature Set:

Keyword Search: Allow buyers to search for items using keywords.
Category Browsing: Users can browse items by category or sub-category.
Saved Listings: Buyers can save listings for future reference (like/favorite functionality).

Implementation Details:

Implement a search bar that queries the RestDB listings collection using filters.
Use JavaScript to render search results in real-time.
Allow users to click a “Save”/like button on a listing, which stores the listing ID in their profile.
Animate the save action using a Lottie heart animation.

3. Communication & Transactions:
Feature Set:

Chat System: Buyers can initiate a chat with sellers.
Offer Submission: Buyers can submit an offer, and sellers can accept or reject it.
Review System: After a completed transaction, buyers and sellers can rate and review each other.

Implementation Details:

Use a separate RestDB collection (chats) to store chat messages, with fields: buyerID, sellerID, message, timestamp.
Create a JavaScript-powered chat interface with real-time updates using polling or WebSockets.
For the review system, create a JavaScript form that posts review data to a RestDB collection (reviews).
Display transaction completion and review success with Lottie animations.


Technology Usage 
1. Database Integration:
Use RestDB as the primary backend database.
Collections:
listings (for items being sold)
chats (for storing chat messages)
reviews (for transaction reviews)
feedback (for user feedback submissions)

2. API Usage:
RestDB API for CRUD operations on all collections.
Lottie API or hosted Lottie animations for interactive feedback and visual enhancements.

3. JavaScript Interactions:
Use Vanilla JavaScript or React.js for building dynamic, responsive UI components.
Implement AJAX requests to interact with the RestDB API without page reloads.
Use localStorage/sessionStorage to manage user sessions and saved listings.
Enhance the UI with custom animations and transitions.

4. Lottie Animations:
Use Lottie animations at key interaction points:
Login/Registration Success: Show a happy character or confetti animation.
Listing Creation: Display a checkmark animation upon successful listing creation.
Bump Purchase: Show a celebratory animation when a bump is successfully purchased.
Feedback Submission: Use a thank-you animation after feedback is submitted.

5. Deployment:
Buyers will view listings on a listings webpage, while sellers will list out their listings on an admin webpage
Host the web application on GitHub Pages.
Use GitHub for version control, with meaningful commit messages and a well-documented README.md.

Bonus Features (Optional Enhancements):
Dark Mode toggle for better user experience.
Store media files (images) using Cloudinary.

Github Pages Link: https://wei-junn.github.io/FED-asg-2/index.html