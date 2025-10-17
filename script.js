document.getElementById("processBtn").addEventListener("click", async () => {
  const csvFile = document.getElementById("csvFile").files[0];
  const imageFiles = [...document.getElementById("imageFiles").files];
  if (!csvFile || imageFiles.length === 0) return alert("Upload both CSV and JPEGs");

  const csvText = await csvFile.text();
  const rows = csvText.trim().split("\n").slice(1);
  const mapping = {};
  for (let row of rows) {
    const [frame, name] = row.split(",");
    mapping[parseInt(frame.trim(), 10)] = name.trim();
  }

  const zip = new JSZip();
  const missingFrames = [];

  for (const file of imageFiles) {
    const match = file.name.match(/(\d+)/);
    if (!match) continue;
    const frameNumber = parseInt(match[1], 10);
    const cameraName = mapping[frameNumber];
    if (cameraName) {
      zip.file(`${cameraName}.jpg`, file);
    } else {
      missingFrames.push(match[1]);
    }
  }

  const missingSection = document.getElementById("missingFramesSection");
  const missingList = document.getElementById("missingFramesList");
  if (missingFrames.length > 0) {
    missingList.innerHTML = missingFrames.map(f => `<li>${f}</li>`).join("");
    missingSection.classList.remove("hidden");
  } else {
    missingList.innerHTML = "";
    missingSection.classList.add("hidden");
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "renamed_images.zip";
  a.click();
});
