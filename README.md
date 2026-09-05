# VS Code Portfolio

<div align="center">

![Portfolio Cover](public/Portfolio%20Cover%20Image.png?v=2)

![VS Code Portfolio](https://img.shields.io/badge/VS%20Code-Portfolio-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15.2.3-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)

**My portfolio, designed to look like the editor I use every day**

[Live Site](https://shantanu-vsc-portfolio.vercel.app) | [Report Bug](https://github.com/shaxntanu/VSCode-Portfolio/issues) | [Request Feature](https://github.com/shaxntanu/VSCode-Portfolio/issues)

</div>
  
---

## Overview

I spend most of my time in VS Code working on hardware and firmware, so I built my portfolio to match that workflow.

This is not just another themed website. It replicates VS Code's interface with a working file explorer, tab system, sidebar navigation, and a terminal-style resume viewer. The home page displays Arduino/C++ pseudo-code that describes my development process (including debugging, testing, and the occasional troubleshooting session).

Built with Next.js for fast performance and SEO optimization. The web development was mostly AI-assisted since my primary focus is embedded systems and IoT hardware. I prefer working with microcontrollers and circuits over styling CSS.

## Features

**Pages:**
- **Home** - Pseudo-code representation of my development workflow
- **About** - Background, interests, and current work (includes an interactive world map)
- **Circuits** - Embedded projects with circuit simulations, schematics, and code viewers
- **Coursework** - Academic projects organized by year (mobile apps, image processing, simulations, AI/ML, digital logic)
- **Projects** - Hardware modules, IoT systems, and web applications with integrated BOM viewer
- **Resume** - Terminal-style CV that auto-updates from my LaTeX repository
- **Experience** - Work history and role descriptions
- **Publications** - Technical reports and documentation
- **GitHub** - Live statistics from GitHub API
- **Tech Stack** - Technologies in CSV format with skill proficiency matrix
- **Contact** - Contact information in JSON format

**Components:**
- Bill of Materials (BOM) viewer with sortable component tables and pricing
- Circuit simulator embeds with code viewers and schematic galleries
- Multiple code variant support for different implementations
- Animated text effects (decryption, rotation, shimmer)
- Click sparks for visual feedback
- Collapsible file explorer with smooth transitions
- Activity badges showing project and publication counts
- Professional status bar with build information
- Theme switcher with multiple VS Code color schemes
- Lite mode for improved performance
- Mobile responsive design with desktop experience notification

**Technical Stack:**
- Next.js 15 with TypeScript
- CSS Modules for component styling
- Framer Motion for animations
- GitHub API integration for dynamic data
- Configuration-driven status bar and badge system
- Ctrl+K and Ctrl+Shift+P command palettes
- Vercel deployment with continuous integration

## Purpose

I needed a portfolio that accurately represents my work. Most templates felt too generic or startup-focused for someone who builds IoT systems and designs PCBs. Since I use VS Code daily, this approach felt more authentic.

The web development was AI-assisted (Claude, GitHub Copilot, Kiro IDE) because my expertise is in embedded systems and hardware design. The content, structure, and design decisions were manually crafted based on my actual workflow and project requirements.

## Resume Integration

The resume page pulls the latest PDF from my [LaTeX Resume repository](https://github.com/shaxntanu/LaTeX-Resume-Shantanu). Updates to that repository automatically reflect on this site through Vercel deployment.

## License

MIT License. You are free to use, modify, and distribute this code with proper attribution.

See the [LICENSE](https://github.com/shaxntanu/VSCode-Portfolio/blob/main/LICENSE) file for complete details.

## Acknowledgments

- VS Code for providing the primary development environment
- [Iconify](https://iconify.design/) and [React Icons](https://react-icons.github.io/react-icons/) for comprehensive icon libraries
- [Framer Motion](https://www.framer.com/motion/) for animation framework
- Open source community for tools and resources

---

<div align="center">

**If you find this useful, please star the repository. For bugs or feature requests, open an issue.**

Built by [Shantanu](https://github.com/shaxntanu) | Deployed on [Vercel](https://vercel.com)

</div>
