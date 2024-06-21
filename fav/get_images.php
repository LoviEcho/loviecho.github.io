<?php
// Path ke folder yang ingin Anda tampilkan isinya
$folderPath = './folder_gambar_anda/';

// Mendapatkan daftar file dalam folder
$files = scandir($folderPath);

// Menghilangkan . dan .. dari daftar
$files = array_diff($files, array('.', '..'));

// Filter hanya file gambar (boleh disesuaikan dengan ekstensi yang diinginkan)
$imageExtensions = array("jpg", "jpeg", "png", "gif");
$images = array_filter($files, function($file) use ($imageExtensions) {
    $fileExtension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    return in_array($fileExtension, $imageExtensions);
});

// Mengirimkan daftar file gambar dalam format JSON
header('Content-Type: application/json');
echo json_encode(array_values($images));
?>
