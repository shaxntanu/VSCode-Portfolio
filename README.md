# 💻 VS Code Portfolio

<div align="center">

![Portfolio Cover](public/og-image.png)

![VS Code Portfolio](https://img.shields.io/badge/VS%20Code-Portfolio-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15.2.3-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)

**My portfolio, but make it look like VS Code**

[🌐 Live Site](https://shantanu-vsc-portfolio.vercel.app) • [🐛 Found a Bug?](https://github.com/shaxntanu/VSCode-Portfolio/issues) • [💡 Got Ideas?](https://github.com/shaxntanu/VSCode-Portfolio/issues)

</div>
  
---

## What's This?

I spend most of my time in VS Code building hardware and firmware, so I figured — why not make my portfolio look like it too?

This isn't just a themed website. It actually mimics VS Code's interface with a working file explorer, tabs, sidebar navigation, and even a terminal-style resume viewer. The home page shows Arduino/C++ pseudo-code that describes how I work (spoiler: lots of debugging and coffee).

Built with Next.js because I wanted something fast and SEO-friendly. The web stuff is mostly AI-assisted since my focus is on embedded systems and IoT hardware.

## What's Inside

**Pages:**
- **Home** - Pseudo-code that won't compile but tells you how I think
- **About** - Who I am, what I build, and why (with a world map because why not)
- **Projects** - Hardware modules, IoT systems, and some web dashboards
- **Resume** - Terminal-style CV that auto-updates from my LaTeX repo on GitHub
- **Experience** - Work history with Ragastra and Grosity
- **Research** - Technical reports and articles
- **GitHub** - Live stats pulled from GitHub API
- **Skills** - Tech stack in CSV format + skill matrix visualization
- **Contact** - JSON-formatted contact info (keeping the dev theme consistent)

**Cool Stuff:**
- Animated text effects (decryption, rotation, shimmer)
- Click sparks because they're fun
- Collapsible file explorer with smooth animations
- Theme switcher (multiple VS Code themes)
- Lite mode toggle for performance
- Mobile-friendly (with a notification suggesting desktop for best experience)

**Technical:**
- Next.js 15 with TypeScript
- CSS Modules for styling
- Framer Motion for animations
- GitHub API integration for live data
- Vercel deployment with auto-updates

## Why This Exists

I needed a portfolio that actually represents what I do. Most templates felt too corporate or startup-y. Since I live in VS Code anyway, this felt more honest.

The web development part was done with AI assistance (Claude, Copilot, Kiro IDE) because I'd rather spend time on hardware. But the content, structure, and design decisions are all mine.

## Running Locally

```bash
# Clone it
git clone https://github.com/shaxntanu/VSCode-Portfolio.git
cd VSCode-Portfolio

# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
npm start
```

Open `http://localhost:3000` and you're good to go.

## Resume Auto-Update

The resume page pulls the latest PDF from my [LaTeX Resume repo](https://github.com/shaxntanu/LaTeX-Resume-Shantanu). Whenever I update my resume there, it automatically reflects here. No manual uploads needed.

## License

MIT License - use it, fork it, modify it. Just don't claim you built it from scratch.

See [LICENSE](https://github.com/shaxntanu/VSCode-Portfolio/blob/main/LICENSE) for details.

## Credits

- VS Code for the interface inspiration
- [Iconify](https://iconify.design/) and [React Icons](https://react-icons.github.io/react-icons/) for icons
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- Coffee for making this possible

---

<div align="center">

**If this helped you, star it. If it didn't, open an issue.**

Built by [Shantanu](https://github.com/shaxntanu) • Deployed on [Vercel](https://vercel.com)

</div>
