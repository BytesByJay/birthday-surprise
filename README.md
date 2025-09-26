# 🎉 Magical 25th Birthday Website

A beautiful, animated single-page website designed as a surprise 25th birthday present. Features include 3D animations, photo galleries, countdown timers, and magical effects that will make this birthday truly special!

## ✨ Features

- **3D Hero Section**: Interactive Three.js animations with floating particles
- **Family Photo Gallery**: Beautiful image carousel with Unsplash placeholder photos
- **Birthday Messages**: Animated message cards from family members
- **Interactive Surprise**: Click to reveal balloons and confetti effects
- **Countdown Timer**: Live countdown to the special day
- **Background Music**: Toggle-able birthday music
- **Mobile Responsive**: Looks perfect on all devices
- **Magical Effects**: Glassmorphism, gradients, parallax scrolling, and more

## 🚀 Quick Start

### Option 1: Simple Local Setup
1. Download all files to a folder on your computer
2. Open `index.html` in any modern web browser
3. The website will work immediately with placeholder content!

### Option 2: Local Server (Recommended)
If you have Python installed:
```bash
# Navigate to the project folder
cd birthday-surprise-website

# Start a simple server (Python 3)
python -m http.server 8000

# Or Python 2
python -m SimpleHTTPServer 8000

# Open http://localhost:8000 in your browser
```

If you have Node.js installed:
```bash
# Install a simple server
npm install -g http-server

# Start the server
http-server

# Open the provided URL in your browser
```

## 🎨 Customization Guide

### 1. Change the Name
Edit `script.js` line 56:
```javascript
namePlaceholder.textContent = 'Sarah'; // Change 'Sarah' to the birthday person's name
```

### 2. Update Birthday Date
Edit `script.js` line 368:
```javascript
const targetDate = new Date('2024-12-31T00:00:00').getTime(); // Change to actual birthday
```

### 3. Replace Placeholder Photos
The gallery currently uses Unsplash placeholder images. To add real family photos:

1. Create a `photos` folder in your project directory
2. Add your photos (name them `photo1.jpg`, `photo2.jpg`, etc.)
3. Edit `script.js` lines 251-261 to point to your photos:
```javascript
const photoUrls = [
    './photos/photo1.jpg',
    './photos/photo2.jpg',
    // ... add more photos
];
```

### 4. Customize Messages
Edit the HTML in `index.html` starting around line 127 to change the birthday messages:
```html
<p class="message-text">
    "Your custom birthday message here!"
</p>
<div class="message-author">
    <span class="author-name">— Your Name</span>
</div>
```

### 5. Customize Background Music (Optional)
A sample audio file is already included! To use your own:
1. Get a birthday song (MP3 format, under 5MB)
2. Replace the current `birthday-song.mp3` file with your preferred audio
3. Keep the same filename for automatic detection

### 6. Customize Colors
Edit `styles.css` to change the color scheme. The main colors are defined in CSS variables starting at line 22:
```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    /* ... update these to your preferred colors */
}
```

## 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ❌ Internet Explorer (not supported)

## 🎯 Advanced Customization

### Adding More Sections
You can easily add more sections by following the existing pattern:
1. Add HTML structure
2. Add CSS styles following the existing naming conventions
3. Add JavaScript functionality if needed

### Performance Tips
- Optimize images before uploading (use tools like TinyPNG)
- Keep audio files under 5MB
- Test on mobile devices for the best experience

### Hosting Options
Deploy your website for free on:
- **Netlify**: Drag and drop deployment
- **Vercel**: GitHub integration
- **GitHub Pages**: Free hosting for public repositories

## 🎊 Special Effects Guide

### Triggering Confetti
Call `triggerConfetti()` from anywhere in your JavaScript to create confetti effects.

### Adding Custom Animations
The project uses GSAP for animations. Add new animations like:
```javascript
gsap.fromTo('.your-element', 
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 1 }
);
```

## 🐛 Troubleshooting

**Audio not playing?**
- Browsers block autoplay. User must interact with the page first
- Check that your audio file is properly formatted (MP3 recommended)
- Some browsers require HTTPS for audio features

**3D effects not working?**
- Three.js requires WebGL support
- Try a different browser or device
- The site will work without 3D effects if they fail to load

**Photos not loading?**
- Check file paths are correct
- Ensure image files are in the right location
- Use common formats (JPG, PNG, WebP)

## 📝 File Structure

```
birthday-surprise-website/
├── index.html          # Main HTML structure
├── styles.css          # All styling and animations
├── script.js           # Interactive functionality
├── birthday-song.mp3   # Background music (replace with actual file)
└── README.md          # This file
```

## 🎁 Tips for the Perfect Surprise

1. **Test everything** before the big reveal
2. **Use real photos** for maximum emotional impact
3. **Personalize the messages** with inside jokes and memories
4. **Set the countdown** to the exact birthday time
5. **Pick meaningful music** that has special significance
6. **Share the link** or present it on a tablet/laptop

## 💝 Final Notes

This website is designed with love and attention to detail. Every animation, color, and effect has been chosen to create a magical birthday experience. Feel free to modify and enhance it to make it even more special!

**Remember**: The most important part isn't the code—it's the love and thought you put into creating something special for someone you care about. 💕

## 🙏 Acknowledgments

- **Three.js** for 3D graphics
- **GSAP** for smooth animations
- **Unsplash** for beautiful placeholder photos
- **Google Fonts** for typography

---

*Made with 💖 for a very special 25th birthday!*

## 🔧 Technical Details

- **No build process required** - runs directly in the browser
- **Vanilla JavaScript** - no framework dependencies
- **CSS Grid & Flexbox** - modern responsive layouts
- **Progressive Enhancement** - works even if JavaScript fails
- **Accessibility Friendly** - respects reduced motion preferences
- **Performance Optimized** - lazy loading, efficient animations