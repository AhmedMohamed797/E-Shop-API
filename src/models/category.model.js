import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
      minlength: [2, 'SubCategory should be at least 2 characters'],
    },
    slug: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.pre('save', function () {
  this.slug = slugify(this.name, { lower: true, trim: true });
});

const setImgURl = (doc) => {
  if (doc.image) {
    const imageURL = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageURL;
  }
};

categorySchema.post('init', (doc) => {
  setImgURl(doc);
});

categorySchema.post('save', (doc) => {
  setImgURl(doc);
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
