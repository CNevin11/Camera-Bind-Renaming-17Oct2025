
# Frame to Camera Renamer Web Tool

This is a simple GitHub Pages-compatible tool that allows you to:
- Upload a CSV file containing frame-to-camera name mappings
- Upload multiple JPEG images with frame numbers in the filename (e.g. `0001.jpg`)
- Output a ZIP file with all images renamed to their matching camera names (e.g. `SId-123456.jpeg`)

## Features
- Normalizes padded frame numbers (`1`, `001`, `0001` are all treated the same)
- Removes `.001`, `.002` etc. from camera names
- Converts all output image extensions to `.jpeg`
- Displays skipped images (those without a frame match)

## How to Use on GitHub Pages
1. Upload this folder's contents to a GitHub repo
2. Go to the repo settings > Pages > set source to `/ (root)` and branch to `main`
3. Wait ~30 seconds and open the live site

Enjoy!
