# 💻 VS Code Portfolio

<div align="center">

![VS Code Portfolio](https://img.shields.io/badge/VS%20Code-Portfolio-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15.2.3-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)

**A stunning developer portfolio that looks and feels like VS Code**

[🌐 Deployed](https://vs-code-portfolio-one.vercel.app) • [📝 Report Bug](https://github.com/shaxntanu/VSCode-Portfolio/issues) • [✨ Request Feature](https://github.com/shaxntanu/VSCode-Portfolio/issues)

</div>

---

## 🎯 Overview

This portfolio website is designed to mimic the Visual Studio Code interface, providing a unique and immersive experience for visitors. Built with modern web technologies, it showcases projects, skills, and experience in an interactive and developer-friendly way.

## ✨ Features

### 🎨 **VS Code Interface**
- Authentic VS Code dark theme with custom color schemes
- Functional sidebar with navigation icons
- Tabbed interface with smooth animations
- Explorer panel with collapsible folders
- Bottom status bar with real-time information

### 📱 **Responsive Design**
- Mobile-friendly with hamburger menu
- Tablet and desktop optimized layouts
- Mobile notification for optimal viewing experience
- Touch-friendly interactions

### 🚀 **Interactive Pages**
- **Home** - Arduino-style C++ code introduction
- **About** - Personal information with interactive world map showing location
- **Projects** - Showcase of IoT and embedded systems projects
- **Tech Stack** - CSV-style skills table with status indicators
- **Skill Matrix** - Visual skill proficiency matrix
- **GitHub** - Live GitHub stats and contribution graph
- **README** - Auto-fetched GitHub profile README (updates automatically)
- **Experience** - Timeline-based work history with markdown support
- **Research** - Academic papers and technical reports
- **Resume** - Terminal-style CV viewer with download option
- **Typing Test** - Interactive typing speed test with stats
- **Contact** - JSON-formatted contact information

### 🎭 **Animations & Effects**
- **RotatingText** - Animated text rotation with character-by-character stagger effects
- **DecryptedText** - Matrix-style text decryption animation on hover/view
- **ShinyText** - Gradient shimmer effect for text elements
- **ClickSpark** - Interactive spark particles on click
- Framer Motion animations for smooth page transitions
- Staggered folder/file animations in explorer
- Tab slide-in/out effects with smooth transitions

### 🔧 **Technical Features**
- Server-side rendering with Next.js
- TypeScript for type safety
- Dynamic routing and prefetching
- GitHub API integration
- Local storage for user preferences
- SEO optimized with custom meta tags

## 🛠️ Tech Stack

- **Framework:** Next.js 15.2.3
- **Language:** TypeScript 5.8.2
- **Styling:** CSS Modules
- **Animations:** Framer Motion 12.23.24 + GSAP 3.13.0
- **Icons:** Iconify + React Icons 5.5.0 (VS Code icons)
- **Markdown:** React Markdown with rehype-raw
- **GitHub Integration:** React GitHub Calendar 4.5.6
- **Deployment:** Vercel
- **API:** GitHub REST API

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shaxntanu/VSCode-Portfolio.git
   cd VSCode-Portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_GITHUB_USERNAME=your-github-username
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Customization

### Update Personal Information

1. **Projects** - Edit `data/projects.ts`
   ```typescript
   export const projects = [
     {
       id: 1,
       name: 'Your Project',
       image: '/path-to-image.png',
       description: 'Project description',
       tags: ['tag1', 'tag2'],
       source_code: 'https://github.com/...',
       demo: 'https://...'
     }
   ];
   ```

2. **About Page** - Edit `pages/about.tsx`

3. **Contact Info** - Edit `pages/contact.tsx`

4. **Experience** - Edit `pages/experience.tsx`

5. **Tech Stack** - Edit `pages/techstack.tsx`

### Customize Theme Colors

Edit CSS variables in your global styles or component CSS modules:
```css
:root {
  --accent-color: #007acc;
  --main-bg: #1e1e1e;
  --sidebar-bg: #333333;
  --explorer-bg: #252526;
}
```

### Add Custom Icons

Place your icons in `public/logos/` and reference them in your components.

## 📁 Project Structure

```
VSCode-Portfolio/
├── components/          # React components
│   ├── Titlebar.tsx    # Top window bar
│   ├── Sidebar.tsx     # Left navigation sidebar
│   ├── Explorer.tsx    # File explorer panel
│   ├── Tabsbar.tsx     # Tab management
│   ├── RotatingText.tsx # Animated rotating text
│   ├── DecryptedText.tsx # Matrix-style decryption effect
│   ├── ShinyText.tsx   # Gradient shimmer effect
│   ├── ClickSpark.tsx  # Click particle effects
│   └── ...
├── pages/              # Next.js pages
│   ├── index.tsx       # Home page
│   ├── about.tsx       # About page
│   ├── projects.tsx    # Projects showcase
│   ├── experience.tsx  # Work experience timeline
│   ├── techstack.tsx   # Skills and technologies
│   ├── github.tsx      # GitHub stats
│   └── ...
├── styles/             # CSS modules
├── contexts/           # React contexts
├── data/               # Static data (projects, etc.)
├── public/             # Static assets (logos, icons)
└── types/              # TypeScript types
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy!

### Deploy to Other Platforms

```bash
npm run build
npm start
```

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](https://github.com/shaxntanu/VSCode-Portfolio/blob/main/LICENSE).

## 👨‍💻 Author

**Shantanu Maratha**

- Portfolio: [vs-code-portfolio-one.vercel.app](https://vs-code-portfolio-one.vercel.app)
- GitHub: [@shaxntanu](https://github.com/shaxntanu)

## 🙏 Acknowledgments

- Inspired by Visual Studio Code's interface
- Icons from [Iconify](https://iconify.design/) and [React Icons](https://react-icons.github.io/react-icons/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with ❤️ and lots of ☕ By Shantanu

</div>
