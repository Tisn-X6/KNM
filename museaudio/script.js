let currentAudio = null;
let currentBtn = null;

function togglePlay(button, audioId) {
    const audio = document.getElementById(audioId);
    const icon = button.querySelector('i');
    
    // 1. Nếu đang có bài khác hát, tắt nó đi
    if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
        currentAudio.currentTime = 0; // Tua về đầu
        // Đổi icon bài cũ về Play
        if (currentBtn) {
            currentBtn.querySelector('i').className = 'fas fa-play';
            // Reset thanh tiến trình bài cũ
            updateProgressBar(currentAudio, 0); 
        }
    }

    // 2. Xử lý bài hiện tại
    if (audio.paused) {
        audio.play();
        icon.className = 'fas fa-pause'; // Đổi icon thành Pause
        
        currentAudio = audio;
        currentBtn = button;
    } else {
        audio.pause();
        icon.className = 'fas fa-play'; // Đổi icon về Play
    }

    // 3. Cập nhật thanh tiến trình liên tục
    audio.ontimeupdate = () => {
        const percentage = (audio.currentTime / audio.duration) * 100;
        updateProgressBar(audio, percentage);
        
        // Cập nhật thời gian chạy (0:00)
        updateTimeDisplay(button, audio.currentTime);
        
        // Khi hết bài
        if (audio.ended) {
            icon.className = 'fas fa-play';
            updateProgressBar(audio, 0);
        }
    };
}

// Hàm cập nhật thanh màu trắng
function updateProgressBar(audioElement, percentage) {
    // Tìm cái thanh progress nằm cùng cấp với thẻ audio
    const cardContent = audioElement.parentElement;
    const progressBar = cardContent.querySelector('.progress-fill');
    if(progressBar) {
        progressBar.style.width = percentage + '%';
    }
}

// Hàm hiển thị số phút:giây
function updateTimeDisplay(button, currentTime) {
    const parent = button.parentElement;
    const timeDisplay = parent.querySelector('.time.current');
    
    const minutes = Math.floor(currentTime / 60);
    const seconds = Math.floor(currentTime % 60);
    const formattedTime = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    
    if(timeDisplay) {
        timeDisplay.textContent = formattedTime;
    }
}