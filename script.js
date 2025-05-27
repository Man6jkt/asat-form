async function generateCode() {
    const config = {
        eventName: document.getElementById('eventName').value.trim() || 'ASAT X TAHFIDZ',
        startTime: document.getElementById('startTime').value,
        duration: parseInt(document.getElementById('duration').value) * 60 || 5400,
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

    // Konversi waktu lokal ke format ISO +07:00 (WIB)
    const [datePart, timePart] = config.startTime.split('T');
    const isoDate = `${datePart}T${timePart}:00+07:00`;

    // Ambil template
    let template;
    try {
        const response = await fetch('template.html');
        template = await response.text();
    } catch (error) {
        template = await loadFallbackTemplate();
    }

    // Replace placeholder
    const htmlCode = template
        .replace(/{{EVENT_NAME}}/g, config.eventName)
        .replace(/{{START_TIME}}/g, isoDate)
        .replace(/{{DURATION}}/g, config.duration)
        .replace(/{{FORM_URL}}/g, config.formUrl)
        .replace(/{{WARNING_TIME}}/g, config.warningTime)
        .replace(/^ {4}/gm, '');

    // Tampilkan output
    const output = document.getElementById('output');
    const codePre = document.getElementById('generatedCode');

    codePre.textContent = htmlCode;
    output.classList.remove('hidden');

    // Tombol salin
    const copyBtn = document.getElementById('copyButton');
    copyBtn.addEventListener('click', copyCode);

    output.scrollIntoView({ behavior: 'smooth' });
}

async function copyCode() {
    const code = document.getElementById('generatedCode').textContent;
    const btn = document.getElementById('copyButton');
    const status = document.getElementById('copyStatus');

    try {
        await navigator.clipboard.writeText(code);

        btn.classList.add('success');
        btn.innerHTML = '<i class="fas fa-check"></i> Tersalin!';
        status.textContent = 'Kode berhasil disalin ke clipboard';

        setTimeout(() => {
            btn.classList.remove('success');
            btn.innerHTML = '<i class="far fa-copy"></i> Salin';
            status.textContent = '';
        }, 2000);

    } catch (err) {
        console.error('Gagal menyalin:', err);
        btn.classList.add('error');
        btn.innerHTML = '<i class="fas fa-times"></i> Gagal';
        status.textContent = 'Gagal menyalin. Salin manual dari teks di atas.';

        setTimeout(() => {
            btn.classList.remove('error');
            btn.innerHTML = '<i class="far fa-copy"></i> Salin';
            status.textContent = '';
        }, 3000);
    }
}

// Tampilkan waktu lokal di input saat halaman dimuat
window.onload = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now - offset).toISOString().slice(0, 16);

    const timeInput = document.getElementById('startTime');
    timeInput.value = localISOTime;
    timeInput.min = localISOTime;
};

// Placeholder fallback template
async function loadFallbackTemplate() {
    return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{{EVENT_NAME}}</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
  <style>
    /* CSS DEFAULT */
  </style>
</head>
<body>
  <!-- TEMPLATE DEFAULT -->
</body>
</html>`;
}
