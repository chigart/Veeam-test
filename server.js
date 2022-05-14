const express = require('express')
const app = express()
const port = 5000
const cors = require('cors')
const multer = require('multer')
const sharp = require('sharp')
sharp.cache(false);
const bodyParser = require('body-parser')
const fs = require('fs')
const sizeOf = require('image-size');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public')
	},
	filename: function(req, file, cb) {
		cb(null, 'uploadedFile.jpg')
	},
})

const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 } })

const uploadedFile = 'public/uploadedFile.jpg';
const uploadedFileResized = 'public/uploadedFileResized.jpg';

app.get('/info', function (req, res) {
	if (fs.existsSync(uploadedFile)) {
		const dimensions = sizeOf(uploadedFile);
		res.send({ width: dimensions.width, height: dimensions.height });
	}
	else {
		res.send(undefined);
	}
})

app.post('/upload', upload.single('file'), function (req, res) {
	const dimensions = sizeOf(uploadedFile);
	res.send({ width: dimensions.width, height: dimensions.height });
})

app.delete('/delete', function (req, res) {
	if (fs.existsSync(uploadedFileResized)) {
		fs.unlinkSync(uploadedFileResized);
	}
	if (fs.existsSync(uploadedFile)) {
		fs.unlinkSync(uploadedFile);
	}
	res.send('Image deleted');
})

app.post('/resize', function (req, res) {
	if (fs.existsSync(uploadedFileResized)) {
		fs.unlinkSync(uploadedFileResized);
	}
	if (fs.existsSync(uploadedFile)) {
		sharp(uploadedFile).resize(req.body.width, req.body.height).toFile('public/uploadedFileResized.jpg');
	}
	res.send('Preview created');
})

app.listen(port, () => {
	console.log(`listening at http://localhost:${port}`)
})
