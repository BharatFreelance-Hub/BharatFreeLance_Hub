const stars = document.querySelectorAll('.star');

stars.forEach(star => {
    star.addEventListener('click', () => {
        // Get the rating value from the data attribute
        const rating = star.dataset.rating;

        // Update the styling of the stars
        updateStars(rating);
    });
});

function updateStars(rating) {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('filled');
        } else {
            star.classList.remove('filled');
        }
    });
}