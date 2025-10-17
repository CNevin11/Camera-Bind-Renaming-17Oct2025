
async function readCSV(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = event => {
      const lines = event.target.result.split(/\r?\n/).filter(Boolean);
      const mapping = {};
      lines.forEach(row => {
        const [frame, camera] = row.split(',');
        if (frame && camera) mapping[parseInt(frame).toString()] = camera.trim().split('.')[0];
      });
      resolve(mapping);
    };
    reader.onerror = () => reject("Failed to read CSV.");
    reader.readAsText(file);
  });
}

function extractFrameNumber(filename) {
  const base = filename.split('.')[0].replace(/^0+/, '');
  return parseInt(base || '0').toString();
}

async function processImages(csvMap, imageFiles) {
  const JSZip = window.JSZip;
  const zip = new JSZip();
  const skipped = [];

  for (const file of imageFiles) {
    const frame = extractFrameNumber(file.name);
    const cameraName = csvMap[frame];
    if (cameraName) {
      const blob = await file.arrayBuffer();
      zip.file(cameraName + ".jpeg", blob);
    } else {
      skipped.push(file.name);
    }
  }

  return zip.generateAsync({ type: "blob" }).then(content => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = "Renamed_Cameras.zip";
    a.click();
    return skipped;
  });
}

document.getElementById("processBtn").onclick = async () => {
  const csvFile = document.getElementById("csvInput").files[0];
  const images = Array.from(document.getElementById("imgInput").files);
  const output = document.getElementById("output");
  output.innerHTML = "";

  if (!csvFile || images.length === 0) {
    output.textContent = "⚠️ Please upload both a CSV and JPEG files.";
    return;
  }

  const csvMap = await readCSV(csvFile);
  const skipped = await processImages(csvMap, images);

  if (skipped.length > 0) {
    output.innerHTML = "<b>Skipped Files:</b><br>" + skipped.map(f => "- " + f).join("<br>");
  } else {
    output.textContent = "✅ All files renamed and downloaded!";
  }
};
