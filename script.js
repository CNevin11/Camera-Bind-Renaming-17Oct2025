
document.getElementById("processButton").addEventListener("click", async () => {
  const csvFile = document.getElementById("csvFile").files[0];
  const imageFiles = document.getElementById("imageFiles").files;

  if (!csvFile || imageFiles.length === 0) {
    alert("Please upload both the CSV and JPEG files.");
    return;
  }

  const csvText = await csvFile.text();
  const frameMap = new Map();

  // Parse CSV and build frame to camera name map
  csvText.split("\n").forEach(line => {
    const [cameraName, frameStr] = line.trim().split(",");
    if (cameraName && frameStr) {
      const cleanCamera = cameraName.split(".")[0].trim();
      const frameNum = frameStr.trim().replace(/^0+/, "") || "0";
      frameMap.set(frameNum, cleanCamera);
    }
  });

  const zip = new JSZip();

  Array.from(imageFiles).forEach(file => {
    const match = file.name.match(/(\d+)\.jpe?g$/i);
    if (!match) return;

    const frame = match[1].replace(/^0+/, "") || "0";
    const newName = frameMap.get(frame);

    if (newName) {
      zip.file(`${newName}.jpg`, file);
    }
  });

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "renamed_images.zip";
  a.click();
});
