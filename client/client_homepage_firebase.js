// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

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

// Reference to the job form element
const jobForm = document.getElementById('jobForm');

// Handle form submission for job posting
jobForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Collect form data
  const jobTitle = document.getElementById('jobTitle').value;
  const projectType = document.getElementById('projectType').value;
  const skills = document.getElementById('skills').value;
  const listingType = document.getElementById('listingType').value;
  const Language = document.getElementById('Language').value;
  const description = document.getElementById('description').value;

  // Ensure the user is authenticated
  const user = auth.currentUser;
  if (!user) {
    alert('You must be signed in to post a job.');
    return;
  }

  // Data to save in Firestore
  const jobData = {
    jobTitle,
    projectType,
    skills,
    listingType,
    Language,
    description,
    postedBy: user.uid, // Store the user ID of the client who posted the job
    createdAt: new Date() // Add a timestamp for when the job was posted
  };
  console.log(jobData);
  try {
    // Save the job posting data to the 'jobs' collection with a unique ID
    const docId = `${user.uid}_${Date.now()}`;
    await setDoc(doc(db, "jobs", docId), jobData);
    alert('Job posted successfully');
    // Optionally, redirect or close modal after successful save
    $('#addJobModal').modal('hide');
    jobForm.reset();
  } catch (error) {
    console.error("Error posting job: ", error.message);
    alert("Failed to post job. Please try again.");
  }
});
