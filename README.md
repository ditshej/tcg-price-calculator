# TCG Prize Calculator

A modern, responsive web application for calculating booster pack distribution in Trading Card Game tournaments. Built with Alpine.js, Tailwind CSS, and Vite.

![TCG Prize Calculator](https://img.shields.io/badge/status-ready-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Built with AI](https://img.shields.io/badge/built%20with-AI%20assistance-purple)

## Features

- **Mobile-First Design**: Optimized for smartphones with responsive landscape mode
- **Real-Time Calculation**: Automatic prize distribution as you adjust player count
- **Professional UI**: Clean design using Heroicons and warm color palette
- **Touch Optimized**: Intuitive +/- buttons with visual feedback
- **Responsive Layout**: Adapts perfectly to portrait and landscape orientations

## Demo

Visit the live demo: [TCG Prize Calculator](https://your-demo-url.com) *(replace with actual URL)*

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ditshej/tcg-price-calculator.git
   cd tcg-price-calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## Usage

1. **Set Player Count**: Use the +/- buttons or input field to set the number of players
2. **View Results**: Instantly see total boosters, full displays, and remaining packs
3. **Prize Distribution**: View the calculated prize distribution for each placement
4. **Responsive Design**: Rotate your device for optimized landscape view

### Calculation Logic

The app calculates prizes based on:
- Each player contributes 3 boosters to the prize pool
- Prizes are distributed using a weighted curve favoring higher placements
- Displays are calculated based on 24 boosters per display
- Remaining boosters are shown separately

## Technology Stack

- **Frontend Framework**: [Alpine.js](https://alpinejs.dev/) - Lightweight reactive framework
- **CSS Framework**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- **Build Tool**: [Vite](https://vitejs.dev/) - Fast build tool and dev server
- **Icons**: [Heroicons](https://heroicons.com/) - Beautiful SVG icons
- **Fonts**: [Inter](https://fonts.google.com/specimen/Inter) - Modern typography

## Development Notes

### ⚠️ Testing Status
**This application has not been thoroughly tested.** While it works for basic use cases, please verify calculations independently for tournament use.

### AI Development
This project was developed with AI assistance (Claude/ChatGPT) for:
- UI/UX design and implementation
- Responsive layout optimization
- Code structure and best practices
- Documentation and setup

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design works on all screen sizes

## Contributing

Contributions are welcome! Please feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**You are free to:**
- ✅ Use commercially
- ✅ Modify and distribute
- ✅ Use privately
- ✅ Sublicense

**The only requirement is to include the original license notice.**

## Acknowledgments

- Built for One Piece TCG tournaments at [Two Moons](https://www.twomoons.ch/events/one-piece-events/)
- Icons by [Heroicons](https://heroicons.com/)
- Fonts by [Google Fonts](https://fonts.google.com/)

## Support

If you find this project helpful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting issues
- 💡 Suggesting improvements
- 🤝 Contributing code

## Disclaimer

This tool is provided as-is for convenience. Always verify prize calculations manually for official tournament use. The developers assume no responsibility for calculation errors or tournament disputes.

---

*Made with AI assistance and human oversight • 2025*
