
document.getElementById('processBtn').addEventListener('click', async () => {
    const csvFile = document.getElementById('csvInput').files[0];
    const imageFiles = document.getElementById('imageInput').files;

    if (!csvFile || imageFiles.length === 0) {
        alert("Please upload both a CSV and JPEG files.");
        return;
    }

    const csvText = await csvFile.text();
    const csvLines = csvText.trim().split('\n');
    const map = {};

    for (let i = 0; i < csvLines.length; i++) {
        const [frameRaw, cameraRaw] = csvLines[i].split(',').map(s => s.trim());
        const frame = String(parseInt(frameRaw, 10));
        const camera = cameraRaw.replace(/\.[0-9]+$/, '');
        map[frame] = camera;
    }

    const zip = new JSZip();
    const skipped = [];

    for (const file of imageFiles) {
        const match = file.name.match(/(\d+)\.jpe?g$/i);
        if (!match) continue;

        const frameKey = String(parseInt(match[1].replace(/^0+/, ''), 10));
        const cameraName = map[frameKey];

        if (cameraName) {
            const blob = await file.arrayBuffer();
            zip.file(cameraName + ".jpeg", blob);
        } else {
            skipped.push(`${file.name} → Frame: ${frameKey} → No match found`);
        }
    }

    const content = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = "renamed_images.zip";
    a.click();

    document.getElementById('log').textContent = `✅ Processed ${imageFiles.length - skipped.length} of ${imageFiles.length} files.`;
    const skippedPanel = document.getElementById('skippedPanel');
    const skippedList = document.getElementById('skippedList');
    if (skipped.length > 0) {
        skippedPanel.classList.remove('hidden');
        skippedList.textContent = skipped.join('\n');
    } else {
        skippedPanel.classList.add('hidden');
        skippedList.textContent = '';
    }
});
