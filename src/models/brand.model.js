import mongoose from 'mongoose';
import slugify from 'slugify';

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Brand name is required'],
      trim: true,
      unique: true,
      minlength: [2, 'Brand should be at least 2 characters'],
    },
    slug: {
      type: String,
    },
    image: String,
    subCategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'SubCategory',
        required: [true, 'Brand must belong to subcategory'],
      },
    ],
  },
  {
    timestamps: true,
  }
);

brandSchema.pre('save', function () {
  this.slug = slugify(this.name, { lower: true, trim: true });
});


const setImgURl = (doc) => {
  if (doc.image) {
    const imageURL = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageURL;
  }
};

brandSchema.post('init', (doc) => {
  setImgURl(doc);
});

brandSchema.post('save', (doc) => {
  setImgURl(doc);
});

const Brand = mongoose.model('Brand', brandSchema);
export default Brand;
