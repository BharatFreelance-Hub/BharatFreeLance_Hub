import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChL4PXmR5RHmNnlVc6PiocbEsq3ygpD3E",
  authDomain: "bharatfreelance-hub-538c2.firebaseapp.com",
  projectId: "bharatfreelance-hub-538c2",
  storageBucket: "bharatfreelance-hub-538c2.appspot.com",
  messagingSenderId: "297970426246",
  appId: "1:297970426246:web:fc266f818611f1c14a8c07"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Function to fetch job posts from Firestore
async function fetchJobPosts() {
  const jobListingSection = document.querySelector(".job-listings-section");

  try {
    // Reference to the 'jobs' collection in Firestore
    const querySnapshot = await getDocs(collection(db, "jobs"));

    // Loop through each document in the collection and display job posts
    querySnapshot.forEach((doc) => {
      const jobData = doc.data();
      addJobToPage(jobData);
    });
  } catch (error) {
    console.error("Error fetching job posts: ", error.message);
  }
}

// Function to dynamically add a job posting to the page
function addJobToPage(jobData) {
  const jobListingSection = document.querySelector(".job-listings-section");

  // Create a new job listing element
  const newJobListing = document.createElement("div");
  newJobListing.className = "job-listing";
  newJobListing.setAttribute("data-type", jobData.projectType);
  newJobListing.setAttribute("data-listing", jobData.listingType);
  newJobListing.setAttribute("data-skills", jobData.skills.toLowerCase());
  newJobListing.setAttribute("data-language", jobData.language.toLowerCase());

  // Add content to the job listing
  newJobListing.innerHTML = `
    <h3>${jobData.jobTitle}</h3>
    <p><strong>Project Type:</strong> ${jobData.projectType.replace("-", " ")}</p>
    <p><strong>Skills:</strong> ${jobData.skills}</p>
    <p><strong>Listing Type:</strong> ${jobData.listingType.replace("-", " ")}</p>
    <p><strong>Language:</strong> ${jobData.language}</p>
    <p>${jobData.description}</p>
    <a href="../freelance_client_both/both.html" class="btn btn-primary">Apply Now</a>
  `;

  // Append the new job listing to the section
  jobListingSection.appendChild(newJobListing);

  // Add Apply Now button functionality
  const applyButton = newJobListing.querySelector(".btn-primary");
  applyButton.addEventListener("click", () => {
    if (applyButton.dataset.applied === "true") {
      return;
    }

    // Create the alert element
    const alertDiv = document.createElement("div");
    alertDiv.className = "alert alert-success mt-3";
    alertDiv.role = "alert";
    alertDiv.innerText = "Successfully applied";

    // Append the alert to the job listing
    newJobListing.appendChild(alertDiv);

    // Mark as applied
    applyButton.dataset.applied = "true";
    applyButton.textContent = "Applied";
    applyButton.disabled = true;
  });
}

// Ensure user is authenticated before fetching job posts
onAuthStateChanged(auth, (user) => {
  if (user) {
    fetchJobPosts();
  } else {
    console.log("User is not authenticated");
    // Redirect to login page if not authenticated
    window.location.href = "./freelancer_sign.html";
  }
});