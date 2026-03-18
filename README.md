# Portfolio Website

A modern, responsive portfolio website to showcase your work and connect to your resume.

## Quick Start

1. Open `index.html` in your browser to preview the site
2. Customize the content with your own information
3. Add your resume PDF file

## Connecting Your Resume

1. **Add your resume file**: Place your resume PDF in this folder and name it `resume.pdf`
2. The "Download Resume" button and navigation link will automatically link to it
3. Visitors can view/download your resume directly from the site

## Customization Guide

### Personal Information
Edit `index.html` to update:

- **Name**: Search for "Your Name" and replace with your actual name
- **Title**: Change "Full Stack Developer" to your role
- **Description**: Update the hero description and about section
- **Contact Info**: Update email, phone, and location
- **Social Links**: Add your GitHub, LinkedIn, Twitter URLs

### Skills
In the Skills section, modify the skill tags to match your expertise:
```html
<span class="skill-tag">Your Skill</span>
```

### Projects
For each project, update:
- Project title and description
- Technologies used
- Links to live demo and GitHub repo
- Replace placeholder icons with actual screenshots

### Profile Image
To add your photo:
1. Replace the profile placeholder in the hero section
2. Change:
```html
<div class="profile-placeholder">
    <i class="fas fa-user"></i>
</div>
```
To:
```html
<img src="your-photo.jpg" alt="Your Name" class="profile-img">
```

3. Add this CSS to `styles.css`:
```css
.profile-img {
    width: 350px;
    height: 350px;
    border-radius: 50%;
    object-fit: cover;
}
```

### Colors
Edit the CSS variables in `styles.css` to change the color scheme:
```css
:root {
    --primary-color: #6366f1;    /* Main accent color */
    --secondary-color: #0ea5e9;  /* Secondary accent */
    --dark-bg: #0f172a;          /* Background color */
}
```

### Contact Form
The contact form currently logs to console. To make it functional:

**Option 1 - Formspree (Easy)**
1. Sign up at [formspree.io](https://formspree.io)
2. Get your form endpoint
3. Update the form tag:
```html
<form action="https://formspree.io/f/YOUR_ID" method="POST">
```

**Option 2 - EmailJS**
1. Sign up at [emailjs.com](https://www.emailjs.com)
2. Follow their integration guide
3. Update `script.js` with your EmailJS credentials

## Project Structure

```
portfolio/
├── index.html      # Main HTML file
├── styles.css      # All styling
├── script.js       # JavaScript functionality
├── resume.pdf      # Your resume (add this)
└── README.md       # This file
```

## Features

- Responsive design (mobile, tablet, desktop)
- Smooth scroll navigation
- Animated sections on scroll
- Typing effect for role/title
- Interactive project cards
- Contact form
- Back to top button
- Modern dark theme

## Deployment

### GitHub Pages
1. Create a GitHub repository
2. Push your code
3. Go to Settings > Pages
4. Select branch and save
5. Your site will be live at `https://username.github.io/repo-name`

### Netlify
1. Go to [netlify.com](https://www.netlify.com)
2. Drag and drop your portfolio folder
3. Your site is live instantly!

### Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Deploy automatically

## License

Feel free to use and modify this template for your personal portfolio.
