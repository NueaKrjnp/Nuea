document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('letter-form');
  const themeOptions = document.querySelectorAll('.theme-option');
  const linkResult = document.getElementById('link-result');
  const generatedLinkInput = document.getElementById('generated-link');
  const copyBtn = document.getElementById('copy-btn');
  const previewBtn = document.getElementById('preview-btn');

  const editorSection = document.getElementById('editor-section');
  const viewerSection = document.getElementById('viewer-section');
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const envelope = document.getElementById('envelope');
  const waxSeal = document.getElementById('wax-seal');
  const letterPaper = document.getElementById('letter-paper');

  const viewRecipient = document.getElementById('view-recipient');
  const viewSender = document.getElementById('view-sender');
  const viewMessage = document.getElementById('view-message');
  const viewImageContainer = document.getElementById('view-image-container');
  const viewImage = document.getElementById('view-image');
  const btnBackEditor = document.getElementById('btn-back-editor');

  let currentLetterData = null;

  // 1. เลือก Theme UI
  themeOptions.forEach(option => {
    option.addEventListener('click', () => {
      themeOptions.forEach(opt => opt.classList.remove('active'));
      option.classList.add('active');
      option.querySelector('input').checked = true;
    });
  });

  // 2. Submit Form -> เข้ารหัสข้อมูลเป็น Link
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
      from: document.getElementById('sender-name').value,
      to: document.getElementById('recipient-name').value,
      msg: document.getElementById('letter-message').value,
      img: document.getElementById('image-url').value,
      theme: document.querySelector('input[name="paper-theme"]:checked').value
    };

    const encodedData = btoa(encodeURIComponent(JSON.stringify(data)));
    const shareableUrl = `${window.location.origin}${window.location.pathname}?data=${encodedData}`;

    generatedLinkInput.value = shareableUrl;
    currentLetterData = data;
    
    linkResult.classList.remove('hidden');
  });

  // 3. คัดลอกลิงก์
  copyBtn.addEventListener('click', () => {
    generatedLinkInput.select();
    navigator.clipboard.writeText(generatedLinkInput.value);
    copyBtn.textContent = 'คัดลอกแล้ว! ✨';
    setTimeout(() => copyBtn.textContent = 'คัดลอก', 2000);
  });

  // 4. เช็ค URL Parameter สำหรับคนกดลิงก์เข้ามาดู
  const urlParams = new URLSearchParams(window.location.search);
  const dataParam = urlParams.get('data');

  if (dataParam) {
    try {
      const decodedData = JSON.parse(decodeURIComponent(atob(dataParam)));
      loadLetterView(decodedData);
    } catch (e) {
      console.error('Data parsing error:', e);
    }
  }

  // Preview Button Event
  previewBtn.addEventListener('click', () => {
    if (currentLetterData) {
      loadLetterView(currentLetterData);
    }
  });

  // 5. โหลดข้อมูลใส่กระดาษจดหมาย
  function loadLetterView(data) {
    editorSection.classList.add('hidden');
    viewerSection.classList.remove('hidden');

    viewRecipient.textContent = data.to;
    viewSender.textContent = data.from;
    viewMessage.textContent = data.msg;

    if (data.img && data.img.trim() !== '') {
      viewImage.src = data.img;
      viewImageContainer.classList.remove('hidden');
    } else {
      viewImageContainer.classList.add('hidden');
    }

    letterPaper.className = 'letter-paper hidden';
    if (data.theme === 'theme-rose') {
      letterPaper.classList.add('theme-rose-paper');
    } else if (data.theme === 'theme-midnight') {
      letterPaper.classList.add('theme-midnight-paper');
    } else {
      letterPaper.classList.add('theme-classic-paper');
    }
  }

  // 6. แอนิเมชันเปิดจดหมาย
  waxSeal.addEventListener('click', () => {
    envelope.classList.add('open');

    setTimeout(() => {
      envelopeWrapper.classList.add('hidden');
      letterPaper.classList.remove('hidden');
    }, 700);
  });

  // 7. ปุ่มเขียนจดหมายใหม่
  btnBackEditor.addEventListener('click', () => {
    window.history.pushState({}, document.title, window.location.pathname);
    
    envelope.classList.remove('open');
    envelopeWrapper.classList.remove('hidden');
    letterPaper.classList.add('hidden');
    viewerSection.classList.add('hidden');
    editorSection.classList.remove('hidden');
  });
});
