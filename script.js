// Carousel configuration
const originalSlides = [
  {
    image: "assets/images/mtn falls pond.png",
    text: "Beautiful outdoor spaces for your perfect event",
    location: "Green Grove Estate",
    alt: "Gazebo venue",
  },
  {
    image: "assets/images/house 1.png",
    text: "Elegant gardens and scenic landscapes",
    location: "Botanical Paradise",
    alt: "Garden venue",
  },
  {
    image: "assets/images/house 2.png",
    text: "Premium locations for memorable moments",
    location: "Lakeside Retreat",
    alt: "Park venue",
  },
];

let currentIndex = 0;
let totalSlides = originalSlides.length;
let isTransitioning = false;

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  initCarousel();
  initPhotoGallery();

  // Only initialize venues if the element exists
  if (document.getElementById("spacesGrid")) {
    renderVenues();
    setupFilters();
  }

  startSlideshow();
});

// Initialize infinite carousel with cloned slides
function initCarousel() {
  const track = document.getElementById("carouselTrack");

  // Create slide structure with clones: [clone-last, original-1, original-2, original-3, clone-first]
  let slidesHTML = "";

  // Clone last slide at beginning
  const lastSlide = originalSlides[originalSlides.length - 1];
  slidesHTML += createSlideHTML(lastSlide, "clone-last");

  // Original slides
  originalSlides.forEach((slide, index) => {
    slidesHTML += createSlideHTML(slide, `original-${index}`);
  });

  // Clone first slide at end
  const firstSlide = originalSlides[0];
  slidesHTML += createSlideHTML(firstSlide, "clone-first");

  track.innerHTML = slidesHTML;

  // Set initial position (start at first real slide, index 1 in the DOM)
  currentIndex = 1;
  updateCarousel(false);
}

function createSlideHTML(slide, dataId) {
  return `
        <div class="slide" data-slide-id="${dataId}">
            <div class="slide-image-wrapper">
                <img src="${slide.image}" alt="${slide.alt}">
                <div class="hero-overlay">
                    <p class="hero-subtitle">Your trusted local expert - THE RIDGE REALTY GROUP </p>
                    <h1 class="hero-title">Pahrump Realtor</h1>
                    <div class="cta-buttons">
                        <button class="btn-cta-primary" onclick="viewListings()">View listings</button>
                        <button class="btn-cta-secondary" onclick="contactMarci()">Contact Marci</button>
                    </div>
                    <p class="hero-tagline">Helping you buy, sell, and love where you live</p>
                </div>
            </div>
        </div>
    `;
}

// Update carousel position with center-mode calculation
function updateCarousel(animate = true) {
  const track = document.querySelector(".carousel-track");
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot-left");

  if (!slides.length) return;

  // Disable transition for instant repositioning
  if (!animate) {
    track.classList.add("no-transition");
  } else {
    track.classList.remove("no-transition");
  }

  // Calculate center-mode offset
  const slideWidth = slides[0].offsetWidth;
  const gap = 16;

  // Center the active slide: move track left by (index * (slideWidth + gap)) + half slide width
  const offset = -(currentIndex * (slideWidth + gap)) - slideWidth / 2;

  track.style.transform = `translateX(${offset}px)`;

  // Update center class
  slides.forEach((slide, index) => {
    slide.classList.toggle("center", index === currentIndex);
  });

  // Update dots (map to original slides only)
  const realIndex = getRealIndex();
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === realIndex);
  });

  // Update text content
  updateSlideContent();

  // Force reflow for no-transition to work
  if (!animate) {
    track.offsetHeight;
    track.classList.remove("no-transition");
  }
}

function getRealIndex() {
  // Map current index to original slide index (0-2)
  if (currentIndex === 0) return totalSlides - 1; // clone-last = last original
  if (currentIndex === totalSlides + 1) return 0; // clone-first = first original
  return currentIndex - 1; // original slides
}

function updateSlideContent() {
  const textElement = document.getElementById("slideText");
  const subtextElement = document.getElementById("slideSubtext");

  // Only update if elements exist (they don't in current hero design)
  if (textElement && subtextElement) {
    const realIndex = getRealIndex();
    const data = originalSlides[realIndex];
    textElement.textContent = data.text;
    subtextElement.innerHTML = `📍 ${data.location}`;
  }
}

function changeSlide(direction) {
  if (isTransitioning) return;

  isTransitioning = true;
  const slides = document.querySelectorAll(".slide");

  currentIndex += direction;
  updateCarousel(true);

  // Handle infinite loop repositioning
  setTimeout(() => {
    if (currentIndex === 0) {
      // Jumped to clone-last, reposition to real last slide
      currentIndex = totalSlides;
      updateCarousel(false);
    } else if (currentIndex === slides.length - 1) {
      // Jumped to clone-first, reposition to real first slide
      currentIndex = 1;
      updateCarousel(false);
    }
    isTransitioning = false;
  }, 600); // Match transition duration
}

function goToSlide(n) {
  if (isTransitioning) return;

  isTransitioning = true;
  currentIndex = n + 1; // +1 because of clone-last at index 0
  updateCarousel(true);

  setTimeout(() => {
    isTransitioning = false;
  }, 600);
}

function startSlideshow() {
  setInterval(() => {
    if (!isTransitioning) {
      changeSlide(1);
    }
  }, 5000);
}

// Sample venue listings data
const venues = [
  {
    id: 1,
    title: "Lakeside Gazebo Venue",
    description:
      "A picturesque gazebo overlooking serene lake waters, perfect for intimate ceremonies and outdoor celebrations.",
    price: 1200,
    capacity: 150,
    location: "Riverside Park",
    image: "assets/images/venue1.jpg",
    guests: 150,
    size: "2,500 sq ft",
  },
  {
    id: 2,
    title: "Garden Pavilion Estate",
    description:
      "Elegant outdoor pavilion surrounded by manicured gardens and scenic mountain views.",
    price: 2500,
    capacity: 200,
    location: "Highland Gardens",
    image: "assets/images/venue2.jpg",
    guests: 200,
    size: "3,200 sq ft",
  },
  {
    id: 3,
    title: "Forest Retreat Pavilion",
    description:
      "Rustic wooden pavilion nestled among towering trees, offering natural beauty and tranquility.",
    price: 1800,
    capacity: 120,
    location: "Woodland Reserve",
    image: "assets/images/venue3.jpg",
    guests: 120,
    size: "2,000 sq ft",
  },
  {
    id: 4,
    title: "Waterfront Celebration Space",
    description:
      "Modern open-air venue with stunning lake panoramas and premium amenities.",
    price: 3200,
    capacity: 250,
    location: "Crystal Lake",
    image: "assets/images/venue4.jpg",
    guests: 250,
    size: "4,000 sq ft",
  },
  {
    id: 5,
    title: "Botanical Garden Terrace",
    description:
      "Sophisticated terrace venue surrounded by exotic plants and vibrant flower displays.",
    price: 2800,
    capacity: 180,
    location: "City Botanical Gardens",
    image: "assets/images/venue5.jpg",
    guests: 180,
    size: "3,500 sq ft",
  },
  {
    id: 6,
    title: "Historic Park Pavilion",
    description:
      "Classic pavilion in a heritage park setting, blending timeless elegance with natural surroundings.",
    price: 1500,
    capacity: 160,
    location: "Heritage Park",
    image: "assets/images/venue6.jpg",
    guests: 160,
    size: "2,800 sq ft",
  },
];

// Render venue cards
function renderVenues(filter = "all", sortBy = null) {
  const grid = document.getElementById("spacesGrid");
  let displayVenues = [...venues];

  // Sort venues
  if (sortBy === "price") {
    displayVenues.sort((a, b) => a.price - b.price);
  } else if (sortBy === "capacity") {
    displayVenues.sort((a, b) => b.capacity - a.capacity);
  }

  grid.innerHTML = displayVenues
    .map(
      (venue) => `
        <div class="space-card">
            <div class="space-image">
                <img src="${venue.image}" alt="${venue.title}" loading="lazy">
            </div>
            <div class="space-content">
                <h3 class="space-title">${venue.title}</h3>
                <p class="space-description">${venue.description}</p>
                <div class="space-meta">
                    <span>👥 ${venue.guests} guests</span>
                    <span>📏 ${venue.size}</span>
                </div>
                <button class="btn-book" onclick="bookVenue(${venue.id})">Reserve - $${venue.price.toLocaleString()}</button>
            </div>
        </div>
    `,
    )
    .join("");
}

// Filter functionality
function setupFilters() {
  const filterBtns = document.querySelectorAll(".tab-btn");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      filterBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      const filter = this.getAttribute("data-filter");

      if (filter === "price") {
        renderVenues("all", "price");
      } else if (filter === "capacity") {
        renderVenues("all", "capacity");
      } else {
        renderVenues("all");
      }
    });
  });
}

// Book venue function
function bookVenue(id) {
  const venue = venues.find((v) => v.id === id);
  alert(
    `Booking request for ${venue.title}\nPrice: $${venue.price}\n\nThank you for your interest! Our team will contact you shortly.`,
  );
}

// Toggle menu function
function toggleMenu() {
  alert("Menu toggle - Connect to your navigation system");
}

// Load more venues
document.addEventListener("DOMContentLoaded", function () {
  const loadMoreBtn = document.querySelector(".btn-load-more");
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", function () {
      alert("Loading more venues... Feature coming soon!");
    });
  }
});

// Call now function
function callNow() {
  window.location.href = "tel:+1234567890"; // Replace with actual phone number
}

// View listings function
function viewListings() {
  document
    .querySelector(".featured-listings")
    .scrollIntoView({ behavior: "smooth" });
}

// Contact Marci function
function contactMarci() {
  window.location.href = "tel:206-919-6886";
}

// Explore venues function (legacy)
function exploreVenues() {
  viewListings();
}

// Toggle filters panel
function toggleFilters() {
  const panel = document.getElementById("filtersPanel");
  const button = document.querySelector(".more-filters-btn");

  panel.classList.toggle("active");
  button.classList.toggle("active");
}

// Photo Gallery
const galleryImages = [
  {
    src: "assets/images/house 1.png",
    caption: "Clubhouse and swimming pool",
  },
  {
    src: "assets/images/house 2.png",
    caption: "Luxury mountain estate",
  },
  {
    src: "assets/images/house 3.png",
    caption: "Beautiful home exterior",
  },
  {
    src: "assets/images/4.png",
    caption: "Sunroom with desert landscape views",
  },
  {
    src: "assets/images/5.png",
    caption: "Spacious master bedroom suite",
  },
  {
    src: "assets/images/6.png",
    caption: "Modern kitchen and dining area",
  },
  {
    src: "assets/images/7.png",
    caption: "Elegant living room with fireplace",
  },
  {
    src: "assets/images/8.png",
    caption: "Chef's kitchen with island",
  },
  {
    src: "assets/images/9.png",
    caption: "Luxurious House",
  },
  {
    src: "assets/images/10.png",
    caption: "Private backyard patio and pool",
  },
];

let currentGalleryIndex = 0;

// Initialize photo gallery
function initPhotoGallery() {
  const thumbnailsContainer = document.getElementById("galleryThumbnails");

  if (!thumbnailsContainer) return;

  // Create thumbnails
  thumbnailsContainer.innerHTML = galleryImages
    .map(
      (img, index) => `
    <div class="gallery-thumb ${index === 0 ? "active" : ""}" onclick="selectGalleryImage(${index})">
      <img src="${img.src}" alt="${img.caption}" />
    </div>
  `,
    )
    .join("");

  // Update gallery display
  updateGalleryDisplay();
}

// Update gallery display
function updateGalleryDisplay() {
  const mainImage = document.getElementById("galleryMainImage");
  const caption = document.getElementById("galleryCaption");
  const peekLeft = document.getElementById("peekLeft");
  const peekRight = document.getElementById("peekRight");
  const thumbs = document.querySelectorAll(".gallery-thumb");

  if (!mainImage) return;

  // Update main image and caption
  mainImage.src = galleryImages[currentGalleryIndex].src;
  caption.textContent = galleryImages[currentGalleryIndex].caption;

  // Update peek images
  const prevIndex =
    (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
  const nextIndex = (currentGalleryIndex + 1) % galleryImages.length;

  peekLeft.src = galleryImages[prevIndex].src;
  peekRight.src = galleryImages[nextIndex].src;

  // Update thumbnail active state
  thumbs.forEach((thumb, index) => {
    thumb.classList.toggle("active", index === currentGalleryIndex);
  });
}

// Change gallery image by direction
function changeGalleryImage(direction) {
  currentGalleryIndex =
    (currentGalleryIndex + direction + galleryImages.length) %
    galleryImages.length;
  updateGalleryDisplay();
}

// Select specific gallery image
function selectGalleryImage(index) {
  currentGalleryIndex = index;
  updateGalleryDisplay();
}

// Initialize gallery on page load
document.addEventListener("DOMContentLoaded", function () {
  initPhotoGallery();
});
