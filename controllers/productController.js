/* eslint-env node */




var fs = require('fs');
var mime = require('mime');
var multer = require('multer');
var catalogImage = require('../utils/catalogImage');


// -----






var Product = require('../models/product');

// Display list of all Products.
exports.product_list = function (req, res) {
    Product.find({})
        //.populate('categories')
        .exec(function (err, list_products) {
            if (err) {
                throw err;
            }
            //Successful, so render
            res.render('shop', {
                products: list_products
            });
            //res.send(list_products);
        });
};

exports.product_edit = function (req, res) {
    Product.find({})
        //.populate('categories')
        .exec(function (err, list_products) {
            if (err) {
                throw err;
            }
            //Successful, so render
            res.render('edit-products', {
                products: list_products
            });
            //res.send(list_products);
        });
};

// Display detail page for a specific Product.
exports.product_detail = function (req, res) {
    Product.findById(req.params.id)
        //.populate('categories')
        .exec(function (err, product) {
            if (err) {
                throw err;
            }
            //Successful, so render
            //console.log(product)
            res.send(product);
            //res.send(list_products);
        });
    //res.send('NOT IMPLEMENTED: Product detail: ' + String(req.params.id));
};


// Handle Product create on POST.
exports.product_create_post = function (req, res) {
    // Create a Book object with escaped and trimmed data.
    var product = new Product({});


    var storage = multer.diskStorage({
        destination: './uploads',
        filename: function (req, file, cb) {
            cb(null, product._id + '.' + mime.getExtension(file.mimetype));
        }
    });

    var upload = multer({
        storage: storage
    }).any();


    upload(req, res, function (err) {
        if (err) {
            throw err;
            //return res.end('Error uploading file.');
        } else {
            //console.log(req.body);
            //console.log(req.files);


            product.name = req.body.product_name;
            product.description = req.body.product_description;
            product.cost = req.body.product_cost;

            product.image.data = fs.readFileSync(req.files[0].path);
            product.image.contentType = req.files[0].mimetype;
            //console.log(product);

            product.save(function (err) {
                if (err) {
                    throw err;
                }
                //successful - redirect to new book record.
                res.redirect('/dashboard/products');

                fs.unlink(req.files[0].path, function (err) {
                    if (err) {
                        throw err;
                    }
                });
            });

            //res.end("File has been uploaded");
        }
    });

    /*

    */

    //console.log(req.body);
    //res.send('request recieved for product' + product.name);
};


// Handle Product delete on POST.
exports.product_delete_post = function (req, res) {
    Product.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            throw err;
        }
        // Success - go to author list
        res.redirect('/dashboard/products');
    });

    //es.send('NOT IMPLEMENTED: Product delete POST');
};


// Handle Product update on POST.
exports.product_update_post = function (req, res) {
    var product = new Product();


    var storage = multer.diskStorage({
        destination: './www/catalog/product',
        filename: function (req, file, cb) {

            cb(null, req.params.id + '.' + mime.getExtension(file.mimetype));
        }
    });

    var upload = multer({
        storage: storage
    }).any();

    upload(req, res, function (err) {
        if (err) {
            throw err;
        } else {
            var update = {
                name: req.body.product_name,
                description: req.body.product_description,
                cost: req.body.product_cost
            };

            if (req.files && req.files.length) {
                update.imagetype = mime.getExtension(req.files[0].mimetype);
            }

            Product.findByIdAndUpdate(req.params.id, update, {}, function (err) {
                if (err) {
                    throw err;
                }
                res.redirect('/dashboard/products');
            });
        }
    });

};




exports.product_image_get = function (req, res) {
    Product.findById(req.params.id)
        .exec(function (err, product) {
            if (err) {
                throw err;
            }
            if (!product) {
                return res.status(404).send('Product not found');
            }

            if (product.image && product.image.data && product.image.data.length) {
                res.contentType(product.image.contentType || 'image/png');
                return res.send(product.image.data);
            }

            var catalogFile = catalogImage.findProductCatalogFile(
                product._id,
                product.imagetype
            );
            if (catalogFile) {
                return catalogImage.sendImageFile(res, catalogFile);
            }

            return catalogImage.sendPlaceholder(res);
        });
};
