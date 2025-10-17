
document.getElementById('processBtn').addEventListener('click', async () => {
  const csvFile = document.getElementById('csvInput').files[0];
  const imageFiles = document.getElementById('jpegInput').files;

  if (!csvFile || imageFiles.length === 0) {
    alert("Please upload both a CSV file and JPEG images.");
    return;
  }

  const csvText = await csvFile.text();
  const frameToCameraMap = {};

  const lines = csvText.split(/\r?\n/);
  for (let i = 1; i < lines.length; i++) {
    const [frame, cameraName] = lines[i].split(',');
    if (frame && cameraName) {
      frameToCameraMap[frame.trim().padStart(3, '0')] = cameraName.trim();
    }
  }

  const zip = new JSZip();
  for (const file of imageFiles) {
    const baseName = file.name.replace(/\.[^.]+$/, '');
    const padded = baseName.padStart(3, '0');
    const newName = frameToCameraMap[padded];

    if (newName) {
      zip.file(newName + '.jpg', file);
    }
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'renamed_images.zip';
  a.click();
});
