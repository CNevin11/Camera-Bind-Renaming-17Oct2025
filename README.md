
# Frame to Camera Renamer (Web App)

This GitHub Pages app allows you to:
- Upload a `.csv` file with **Frame Number**, **Section ID**, and **Ticket Class ID** in columns A, B, and C.
- Upload `.jpeg` or `.jpg` images named with padded or unpadded frame numbers (e.g. `0001.jpg`)
- Files are renamed to format: `SId-<SectionId>-TCId-<TicketClassId>.jpeg`

## Example CSV

```
Frame Number,Section ID,Ticket Class ID
1,1144587,514
2,1144588,515
```

## Example Input → Output

```
0001.jpg → SId-1144587-TCId-514.jpeg
```

## How to Deploy to GitHub Pages

1. Upload files to a GitHub repo
2. Go to **Settings > Pages**
3. Set source to `main` branch and root
4. App will be available at `https://<your-username>.github.io/<repo-name>/`
