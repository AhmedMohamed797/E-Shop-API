import qs from 'qs';

class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    //[1A] Filter ex.. price=100
    let queryObj = { ...this.queryStr };
    const excludedFields = [
      'page',
      'limit',
      'sort',
      'fields',
      'keyword',
    ];
    excludedFields.forEach((el) => delete queryObj[el]);

    //[1B] Filter ex..{price: {$gte: 100}}
    let queryStr = JSON.stringify(qs.parse(queryObj));
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    // [2] Sorting
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  fieldLimit() {
    // [3] Field Limit
    if (this.queryStr.fields) {
      const limitFields = this.queryStr.fields.split(',').join(' ');
      this.query = this.query.select(limitFields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  search() {
    // [4] Search
    if (this.queryStr.keyword) {
      const querySearch = {
        $or: [
          { title: { $regex: this.queryStr.keyword, $options: 'i' } },
          { name: { $regex: this.queryStr.keyword, $options: 'i' } },
          {
            description: {
              $regex: this.queryStr.keyword,
              $options: 'i',
            },
          },
        ],
      };
      this.query = this.query.find(querySearch);
    }
    return this;
  }

  paginate(countOfDocs) {
    const page = parseInt(this.queryStr.page) || 1;
    const limit = parseInt(this.queryStr.limit) || 10;
    const skip = (page - 1) * limit;
    const lastIndex = page * limit;

    //Pagination Results
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countOfDocs / limit);

    if (lastIndex < countOfDocs) {
      pagination.next = page + 1;
    }

    if (skip > 0) {
      pagination.prev = page - 1;
    }

    this.query = this.query.skip(skip).limit(limit);
    this.paginationResult = pagination;

    return this;
  }
}

export default ApiFeatures;
