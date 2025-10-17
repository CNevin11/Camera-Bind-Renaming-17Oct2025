# Frame to Camera Renamer (Web App)

This GitHub Pages app allows you to:
- Upload a `.csv` file with **CameraName in column 1** and **FrameNumber in column 2**
- Upload a batch of `.jpeg` or `.jpg` images with padded/unpadded frame numbers
- All `.jpg` files will be renamed to `.jpeg`
- `.001`, `.002` style suffixes will be ignored in camera IDs

## Example CSV

```
SId-123456.001,1
SId-789012.002,2
```

## Example Image

```
img_00001.jpg → SId-123456.jpeg
```

## GitHub Pages Deployment

1. Create a repo and upload the files
2. Go to Settings > Pages > Source: `main` + `/ (root)`
3. Access the live app at:
   https://<your-username>.github.io/frame-camera-renamer/
