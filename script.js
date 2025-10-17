
function processFiles() {
  const csvFile = document.getElementById('csvFile').files[0];
  const jpgFiles = Array.from(document.getElementById('jpgFiles').files);

  if (!csvFile || jpgFiles.length === 0) {
    alert("Please upload both a CSV file and JPEG images.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const csvData = event.target.result;
    const lines = csvData.split(/\r?\n/);
    const header = lines[0].split(',');
    const frameIndex = header.findIndex(h => h.toLowerCase().includes('frame'));
    const nameIndex = header.findIndex(h => h.toLowerCase().includes('camera_name'));
    if (frameIndex === -1 || nameIndex === -1) {
      alert("CSV must have headers including 'Frame' and 'Camera_Name'");
      return;
    }

    const mapping = {};
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',');
      const frame = cols[frameIndex].trim().replace(/^0+/, '');  // remove leading 0s
      const camName = cols[nameIndex].trim().split('.')[0];      // clean name
      if (frame && camName) mapping[frame] = camName;
    }

    const zip = new JSZip();
    const missing = [];
    jpgFiles.forEach(file => {
      const match = file.name.match(/(\d+)/);
      if (match) {
        const frameNum = match[1].replace(/^0+/, '');
        const newName = mapping[frameNum];
        if (newName) {
          zip.file(newName + ".jpg", file);
        } else {
          missing.push(frameNum);
        }
      }
    });

    // Show missing
    const box = document.getElementById("missingFramesBox");
    const list = document.getElementById("missingFrames");
    list.innerHTML = "";
    if (missing.length > 0) {
      box.classList.remove("hidden");
      missing.forEach(f => {
        const li = document.createElement("li");
        li.textContent = f;
        list.appendChild(li);
      });
    } else {
      box.classList.add("hidden");
    }

    zip.generateAsync({ type: "blob" }).then(content => {
      saveAs(content, "renamed_images.zip");
    });
  };

  reader.readAsText(csvFile);
}
