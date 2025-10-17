document.getElementById('processBtn').addEventListener('click', () => {
  const csvFile = document.getElementById('csvInput').files[0];
  const images = Array.from(document.getElementById('imageInput').files);
  const skippedPanel = document.getElementById('skippedPanel');
  const skippedList = document.getElementById('skippedList');
  const log = document.getElementById('log');

  if (!csvFile || images.length === 0) {
    alert('Please upload both a CSV file and image files.');
    return;
  }

  Papa.parse(csvFile, {
    complete: function(results) {
      const bindings = {};
      results.data.forEach(row => {
        let [frame, cameraId] = row;
        if (!frame || !cameraId) return;
        const cleanFrame = parseInt(frame.replace(/^0+/, ''));
        const cleanCameraId = cameraId.split('.')[0]; // Remove .001 etc.
        bindings[cleanFrame] = cleanCameraId;
      });

      const zip = new JSZip();
      const skipped = [];

      images.forEach(file => {
        const match = file.name.match(/(\d{1,6})/);
        if (!match) {
          skipped.push(`${file.name} → Frame: ??? → Not a number`);
          return;
        }

        const frameNumber = parseInt(match[1].replace(/^0+/, ''));
        const cameraId = bindings[frameNumber];

        if (!cameraId) {
          skipped.push(`${file.name} → Frame: ${frameNumber} → No match found`);
          return;
        }

        const fileExtension = '.jpeg';
        zip.file(`${cameraId}${fileExtension}`, file);
      });

      zip.generateAsync({ type: 'blob' }).then(content => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = 'renamed_images.zip';
        link.click();
      });

      if (skipped.length > 0) {
        skippedPanel.classList.remove('hidden');
        skippedList.textContent = skipped.join('\n');
      } else {
        skippedPanel.classList.add('hidden');
        skippedList.textContent = '';
      }

      log.innerHTML = `<strong>Processed ${images.length - skipped.length} files.</strong>`;
    }
  });
});