const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware для обработки JSON и multipart/form-data
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Хранилище для загрузки изображений
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'server/images/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

// Получение списка изображений
app.get('/api/images', (req, res) => {
  fs.readdir(path.join(__dirname, 'images'), (err, files) => {
    if (err) return res.status(500).send('Ошибка чтения файлов');
    res.json(files);
  });
});

// Загрузка нового изображения
app.post('/api/upload', upload.single('image'), (req, res) => {
  res.send('Изображение успешно загружено');
});

// Удаление изображения
app.delete('/api/delete/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'images', req.params.filename);
  fs.unlink(filePath, err => {
    if (err) return res.status(500).send('Ошибка удаления файла');
    res.send('Изображение успешно удалено');
  });
});

// Страница администратора
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});