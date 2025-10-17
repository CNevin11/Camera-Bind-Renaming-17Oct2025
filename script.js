async function processFiles() {
  const csvInput = document.getElementById("csvFile").files[0];
  const imageFiles = Array.from(document.getElementById("imageFiles").files);

  if (!csvInput || imageFiles.length === 0) {
    alert("Please upload both CSV and JPEG files.");
    return;
  }

  const csvText = await csvInput.text();
  const lines = csvText.trim().split(/\r?\n/);
  const headers = lines[0].split(",");
  const frameIndex = headers.indexOf("Frame");
  const cameraNameIndex = headers.indexOf("Camera_Name");

  if (frameIndex === -1 || cameraNameIndex === -1) {
    alert("CSV must contain 'Frame' and 'Camera_Name' columns.");
    return;
  }

  const mapping = {};
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(",");
    const frame = row[frameIndex].padStart(3, "0").replace(/^0+(?!$)/, "");
    const cameraName = row[cameraNameIndex].split(".")[0];
    mapping[frame] = cameraName;
  }

  const zip = new JSZip();
  const missingFrames = [];

  imageFiles.forEach(file => {
    const frameNumber = file.name.split(".")[0].replace(/^0+(?!$)/, "");
    const newName = mapping[frameNumber];
    if (newName) {
      zip.file(newName + ".jpg", file);
    } else {
      missingFrames.push(frameNumber);
    }
  });

  if (missingFrames.length > 0) {
    const missingContainer = document.getElementById("missingFramesContainer");
    const missingList = document.getElementById("missingFramesList");
    missingList.innerHTML = "";
    missingFrames.sort((a, b) => parseInt(a) - parseInt(b)).forEach(f => {
      const li = document.createElement("li");
      li.textContent = f;
      missingList.appendChild(li);
    });
    missingContainer.classList.remove("hidden");
  } else {
    document.getElementById("missingFramesContainer").classList.add("hidden");
  }

  if (Object.keys(zip.files).length > 0) {
    const content = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = "renamed_images.zip";
    a.click();
  }
}