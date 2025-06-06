document.addEventListener('DOMContentLoaded', function() {
  const videoUrlInput = document.getElementById('videoUrl');
  const fileNameInput = document.getElementById('fileName');
  const downloadBtn = document.getElementById('downloadBtn');
  const statusDiv = document.getElementById('status');
  const form = document.getElementById('converterForm');
  
  function validateInputs() {
    const urlValue = videoUrlInput.value.trim();
    const fileNameValue = fileNameInput.value.trim();
    
    const isValidUrl = urlValue && (
      urlValue.includes('twitter.com/') || 
      urlValue.includes('x.com/')
    );
    
    const isValidFileName = fileNameValue && /^[a-zA-Z0-9-_]+$/.test(fileNameValue);
    
    downloadBtn.disabled = !(isValidUrl && isValidFileName);
  }
  
  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
    
    if (type === 'loading') {
      statusDiv.innerHTML = message + '<span class="loader"></span>';
    }
    
    if (type !== 'loading') {
      setTimeout(() => {
        statusDiv.style.display = 'none';
      }, 5000);
    }
  }
  
  videoUrlInput.addEventListener('input', validateInputs);
  fileNameInput.addEventListener('input', validateInputs);
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const videoUrl = videoUrlInput.value.trim();
    const fileName = fileNameInput.value.trim();
    
    if (!videoUrl || !fileName) {
      showStatus('Please fill in all fields', 'error');
      return;
    }
    
    showStatus('Processing video...', 'loading');
    downloadBtn.disabled = true;
    
    try {
      const response = await browser.runtime.sendMessage({
        action: 'convertToGif',
        videoUrl: videoUrl,
        fileName: fileName
      });
      
      if (response.success) {
        showStatus('GIF downloaded successfully!', 'success');
        videoUrlInput.value = '';
        fileNameInput.value = '';
      } else {
        showStatus(response.error || 'Failed to convert video', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showStatus('An error occurred while processing the video', 'error');
    } finally {
      downloadBtn.disabled = false;
      validateInputs();
    }
  });
  
  videoUrlInput.focus();
});