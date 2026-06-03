# 📷 Photo Editor & Printer

A simple, clean web-based photo editor designed to help users crop, enhance, and prepare photos for printing on standard paper sizes.

## Features

### 📸 Photo Upload
- **Single or Multiple Photos**: Upload one or multiple photos at once
- **Drag & Drop Support**: Simply drag photos into the upload area
- **Photo Management**: Select, view, and remove photos from your list

### ✂️ Cropping & Display
- **Automatic Fitting**: Photos automatically fit to selected paper size
- **Aspect Ratio Preservation**: Images maintain their aspect ratio on canvas
- **Multiple Paper Sizes**: Choose from A3, A4, A5, and Letter sizes

### 🎨 Image Enhancement Filters
- **Brightness**: Adjust brightness from -50% to +50%
- **Contrast**: Control contrast levels
- **Clarity**: Enhance image sharpness
- **Saturation**: Adjust color intensity

### 📄 Paper Size Options
- **A4** (210×297mm) - Standard document size
- **A3** (297×420mm) - Larger format
- **A5** (148×210mm) - Smaller format
- **Letter** (8.5×11") - US standard

### 💾 Export Options
- **Download**: Save edited photos as PNG files
- **Print**: Send directly to printer with proper formatting
- **Print-Ready**: Automatically formats for selected paper size

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Image Processing**: HTML5 Canvas API
- **No Dependencies**: Pure vanilla JavaScript - no external libraries needed

## How to Use

1. **Upload Photos**
   - Click the upload area or drag photos into it
   - Select a photo to edit from the photo list

2. **Select Paper Size**
   - Choose your desired paper size from the options
   - The canvas will adjust automatically

3. **Apply Enhancements**
   - Use the sliders to adjust brightness, contrast, clarity, and saturation
   - Changes are applied in real-time

4. **Export or Print**
   - Click "Download" to save as PNG file
   - Click "Print" to open print dialog
   - Use "Reset Filters" to start over

## Browser Support

- Chrome/Chromium (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)

## Future Enhancements

- [ ] Crop tool with custom aspect ratio
- [ ] Rotate and flip options
- [ ] More filter options (blur, grayscale, sepia, etc.)
- [ ] Batch processing
- [ ] Advanced sharpening algorithm
- [ ] Photo gallery/history
- [ ] Local storage for recent edits

## File Structure

```
web_model/
├── index.html      # Main HTML file
├── style.css       # Styling
├── script.js       # Functionality
└── README.md       # Documentation
```

## Getting Started

1. Clone this repository
2. Open `index.html` in your web browser
3. Start editing your photos!

## License

Open source - feel free to use and modify

## Support

For issues or feature requests, please create an issue in the repository.
