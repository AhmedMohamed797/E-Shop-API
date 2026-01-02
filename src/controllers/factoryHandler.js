import ApiFeatures from '../utils/apiFeatures.js';
import { AppError } from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      return next(
        new AppError(`There's no document with that id`, 404)
      );
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

export const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // BUILD QUERY
    const features = new ApiFeatures(
      Model.find(req.filterObj),
      req.query
    )
      .filter()
      .sort()
      .fieldLimit()
      .search();

    // After applying all features
    const countOfDocs = await features.query.clone().countDocuments();

    features.paginate(countOfDocs);

    // Execute Query
    const docs = await features.query;

    res.status(200).json({
      status: 'success',
      results: docs.length,
      metadata: features.paginationResult,
      data: docs,
    });
  });

export const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: doc,
    });
  });

export const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    );

    if (!doc) {
      return next(
        new AppError(`There's no document with that id`, 404)
      );
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(
        new AppError(`There's no document with that id`, 404)
      );
    }

    res.status(204).json({
      status: 'success',
    });
  });
