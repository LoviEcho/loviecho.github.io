document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('gallery');
    const imagesFolder = 'images/';
    const imageCount = 10; // Ganti dengan jumlah gambar dalam folder

    let images = [];
    for (let i = 1; i <= imageCount; i++) {
        images.push(`${imagesFolder}${i}.jpg`); // Sesuaikan dengan format nama gambar
    }

    shuffleArray(images);

    images.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        gallery.appendChild(img);
    });
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
