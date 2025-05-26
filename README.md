# Pomodorini 🍅

A modern, customizable Pomodoro timer built with Svelte and TypeScript. Pomodorini helps you stay focused and productive using the Pomodoro Technique, with additional rhythm options for different work styles.

## Features

- 🎯 Multiple rhythm presets:
  - Pomodoro (25/5/15)
  - Ultradian (90/20/30)
  - DeskTime (52/17/30)
  - Custom rhythm settings
- 🎨 Beautiful, responsive UI with smooth transitions
- 🌓 Automatic mode switching between focus and break
- 📊 Visual progress indicator
- ⌨️ Keyboard shortcuts for better accessibility
- 🎯 Customizable work/break durations
- 💾 Persistent settings

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/Pomodorini.git
   cd Pomodorini
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Usage

1. Select your preferred rhythm (Pomodoro, Ultradian, DeskTime, or Custom)
2. Click "Start" to begin your focus session
3. Take breaks when prompted
4. Customize your rhythm settings as needed

### Keyboard Shortcuts

- `Space` - Start/Pause timer
- `R` - Reset timer
- `Esc` - Close modal
- `Enter` - Submit form

## Customization

You can customize your work/break durations by:

1. Clicking the "Custom" rhythm option
2. Setting your preferred work duration
3. Setting short and long break durations
4. Adjusting the number of cycles before a long break

## Building for Production

```bash
npm run build
# or
yarn build
```

## Technologies Used

- [Svelte](https://svelte.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [SvelteKit](https://kit.svelte.dev/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by the [Pomodoro Technique](https://www.pomodorotechnique.com/)
- Font: [Orbitron](https://fonts.google.com/specimen/Orbitron) by Google Fonts
