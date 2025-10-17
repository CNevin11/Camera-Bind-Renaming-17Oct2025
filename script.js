
document.getElementById('process').addEventListener('click', async () => {
    const csvFile = document.getElementById('csvFile').files[0];
    const imageFiles = document.getElementById('jpegFiles').files;

    if (!csvFile || imageFiles.length === 0) {
        alert("Please upload both a CSV and JPEG files.");
        return;
    }

    const text = await csvFile.text();
    const lines = text.trim().split('\n');
    const map = {};

    for (let i = 1; i < lines.length; i++) {
        const [frame, camera] = lines[i].split(',').map(s => s.trim());
        if (!isNaN(frame)) {
            map[parseInt(frame, 10)] = camera.replace(/\.\d+$/, '');
        }
    }

    const zip = new JSZip();
    const skipped = [];

    for (const file of imageFiles) {
        const match = file.name.match(/(\d+)\.jpe?g$/i);
        if (!match) continue;

        const frameNum = parseInt(match[1].replace(/^0+/, ''), 10); // Strip leading 0s
        const cameraName = map[frameNum];

        if (cameraName) {
            const blob = await file.arrayBuffer();
            zip.file(cameraName + ".jpeg", blob);
        } else {
            skipped.push(`${file.name} → Frame: ${frameNum} → No match found`);
        }
    }

    const content = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = "renamed_images.zip";
    a.click();

    document.getElementById('processed').textContent = `Processed ${imageFiles.length - skipped.length} files.`;
    const skippedList = document.getElementById('skipped');
    skippedList.innerHTML = '';
    skipped.forEach(msg => {
        const li = document.createElement('li');
        li.textContent = msg;
        skippedList.appendChild(li);
    });
});
