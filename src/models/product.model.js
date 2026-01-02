import mongoose from 'mongoose';
import slugify from 'slugify';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
    },

    slug: {
      type: String,
      lowercase: true,
    },

    description: {
      type: String,
      required: [true, 'Product description is required'],
      minlength: [20, 'Description is too short'],
    },

    quantity: {
      type: Number,
      required: [true, 'Product quantity is required'],
      min: [0, 'Quantity cannot be negative'],
    },

    sold: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, 'Product price is required'],
      max: [200000, 'Price is too high'],
    },

    priceAfterDiscount: {
      type: Number,
    },

    colors: [String],

    imageCover: {
      type: String,
      required: [true, 'Product image cover is required'],
    },

    images: [String],

    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'Product must belong to a category'],
    },

    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'SubCategory',
      },
    ],

    brand: {
      type: mongoose.Schema.ObjectId,
      ref: 'Brand',
    },

    ratingsAverage: {
      type: Number,
      min: [1, 'Rating must be above or equal 1'],
      max: [5, 'Rating must be below or equal 5'],
      default: 4.5,
      set: (val) => Math.round(val * 10) / 10,
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    // for virtual property
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.pre('save', function () {
  this.slug = slugify(this.title, {
    lower: true,
    strict: true,
    trim: true,
  });
});

//^ Create virtual property
productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id',
});

// populate virtual reviews on single product
productSchema.pre(/findOne/, function () {
  this.populate({ path: 'reviews' });
});

const setImgURl = (doc) => {
  if (doc.imageCover) {
    if (doc.imageCover) {
      const imageURL = `${process.env.BASE_URL}/products/${doc.imageCover}`;
      doc.imageCover = imageURL;
    }
  }

  if (doc.images) {
    const imageList = [];
    doc.images.forEach((image) => {
      const imageURL = `${process.env.BASE_URL}/products/${image}`;
      imageList.push(imageURL);
    });
    doc.images = imageList;
  }
};

productSchema.post('init', (doc) => {
  setImgURl(doc);
});

productSchema.post('save', (doc) => {
  setImgURl(doc);
});

const Product = mongoose.model('Product', productSchema);
export default Product;
