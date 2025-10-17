async function processFiles() {
    alert("Button clicked! Starting processing...");
    const status = document.getElementById("status");
    const skippedList = document.getElementById("skippedList");
    status.textContent = "";
    skippedList.innerHTML = "";

    const csvInput = document.getElementById("csvFile");
    const imageInput = document.getElementById("jpegFiles");

    if (!csvInput.files[0] || imageInput.files.length === 0) {
        alert("Please upload both a CSV and JPEG images.");
        return;
    }

    const csvText = await csvInput.files[0].text();
    const lines = csvText.trim().split(/\r?\n/);
    const map = {};

    for (let i = 1; i < lines.length; i++) {
        const [frame, cameraName] = lines[i].split(",").map(x => x.trim());
        const frameNum = parseInt(frame, 10);
        const cleanName = cameraName.split(".")[0];
        map[frameNum] = cleanName;
    }

    const zip = new JSZip();
    let processed = 0;
    let skipped = 0;

    for (const file of imageInput.files) {
        const match = file.name.match(/(\d+)/);
        if (!match) continue;

        const frameNum = parseInt(match[1], 10);
        const cameraName = map[frameNum];

        if (!cameraName) {
            const li = document.createElement("li");
            li.textContent = `${file.name} → Frame: ${frameNum} → No match found`;
            skippedList.appendChild(li);
            skipped++;
            continue;
        }

        const blob = await file.arrayBuffer();
        zip.file(`${cameraName}.jpeg`, blob);
        processed++;
    }

    status.textContent = `Processed ${processed} file(s). Skipped ${skipped}.`;

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "renamed_images.zip";
    a.click();
}