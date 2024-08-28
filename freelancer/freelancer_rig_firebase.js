// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChL4PXmR5RHmNnlVc6PiocbEsq3ygpD3E",
  authDomain: "bharatfreelance-hub-538c2.firebaseapp.com",
  projectId: "bharatfreelance-hub-538c2",
  storageBucket: "bharatfreelance-hub-538c2",
  messagingSenderId: "297970426246",
  appId: "1:297970426246:web:fc266f818611f1c14a8c07"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Reference to the form element
const freelancerBioDataForm = document.getElementById('freelancer_bioDataForm');

// Handle form submission
freelancerBioDataForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Collect form data
  const firstName = document.getElementById('firstname').value;
  const lastName = document.getElementById('lastname').value;
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const dob = document.getElementById('dob').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const designation = document.getElementById('designation').value;
  const hourlyRate = document.getElementById('hourlyRate').value;
  const projectRate = document.getElementById('projectRate').value;
  const skills = document.getElementById('skills').value;
  const aboutMe = document.getElementById('inputBox').value;
  const linkedin = document.getElementById('linkedin').value;
  const twitter = document.getElementById('twitter').value;
  const github = document.getElementById('github').value;
  const aadhaarNumber = document.getElementById('txtAadhaar').value;

  // Handle profile image upload
  const profileImageFile = document.getElementById('profileImage').files[0];
  let profileImageUrl = '';

  if (profileImageFile) {
    const storageRef = ref(storage, `profile_images/${auth.currentUser.uid}/${profileImageFile.name}`);
    await uploadBytes(storageRef, profileImageFile);
    profileImageUrl = await getDownloadURL(storageRef);
  }

  // Prepare project and experience data
  const projects = [];
  const projectElements = document.querySelectorAll('#projectsContainer .project');
  projectElements.forEach((projectElement, index) => {
    const title = projectElement.querySelector(`#projectTitle${index}`).value;
    const description = projectElement.querySelector(`#projectDescription${index}`).value;
    projects.push({ title, description });
  });

  const experiences = [];
  const experienceElements = document.querySelectorAll('#experienceContainer .experience');
  experienceElements.forEach((experienceElement, index) => {
    const company = experienceElement.querySelector(`#company${index}`).value;
    const role = experienceElement.querySelector(`#role${index}`).value;
    const duration = experienceElement.querySelector(`#duration${index}`).value;
    experiences.push({ company, role, duration });
  });

  // Data to save in Firestore
  const freelancerData = {
    firstName,
    lastName,
    gender,
    dob,
    email,
    phone,
    designation,
    hourlyRate,
    projectRate,
    skills,
    aboutMe,
    linkedin,
    twitter,
    github,
    verification: {
      aadhaarNumber
    },
    profileImageUrl,
    projects,
    experiences
  };

  try {
    // Save the data to the 'freelancer' collection
    await setDoc(doc(db, "freelancer", auth.currentUser.uid), freelancerData);
    alert('Freelancer details saved successfully');
    // Optionally redirect to another page
    // window.location.href = 'freelancer_homepage.html';
  } catch (error) {
    console.error("Error saving document: ", error);
    document.getElementById('lblError').innerText = "Failed to save freelancer details. Please try again.";
  }
});
