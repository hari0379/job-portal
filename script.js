
const jobs = [
    {
        id: 1,
        title: "Frontend Developer",
        company: "TechCorp",
        logo: "https://logo.clearbit.com/techcorp.com",
        location: "San Francisco, CA",
        type: "Full-time",
        salary: "$90,000 - $120,000",
        posted: "2 days ago",
        skills: ["HTML", "CSS", "JavaScript", "React"]
    },
    {
        id: 2,
        title: "UX Designer",
        company: "DesignHub",
        logo: "https://logo.clearbit.com/designhub.com",
        location: "Remote",
        type: "Contract",
        salary: "$70 - $90 per hour",
        posted: "1 week ago",
        skills: ["Figma", "Sketch", "UI/UX", "Prototyping"]
    },
    {
        id: 3,
        title: "Data Scientist",
        company: "DataWorks",
        logo: "https://logo.clearbit.com/dataworks.com",
        location: "New York, NY",
        type: "Full-time",
        salary: "$110,000 - $140,000",
        posted: "3 days ago",
        skills: ["Python", "Machine Learning", "SQL", "Pandas"]
    },
    {
        id: 4,
        title: "Marketing Manager",
        company: "GrowthInc",
        logo: "https://logo.clearbit.com/growthinc.com",
        location: "Chicago, IL",
        type: "Full-time",
        salary: "$80,000 - $100,000",
        posted: "5 days ago",
        skills: ["Digital Marketing", "SEO", "Social Media", "Content Strategy"]
    },
    {
        id: 5,
        title: "Backend Engineer",
        company: "CloudSystems",
        logo: "https://logo.clearbit.com/cloudsystems.com",
        location: "Austin, TX",
        type: "Full-time",
        salary: "$100,000 - $130,000",
        posted: "1 day ago",
        skills: ["Node.js", "Python", "AWS", "Docker"]
    },
    {
        id: 6,
        title: "Product Manager",
        company: "InnovateCo",
        logo: "https://logo.clearbit.com/innovateco.com",
        location: "Boston, MA",
        type: "Full-time",
        salary: "$95,000 - $125,000",
        posted: "2 weeks ago",
        skills: ["Agile", "Product Development", "Market Research", "Roadmapping"]
    }
];

// DOM Elements
const jobListingsEl = document.getElementById('jobListings');
const testimonialSlides = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
// User Authentication System
let currentUser = null;

// DOM Elements for Auth
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const employerRegisterModal = document.getElementById('employerRegisterModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const employerRegisterForm = document.getElementById('employerRegisterForm');
const authButtons = document.querySelector('.auth-buttons');

// Modal toggle buttons
document.querySelector('.btn-login').addEventListener('click', () => toggleModal('loginModal'));
document.querySelector('.btn-register').addEventListener('click', () => toggleModal('registerModal'));
document.getElementById('showRegister').addEventListener('click', (e) => {
    e.preventDefault();
    toggleModal('registerModal', 'loginModal');
});
document.getElementById('showLogin').addEventListener('click', (e) => {
    e.preventDefault();
    toggleModal('loginModal', 'registerModal');
});
document.getElementById('showEmployerRegister').addEventListener('click', (e) => {
    e.preventDefault();
    toggleModal('employerRegisterModal', 'loginModal');
});
document.getElementById('showEmployerLogin').addEventListener('click', (e) => {
    e.preventDefault();
    toggleModal('loginModal', 'employerRegisterModal');
});

// Close modals
document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.auth-modal').forEach(modal => {
            modal.classList.remove('active');
        });
    });
});

// Toggle modal function
function toggleModal(showId, hideId = null) {
    if (hideId) {
        document.getElementById(hideId).classList.remove('active');
    }
    document.getElementById(showId).classList.add('active');
}

// Sample user database (in a real app, this would be a backend API)
const users = {
    jobSeekers: [],
    employers: []
};

// Form submissions
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Check job seekers
    const jobSeeker = users.jobSeekers.find(user => user.email === email && user.password === password);
    if (jobSeeker) {
        loginUser(jobSeeker, 'jobSeeker');
        return;
    }
    
    // Check employers
    const employer = users.employers.find(user => user.email === email && user.password === password);
    if (employer) {
        loginUser(employer, 'employer');
        return;
    }
    
    alert('Invalid email or password');
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (users.jobSeekers.some(user => user.email === email) || users.employers.some(user => user.email === email)) {
        alert('Email already registered');
        return;
    }
    
    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        type: 'jobSeeker',
        resume: null,
        appliedJobs: []
    };
    
    users.jobSeekers.push(newUser);
    loginUser(newUser, 'jobSeeker');
    alert('Registration successful!');
});

employerRegisterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const companyName = document.getElementById('employerName').value;
    const email = document.getElementById('employerEmail').value;
    const password = document.getElementById('employerPassword').value;
    const confirmPassword = document.getElementById('employerConfirmPassword').value;
    const website = document.getElementById('employerWebsite').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (users.jobSeekers.some(user => user.email === email) || users.employers.some(user => user.email === email)) {
        alert('Email already registered');
        return;
    }
    
    const newEmployer = {
        id: Date.now().toString(),
        companyName,
        email,
        password,
        website,
        type: 'employer',
        jobsPosted: []
    };
    
    users.employers.push(newEmployer);
    loginUser(newEmployer, 'employer');
    alert('Company registration successful!');
});

// Login function
function loginUser(user, userType) {
    currentUser = user;
    currentUser.type = userType;
    
    // Close all modals
    document.querySelectorAll('.auth-modal').forEach(modal => {
        modal.classList.remove('active');
    });
    
    // Update UI
    updateAuthUI();
    
    // Store in session (in a real app, you'd use proper session management)
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
}

// Logout function
function logoutUser() {
    currentUser = null;
    sessionStorage.removeItem('currentUser');
    updateAuthUI();
}

// Update UI based on auth state
function updateAuthUI() {
    if (currentUser) {
        // Hide auth buttons
        authButtons.style.display = 'none';
        
        // Create user profile element
        const userProfile = document.createElement('div');
        userProfile.className = 'user-profile';
        
        const userAvatar = document.createElement('div');
        userAvatar.className = 'user-avatar';
        userAvatar.innerHTML = currentUser.type === 'jobSeeker' 
            ? `<img src="https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=2563eb&color=fff" alt="${currentUser.name}">`
            : `<img src="https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.companyName)}&background=2563eb&color=fff" alt="${currentUser.companyName}">`;
        
        const userName = document.createElement('span');
        userName.className = 'user-name';
        userName.textContent = currentUser.type === 'jobSeeker' ? currentUser.name : currentUser.companyName;
        
        const userMenu = document.createElement('div');
        userMenu.className = 'user-menu';
        
        if (currentUser.type === 'jobSeeker') {
            userMenu.innerHTML = `
                <a href="#"><i class="fas fa-user"></i> My Profile</a>
                <a href="#"><i class="fas fa-file-alt"></i> My Resume</a>
                <a href="#"><i class="fas fa-briefcase"></i> My Applications</a>
                <hr>
                <a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</a>
            `;
        } else {
            userMenu.innerHTML = `
                <a href="#"><i class="fas fa-building"></i> Company Profile</a>
                <a href="#"><i class="fas fa-plus"></i> Post a Job</a>
                <a href="#"><i class="fas fa-users"></i> Applicants</a>
                <hr>
                <a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</a>
            `;
        }
        
        userProfile.appendChild(userAvatar);
        userProfile.appendChild(userName);
        userProfile.appendChild(userMenu);
        
        // Insert before nav
        document.querySelector('header .container').insertBefore(userProfile, document.querySelector('nav'));
        
        // Add logout event
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            logoutUser();
        });
    } else {
        // Show auth buttons
        authButtons.style.display = 'block';
        
        // Remove user profile if exists
        const userProfile = document.querySelector('.user-profile');
        if (userProfile) {
            userProfile.remove();
        }
    }
}

// Check for existing session on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
    }
    
    // Rest of your existing initialization code...
});
// Display job listings
function displayJobs() {
    jobListingsEl.innerHTML = jobs.map(job => `
        <div class="job-card" data-id="${job.id}">
            <div class="job-header">
                <div class="job-company">
                    <img src="${job.logo}" alt="${job.company}">
                </div>
                <div class="job-info">
                    <h3>${job.title}</h3>
                    <p>${job.company}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${job.location}</p>
                </div>
            </div>
            <div class="job-details">
                <span><i class="far fa-clock"></i> ${job.type}</span>
                <span><i class="fas fa-dollar-sign"></i> ${job.salary}</span>
                <span><i class="far fa-calendar-alt"></i> ${job.posted}</span>
            </div>
            <div class="job-footer">
                <span class="job-type">${job.type}</span>
                <span class="job-salary">${job.salary}</span>
            </div>
        </div>
    `).join('');
}

// Testimonial slider
let currentSlide = 0;

function showSlide(n) {
    testimonialSlides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = (n + testimonialSlides.length) % testimonialSlides.length;
    
    testimonialSlides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

// Event listeners
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayJobs();
    
    // Auto slide testimonials
    setInterval(nextSlide, 5000);
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});