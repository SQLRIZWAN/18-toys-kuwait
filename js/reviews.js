/**
 * Review System
 * Adult Toys E-Commerce Kuwait
 */

(function() {
    'use strict';

    const REVIEWS_KEY = 'toys_kuwait_reviews';

    const defaultReviews = [
        {
            id: 1,
            productId: 1,
            name: 'Ahmed K.',
            rating: 5,
            comment: 'Excellent quality and fast delivery in Kuwait. Very discreet packaging. Highly recommended!',
            date: '2025-12-15',
            verified: true
        },
        {
            id: 2,
            productId: 1,
            name: 'Sarah M.',
            rating: 4,
            comment: 'Great product, exactly as described. Delivery took 2 days which is good for Kuwait.',
            date: '2025-12-10',
            verified: true
        },
        {
            id: 3,
            productId: 2,
            name: 'Mohammed A.',
            rating: 5,
            comment: 'Best online shop in Kuwait for these products. Very professional and discreet.',
            date: '2025-12-08',
            verified: true
        },
        {
            id: 4,
            productId: 3,
            name: 'Fatima R.',
            rating: 5,
            comment: 'Love it! Great quality materials. Will order again. The WAMD payment was convenient.',
            date: '2025-12-05',
            verified: true
        },
        {
            id: 5,
            productId: 4,
            name: 'Ali H.',
            rating: 4,
            comment: 'Good product for the price. Discreet delivery to my address in Hawalli.',
            date: '2025-12-01',
            verified: false
        },
        {
            id: 6,
            productId: 5,
            name: 'Lena S.',
            rating: 5,
            comment: 'Amazing! This is exactly what I was looking for. Fast Kuwait delivery and great customer service.',
            date: '2025-11-28',
            verified: true
        },
        {
            id: 7,
            productId: 6,
            name: 'Omar B.',
            rating: 4,
            comment: 'Quality is good. Would recommend for anyone in Kuwait looking for discreet shopping.',
            date: '2025-11-25',
            verified: true
        },
        {
            id: 8,
            productId: 7,
            name: 'Yasmin K.',
            rating: 5,
            comment: 'Perfect! Loved the discreet packaging and fast delivery in Salmiya.',
            date: '2025-11-20',
            verified: true
        },
        {
            id: 9,
            productId: 8,
            name: 'Khalid M.',
            rating: 4,
            comment: 'Very satisfied with my purchase. The WAMD payment option is very convenient for Kuwait.',
            date: '2025-11-18',
            verified: true
        },
        {
            id: 10,
            productId: 9,
            name: 'Noura A.',
            rating: 5,
            comment: 'Excellent! Will definitely order again. Best adult shop in Kuwait online.',
            date: '2025-11-15',
            verified: true
        }
    ];

    const Reviews = {
        init() {
            this.initializeDefaultReviews();
            this.initReviewForms();
        },

        initializeDefaultReviews() {
            const reviews = this.getAllReviews();
            if (reviews.length === 0) {
                this.saveReviews(defaultReviews);
            }
        },

        getAllReviews() {
            try {
                const reviews = localStorage.getItem(REVIEWS_KEY);
                return reviews ? JSON.parse(reviews) : [];
            } catch (e) {
                console.error('Error reading reviews:', e);
                return [];
            }
        },

        saveReviews(reviews) {
            try {
                localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
            } catch (e) {
                console.error('Error saving reviews:', e);
            }
        },

        getProductReviews(productId) {
            const reviews = this.getAllReviews();
            return reviews.filter(r => r.productId === parseInt(productId));
        },

        displayReviews(productId) {
            const container = document.querySelector(`.reviews-container, [data-reviews="${productId}"]`);
            if (!container) return;

            const reviews = this.getProductReviews(productId);
            const avgRating = this.getAverageRating(productId);

            let html = `
                <div class="reviews-header">
                    <h3>Customer Reviews</h3>
                    <div class="reviews-summary">
                        <div class="average-rating">
                            ${this.renderStars(Math.round(avgRating))}
                            <span>${avgRating.toFixed(1)} out of 5</span>
                        </div>
                        <span class="review-count">${reviews.length} review${reviews.length !== 1 ? 's' : ''}</span>
                    </div>
                </div>
            `;

            if (reviews.length === 0) {
                html += '<p class="no-reviews">No reviews yet. Be the first to review!</p>';
            } else {
                html += '<div class="reviews-list">';
                reviews.forEach(review => {
                    html += `
                        <div class="review-item">
                            <div class="review-header">
                                <div class="reviewer-info">
                                    <span class="reviewer-name">${this.escapeHtml(review.name)}</span>
                                    ${review.verified ? '<span class="verified-badge">✓ Verified Purchase</span>' : ''}
                                </div>
                                <div class="review-rating">
                                    ${this.renderStars(review.rating)}
                                </div>
                            </div>
                            <p class="review-comment">${this.escapeHtml(review.comment)}</p>
                            <span class="review-date">${this.formatDate(review.date)}</span>
                        </div>
                    `;
                });
                html += '</div>';
            }

            html += `
                <div class="review-form-container">
                    <h4>Write a Review</h4>
                    <form class="review-form" data-product-id="${productId}">
                        <div class="form-group">
                            <label for="review-name">Your Name</label>
                            <input type="text" id="review-name" required placeholder="Enter your name">
                        </div>
                        <div class="form-group">
                            <label for="review-rating">Rating</label>
                            <div class="star-rating-input">
                                ${[1,2,3,4,5].map(i => `
                                    <span class="star-input" data-rating="${i}">★</span>
                                `).join('')}
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="review-comment">Your Review</label>
                            <textarea id="review-comment" rows="4" required placeholder="Share your experience..."></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Submit Review</button>
                    </form>
                </div>
            `;

            container.innerHTML = html;
            this.initStarInput(container);
            this.initReviewForm(container, productId);
        },

        getAverageRating(productId) {
            const reviews = this.getProductReviews(productId);
            if (reviews.length === 0) return 0;
            const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
            return sum / reviews.length;
        },

        renderStars(rating) {
            let stars = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= rating) {
                    stars += '<span class="star filled">★</span>';
                } else if (i - 0.5 <= rating) {
                    stars += '<span class="star half">★</span>';
                } else {
                    stars += '<span class="star empty">☆</span>';
                }
            }
            return `<div class="stars">${stars}</div>`;
        },

        initStarInput(container) {
            const stars = container.querySelectorAll('.star-input');
            let selectedRating = 0;

            stars.forEach(star => {
                star.addEventListener('click', () => {
                    selectedRating = parseInt(star.dataset.rating);
                    stars.forEach(s => {
                        const rating = parseInt(s.dataset.rating);
                        s.classList.toggle('active', rating <= selectedRating);
                    });
                    container.dataset.selectedRating = selectedRating;
                });

                star.addEventListener('mouseenter', () => {
                    const rating = parseInt(star.dataset.rating);
                    stars.forEach(s => {
                        const r = parseInt(s.dataset.rating);
                        s.classList.toggle('hover', r <= rating);
                    });
                });

                star.addEventListener('mouseleave', () => {
                    stars.forEach(s => s.classList.remove('hover'));
                });
            });
        },

        initReviewForm(container, productId) {
            const form = container.querySelector('.review-form');
            if (!form) return;

            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const name = form.querySelector('#review-name').value.trim();
                const comment = form.querySelector('#review-comment').value.trim();
                const rating = parseInt(container.dataset.selectedRating || 0);

                if (!name || !comment) {
                    App.showToast('Please fill in all fields', 'error');
                    return;
                }

                if (rating === 0) {
                    App.showToast('Please select a rating', 'error');
                    return;
                }

                this.addReview(productId, name, rating, comment);
                App.showToast('Review submitted successfully!', 'success');
                this.displayReviews(productId);
            });
        },

        initReviewForms() {
            document.querySelectorAll('.review-form-standalone').forEach(form => {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const productId = form.dataset.productId;
                    const name = form.querySelector('#review-name')?.value.trim();
                    const comment = form.querySelector('#review-comment')?.value.trim();
                    const ratingInput = form.querySelector('input[name="rating"]:checked');

                    if (!name || !comment || !ratingInput) {
                        App.showToast('Please fill in all fields', 'error');
                        return;
                    }

                    this.addReview(productId, name, parseInt(ratingInput.value), comment);
                    App.showToast('Review submitted!', 'success');
                    form.reset();
                });
            });
        },

        addReview(productId, name, rating, comment) {
            const reviews = this.getAllReviews();
            const newReview = {
                id: Date.now(),
                productId: parseInt(productId),
                name: name,
                rating: Math.min(5, Math.max(1, rating)),
                comment: comment,
                date: new Date().toISOString().split('T')[0],
                verified: false
            };

            reviews.unshift(newReview);
            this.saveReviews(reviews);
        },

        formatDate(dateString) {
            try {
                const date = new Date(dateString);
                return date.toLocaleDateString('en-KW', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            } catch (e) {
                return dateString;
            }
        },

        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },

        getReviewCount() {
            return this.getAllReviews().length;
        },

        getTopReviews(limit = 5) {
            const reviews = this.getAllReviews();
            return reviews
                .sort((a, b) => b.rating - a.rating)
                .slice(0, limit);
        }
    };

    document.addEventListener('DOMContentLoaded', () => {
        Reviews.init();
    });

    window.Reviews = Reviews;
})();
