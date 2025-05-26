async function generateCode() {
    // Ambil nilai input
    const config = {
        eventName: document.getElementById('eventName').value.trim() || 'ASAT X TAHFIDZ',
        startTime: document.getElementById('startTime').value,
        duration: parseInt(document.getElementById('duration').value) * 60 || 5400, // Default 90 menit
        formUrl: document.getElementById('formUrl').value.trim(),
        warningTime: (parseInt(document.getElementById('warningTime').value) || 5) * 60
    };

    // Validasi input
    if (!config.startTime) {
        alert('Waktu mulai harus diisi!');
        return;
    }
    
    try {
        new URL(config.formUrl);
    } catch {
        alert('URL Google Form tidak valid!');
        return;
    }

    // Format waktu mulai
    const isoDate = `${config.startTime.replace('T', ' ')}:00+07:00`;
    
    // Ambil template
    let template;
    try {
        const response = await fetch('template.html');
        template = await response.text();
    } catch (error) {
        // Fallback template jika gagal load
        template = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{{EVENT_NAME}}</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
  <style>/* CSS DEFAULT */</style>
</head>
<body>
  <!-- TEMPLATE DEFAULT -->
</body>
</html>`;
    }

    // Replace placeholder
    const htmlCode = template
        .replace(/{{EVENT_NAME}}/g, config.eventName)
        .replace(/{{START_TIME}}/g, isoDate)
        .replace(/{{DURATION}}/g, config.duration)
        .replace(/{{FORM_URL}}/g, encodeURI(config.formUrl))
        .replace(/{{WARNING_TIME}}/g, config.warningTime)
        .replace(/^ {4}/gm, ''); // Hapus indentasi berlebihan

    // Tampilkan output
    const output = document.getElementById('output');
    const codePre = document.getElementById('generatedCode');
    
    codePre.textContent = htmlCode;
    output.classList.remove('hidden');

    // Scroll ke hasil
    output.scrollIntoView({ behavior: 'smooth' });
}

// Event listener untuk input waktu
document.getElementById('startTime').addEventListener('change', function() {
    const localDate = new Date(this.value);
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta'
    };
    
    // Preview waktu WIB
    const warnInfo = document.getElementById('not-ready');
    warnInfo.textContent = `Waktu yang akan digunakan: ${localDate.toLocaleDateString('id-ID', options)} WIB`;
});

// Auto-fill waktu sekarang sebagai contoh
window.onload = () => {
    const now = new Date();
    const timeInput = document.getElementById('startTime');
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now - offset).toISOString().slice(0, 16);
    
    timeInput.value = localISOTime;
    timeInput.min = localISOTime;
};
