// Payment JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Payment modal functionality
    const modal = document.getElementById('wamd-modal');
    const modalFileInput = document.getElementById('modal-file-input');
    const modalUploadArea = document.getElementById('modal-upload-area');

    // Modal file upload
    if (modalUploadArea) {
        modalUploadArea.addEventListener('click', function() {
            modalFileInput.click();
        });

        modalUploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });

        modalUploadArea.addEventListener('dragleave', function() {
            this.classList.remove('dragover');
        });

        modalUploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            handleModalFile(e.dataTransfer.files[0]);
        });

        modalFileInput.addEventListener('change', function() {
            handleModalFile(this.files[0]);
        });
    }

    function handleModalFile(file) {
        if (!file || !file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            localStorage.setItem('paymentScreenshot', e.target.result);
            document.getElementById('modal-preview-img').src = e.target.result;
            document.getElementById('modal-upload-area').style.display = 'none';
            document.getElementById('modal-preview').style.display = 'flex';
        };
        reader.readAsDataURL(file);
    }

    // Modal remove image
    const modalRemoveImage = document.getElementById('modal-remove-image');
    if (modalRemoveImage) {
        modalRemoveImage.addEventListener('click', function(e) {
            e.stopPropagation();
            localStorage.removeItem('paymentScreenshot');
            document.getElementById('modal-preview-img').src = '';
            document.getElementById('modal-upload-area').style.display = 'flex';
            document.getElementById('modal-preview').style.display = 'none';
            modalFileInput.value = '';
        });
    }

    // Check for existing screenshot on load
    const existingScreenshot = localStorage.getItem('paymentScreenshot');
    if (existingScreenshot) {
        const preview = document.getElementById('upload-preview');
        const placeholder = document.getElementById('upload-placeholder');
        if (preview && placeholder) {
            document.getElementById('preview-image').src = existingScreenshot;
            placeholder.style.display = 'none';
            preview.style.display = 'flex';
        }
    }
});
