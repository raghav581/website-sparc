const fs = require('fs')
const path = require('path')

const WWW_ROOT = path.join(__dirname, '..', 'www')
const PRODUCT_CATALOG_DIR = path.join(WWW_ROOT, 'catalog', 'product')
const PLACEHOLDER_FILE = path.join(WWW_ROOT, 'images', 'blank.png')
const PLACEHOLDER_URL = '/images/blank.png'
const IMAGE_EXTENSIONS = ['jpeg', 'jpg', 'png', 'gif', 'webp']

if (!fs.existsSync(PRODUCT_CATALOG_DIR)) {
	fs.mkdirSync(PRODUCT_CATALOG_DIR, { recursive: true })
}

function findProductCatalogFile(id, imagetype) {
	const productId = String(id)
	if (imagetype) {
		const typedPath = path.join(PRODUCT_CATALOG_DIR, `${productId}.${imagetype}`)
		if (fs.existsSync(typedPath)) {
			return typedPath
		}
	}
	for (const ext of IMAGE_EXTENSIONS) {
		const filePath = path.join(PRODUCT_CATALOG_DIR, `${productId}.${ext}`)
		if (fs.existsSync(filePath)) {
			return filePath
		}
	}
	return null
}

function resolveProjectImagePath(project) {
	if (!project || !project.images || !project.images.length) {
		return null
	}
	for (const imageUrl of project.images) {
		if (!imageUrl) {
			continue
		}
		const relativePath = imageUrl.replace(/^\//, '')
		const filePath = path.join(WWW_ROOT, relativePath)
		if (fs.existsSync(filePath)) {
			return filePath
		}
	}
	return null
}

function sendImageFile(res, filePath) {
	res.sendFile(filePath)
}

function sendPlaceholder(res) {
	if (fs.existsSync(PLACEHOLDER_FILE)) {
		return sendImageFile(res, PLACEHOLDER_FILE)
	}
	res.status(404).send('Image not found')
}

module.exports = {
	PLACEHOLDER_URL,
	findProductCatalogFile,
	resolveProjectImagePath,
	sendImageFile,
	sendPlaceholder
}
