import mongoose from 'mongoose';
import slugify from 'slugify';

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Subcategory name is required'],
      trim: true,
      unique: true,
      minlength: [2, 'SubCategory should be at least 2 characters'],
    },
    slug: {
      type: String,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [
        true,
        'Subcategory must belong to a specific category',
      ],
    },
  },
  {
    timestamps: true,
  }
);

subCategorySchema.pre('save', function () {
  this.slug = slugify(this.name, { lower: true, trim: true });
});

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

export default SubCategory;
