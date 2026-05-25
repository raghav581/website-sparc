/* eslint-env node */

const fs = require('fs')
const mime = require('mime')
const multer = require('multer')

const path = require('path')
const catalogImage = require('../utils/catalogImage')

// Local upload directory (must exist)
const UPLOAD_DIR = path.join(__dirname, '..', 'www', 'catalog', 'project')

// ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
	fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}
// -----

var Project = require('../models/project')

// Display list of all Projects.
exports.project_list = function(req, res) {
	Project.find({}).exec(function(err, list_projects) {
		if (err) {
			throw err
		}
		//Successful, so render
		res.render('gallery', {
			projects: list_projects
		})
		//res.send(list_projects);
	})
	//res.send('NOT IMPLEMENTED: Project list');
}

exports.project_edit = function(req, res) {
	res.render('edit-projects')
}

exports.project_list_api = function(req, res) {
	Project.find({}).exec(function(err, list_projects) {
		if (err) {
			throw err
		}
		res.send(list_projects)
	})
}

// Display detail page for a specific Project.
exports.project_detail = function(req, res) {
	Project.findById(req.params.id).exec(function(err, project) {
		if (err) {
			throw err
		}
		//Successful, so render
		//console.log(product)
		res.send(project)
		//res.send(list_products);
	})
}

// Handle Project create on POST.
exports.project_create_post = function(req, res) {
	// Create a Book object with escaped and trimmed data.
	var project = new Project(req.body)

	// var storage = multer.diskStorage({
	// 	destination: './uploads',
	// 	filename: function(req, file, cb) {
	// 		cb(null, project._id + '.' + mime.getExtension(file.mimetype))
	// 	}
	// })

	// var upload = multer({
	// 	storage: storage
	// }).any()

	// upload(req, res, function(err) {
	// 	if (err) {
	// 		throw err
	// 		//return res.end('Error uploading file.');
	// 	} else {
	// 		//console.log(req.body);
	// 		//console.log(req.files);

	// 		/* */
	// 		project.name = req.body.project_name
	// 		project.owner = req.body.project_owner
	// 		project.description = req.body.project_description
	// 		project.date = req.body.project_date
	// 		project.cost = req.body.project_cost
	// 		project.url = req.body.project_url
	// 		project.categories = req.body.project_categories

	// 		project.image.data = fs.readFileSync(req.files[0].path)
	// 		project.image.contentType = req.files[0].mimetype
	// 		//console.log(product);

	project.save(function(err) {
		if (err) {
			throw err
		}
		//successful - redirect to new book record.
		// res.redirect('/dashboard/projects')
		res.send(project)
	})
	// fs.unlink(req.files[0].path, function(err) {
	// 	if (err) {
	// 		throw err
	// 	}
	// })
	// //res.end("File has been uploaded");
	// /**/
	// }
	// })

	//res.send('NOT IMPLEMENTED: Project create POST');
}

// Handle Project delete on POST.
exports.project_delete_post = function(req, res) {
	Project.findById(req.params.id, function(err, data) {
		if (err) return res.status(500).send(err)

		// remove image files from local upload dir
		if (Array.isArray(data.images)) {
			data.images.forEach(image => {
				const filename = path.basename(image)
				const filePath = path.join(UPLOAD_DIR, filename)
				try {
					if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
				} catch (e) {
					console.error('Error deleting file', filePath, e)
				}
			})
		}

		Project.findByIdAndRemove(req.params.id, function(err) {
			if (err) return res.status(500).send(err)
			return res.send(true)
		})
	})

	// res.send('NOT IMPLEMENTED: Project delete POST');
}

// Handle Project update on POST.
exports.project_update_post = function(req, res) {
	// Create a Book object with escaped and trimmed data.
	var project = new Project(req.body)

	Project.findByIdAndUpdate(req.params.id, project, {}, function(err) {
		if (err) {
			throw err
		}
		//successful - redirect to new book record.
		// res.redirect('/dashboard/projects')
		res.send(project)
	})

	// var storage = multer.diskStorage({
	//     destination: './www/catalog/project',
	//     filename: function (req, file, cb) {

	//         cb(null, req.params.id + '.' + mime.getExtension(file.mimetype));
	//     }
	// });

	// var upload = multer({
	//     storage: storage
	// }).any();

	// upload(req, res, function (err) {
	//     if (err) {
	//         throw err;
	//         //return res.end('Error uploading file.');
	//     } else {
	//         //console.log(req.body);
	//         //console.log(req.files);

	//         project.name = req.body.project_name;
	//         project.owner = req.body.project_owner;
	//         project.description = req.body.project_description;
	//         project.date = req.body.project_date;
	//         project.cost = req.body.project_cost;
	//         project.url = req.body.project_url;
	//         project._id = req.params.id;
	//         project.categories = req.body.project_categories;
	//         project.imagetype = mime.getExtension(req.files[0].mimetype);
	//         //console.log(product);

	//         Project.findByIdAndUpdate(req.params.id, project, {}, function (err) {
	//             if (err) {
	//                 throw err;
	//             }
	//             //successful - redirect to new book record.
	//             res.redirect('/dashboard/projects');
	//         });

	//         //res.end("File has been uploaded");
	//     }
	// });

	//res.send('NOT IMPLEMENTED: Project update POST');
}

exports.project_image_get = function(req, res) {
	Project.findById(req.params.id).exec(function(err, project) {
		if (err) {
			throw err
		}
		if (!project) {
			return res.status(404).send('Project not found')
		}

		if (project.image && project.image.data && project.image.data.length) {
			res.contentType(project.image.contentType || 'image/png')
			return res.send(project.image.data)
		}

		const catalogFile = catalogImage.resolveProjectImagePath(project)
		if (catalogFile) {
			return catalogImage.sendImageFile(res, catalogFile)
		}

		return catalogImage.sendPlaceholder(res)
	})
}

// Provide a simple upload endpoint URL and public URL for local storage
exports.project_sign_s3_put_get = (req, res) => {
	const fileName = req.query.fileName
	const fileType = req.query.fileType

	if (!fileName) return res.status(400).send('fileName required')

	const returnData = {
		// Client should PUT the file to the upload endpoint
		signedRequest: `/api/project/upload?fileName=${encodeURIComponent(fileName)}`,
		// Public URL where file will be available
		url: `/catalog/project/${fileName}`
	}
	res.send(JSON.stringify(returnData))
}

// Handle file upload POST to save file locally
exports.project_upload_post = (req, res) => {
	const storage = multer.diskStorage({
		destination: function(req, file, cb) {
			cb(null, UPLOAD_DIR)
		},
		filename: function(req, file, cb) {
			const fileName = req.query.fileName || file.originalname
			cb(null, fileName)
		}
	})

	const upload = multer({ storage: storage }).single('file')

	upload(req, res, function(err) {
		if (err) {
			console.error('Upload error', err)
			return res.status(500).send(err)
		}
		// Return the public URL
		const fileName = req.query.fileName || (req.file && req.file.filename)
		res.send({ url: `/catalog/project/${fileName}` })
	})
}

// Accept raw PUT upload (used by client fetch PUT with file body)
exports.project_upload_put = (req, res) => {
	const fileName = req.query.fileName
	if (!fileName) return res.status(400).send('fileName required')
	const filePath = path.join(UPLOAD_DIR, fileName)

	const writeStream = fs.createWriteStream(filePath)
	req.pipe(writeStream)

	writeStream.on('finish', () => {
		res.send({ url: `/catalog/project/${fileName}` })
	})
	writeStream.on('error', err => {
		console.error('Error writing file', err)
		res.status(500).send(err)
	})
}

// Delete a local file
exports.project_s3_delete_get = (req, res) => {
	const filenameToRemove = req.query.fileName
	if (!filenameToRemove) return res.status(400).send('fileName required')
	const filePath = path.join(UPLOAD_DIR, filenameToRemove)
	fs.unlink(filePath, function(err) {
		if (err) {
			console.error('Error deleting file', filePath, err)
			return res.status(500).send(err)
		}
		res.send(true)
	})
}
