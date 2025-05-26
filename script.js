function generateCode() {
    // Get input values
    const config = {
        eventName: document.getElementById('eventName').value || 'ASAT X TAHFIDZ',
        startTime: document.getElementById('startTime').value,
        duration: document.getElementById('duration').value * 60,
        formUrl: document.getElementById('formUrl').value,
        warningTime: document.getElementById('warningTime').value * 60
    };

    // Generate timestamp in correct format
    const startDate = new Date(config.startTime);
    const isoDate = startDate.toISOString().replace('Z','+07:00');
    
    // Generate the code
    const htmlCode = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${config.eventName}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <style>
        /* CSS dari template asli */
        body { margin: 0; font-family: Arial, sans-serif; background: #f8f8f8; }
        #timer { background-color: #FF5403; color: white; padding: 10px 20px; 
                 border-radius: 0 0 10px 10px; display: flex; justify-content: space-between; }
        /* ... (tambahkan semua CSS asli di sini) ... */
    </style>
</head>
<body>
    <audio id="warning-sound" src="https://www.soundjay.com/buttons/sounds/beep-07.mp3" preload="auto"></audio>

    <div id="timer">
        <div class="info-section"><i class="fa fa-book"></i> ${config.eventName}</div>
        <div class="info-section"><i class="fa fa-calendar"></i> Mulai: <span id="start-date"></span></div>
        <div class="info-section"><i class="fa fa-clock-o"></i> Timer: <span id="time">--:--</span></div>
    </div>

    <div id="not-ready">Menghubungkan ke server waktu...</div>

    <div id="form">
        <iframe src="${config.formUrl}?embedded=true" allowfullscreen>LOADING</iframe>
    </div>

    <script>
        const waktuMulaiResmi = new Date("${isoDate}");
        const durasiUjian = ${config.duration};
        const maxTampil = durasiUjian + 60 * 5;
        const peringatanDetik = ${config.warningTime};
        
        // ... (masukkan semua script asli di sini) ...
    </script>
</body>
</html>`;

    // Tampilkan output
    const output = document.getElementById('output');
    const codePre = document.getElementById('generatedCode');
    codePre.textContent = htmlCode;
    output.classList.remove('hidden');
    
    // Hilangkan indentasi berlebihan
    codePre.innerHTML = htmlCode.replace(/^ {8}/gm, '');
}
