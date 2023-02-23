const express = require('express')
const cors = require('cors')
const { default: mongoose } = require('mongoose')
const { google } = require('googleapis')
const multerGoogleDrive = require('multer-google-drive')
const multer = require('multer')
const methodOverride = require('method-override')
require('dotenv').config()
const path = require('path')
const bodyParser = require('body-parser')


const app = express()
const PORT = process.env.PORT || 8000

// Schema
const File = require('./schemas/fileSchema')

app.use(express.json())
app.use(cors())
app.use(bodyParser.json())
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true }))


mongoose.set('strictQuery', false)
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('database Connected'))
  .catch(err => console.log('database not connected'))
const conn = mongoose.createConnection(process.env.MONGODB_URI)

app.get('/', (req, res) => {
  res.send('Hello From Server')
})

const auth = new google.auth.GoogleAuth({
  keyFile: './googleapi.json',
  scopes: ['https://www.googleapis.com/auth/drive']
})

const drive = google.drive({
  version: 'v3',
  auth
})

const storage = multerGoogleDrive({
  drive,
  folderId: process.env.folderId,
  parents: process.env.folderId,
})

const upload = multer({
  storage,
  limits: {
    fileSize: 1000000000000000
  },
  fileFilter (req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png|pdf|doc|docx|xlsx|xls)$/)) {
      return cb(
        new Error(
          'only upload files with jpg, jpeg, png, pdf, doc, docx, xslx, xls format.'
        )
      )
    }
    cb(undefined, true) // continue with upload
  }
})

// Upload Files
app.post(
  '/upload',
  upload.single('file'),
  async (req, res) => {
    const {  mimetype } = req.file
    const pathfile = req.file.path

    const title = req.body.title
    const subject = req.body.subject
    const semester = req.body.semester
    const unit = req.body.unit
    const worksheet_number = req.body.worksheet_number
    const file_category = req.body.file_category
    let fileDownload_link = '**';

    await new Promise((resolve, reject) => {
      drive.files.list({ q: `name='${req.file.originalname}'` }, (err, res) => {
        if (err) reject(err)
        const files = res.data.files
        if (!files.length) {
          console.log(`No file with name '${req.file.originalname}' found.`)
          reject(new Error(`No file with name '${req.file.originalname}' found.`))
        } else {
          drive.files.get({
            fileId: files[0].id,
            fields: 'webContentLink'
          }, (err, res) => {
            if (err) reject(err)
            const fileLink = res.data.webContentLink
            fileDownload_link = fileLink
            resolve()
          })
        }
      })
    })
    

    const file = new File({
      title,
      subject,
      semester,
      unit,
      worksheet_number,
      file_category,
      link:fileDownload_link,
      file_path:process.env.drivePath,
      file_mimetype: mimetype
    })

    await file.save()
    res.send('file uploaded successfully.')
  },
  (error, req, res, next) => {
    if (error) {
      res.status(500).send(error.message)
    }
  }
)

// Get Files
app.get('/getAllFiles', async (req, res) => {
  try {
    const files = await File.find({})
    const sortedByCreationDate = files.sort((a, b) => b.createdAt - a.createdAt)
    res.status(200).send(sortedByCreationDate)
  } catch (error) {
    res.status(400).send('Error while getting list of files. Try again later.')
  }
})

app.listen(PORT, () => {
    console.log(`Server connected on ${PORT}`)
  })
  