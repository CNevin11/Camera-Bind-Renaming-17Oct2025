
document.getElementById('processBtn').addEventListener('click', async function () {
    const csvFile = document.getElementById('csvFile').files[0];
    const imageFiles = document.getElementById('jpegFiles').files;

    if (!csvFile || imageFiles.length === 0) {
        alert('Please upload both CSV and JPEG files.');
        return;
    }

    const csvText = await csvFile.text();
    const rows = csvText.split('\n').slice(1);
    const frameMap = {};

    for (let row of rows) {
        const cols = row.split(',');
        if (cols.length < 2) continue;
        const frame = cols[0].trim();
        const cameraName = cols[1].trim().split('.')[0];
        const paddedFrame = frame.padStart(4, '0'); // Fix: pad frame numbers
        frameMap[paddedFrame] = cameraName;
    }

    const zip = new JSZip();
    let renamedCount = 0;

    for (let file of imageFiles) {
        const fileName = file.name.split('.')[0];
        const ext = file.name.split('.').pop();
        const newName = frameMap[fileName];
        if (newName) {
            zip.file(`${newName}.${ext}`, file);
            renamedCount++;
        }
    }

    if (renamedCount === 0) {
        alert('No matching files were found. Please check your frame numbers.');
        return;
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'renamed_images.zip';
    a.click();
    URL.revokeObjectURL(url);
});
