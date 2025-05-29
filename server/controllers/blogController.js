const blogModel = require("../models/blog");
const asyncHandler = require("express-async-handler");

const createNewBlog = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const thumb = req.files?.thumb[0]?.path;
  if (!title || !description || !thumb) throw new Error("Missing inputs.");
  if (thumb) req.body.thumb = thumb;
  // console.log(req.body);
  const response = await blogModel.create(req.body);
  return res.json({
    success: response ? true : false,
    mes: response ? "Created new blog." : " Cannot create new blog .",
  });
});

const updateBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const files = req?.files;
  if (files?.thumb) req.body.thumb = files?.thumb[0]?.path;
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs.");
  const response = await blogModel.findByIdAndUpdate(bid, req.body, {
    new: true,
  });
  return res.json({
    success: response ? true : false,
    mes: response ? "Updated blog." : " Cannot update blog.",
  });
});

const getBlogs = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  // console.log(queries);
  // tach ca truong dac biet ra khoi query
  const excludeFields = ["limit", "sort", "page"];
  excludeFields.forEach((el) => delete queries[el]);
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (macthedEl) => `$${macthedEl}`
  );
  // console.log("a");
  const formatedQueries = JSON.parse(queryString);
  // console.log("d");
  let queryObject = {};
  if (queries?.q) {
    delete formatedQueries.q;
    queryObject = {
      $or: [
        // { color: { $regex: queries?.q, $options: "i" } },
        { title: { $regex: queries?.q, $options: "i" } },
        // { category: { $regex: queries?.q, $options: "i" } },
        // { brand: { $regex: queries?.q, $options: "i" } },
      ],
    };
  }
  // console.log("b");
  const queryCommand = blogModel.find(queryObject);

  queryCommand.sort("-createdAt");

  const page = +req.query.page || 1;
  const limit = +req.query.limit || process.env.LIMIT_PRODUCT;
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);
  // console.log("a");
  queryCommand
    .then(async (response) => {
      const counts = await blogModel.find(queryCommand).countDocuments();
      return res.status(200).json({
        success: response ? true : false,
        counts,
        blogs: response ? response : "Cannot get blogs.",
      });
    })
    .catch((err) => {
      throw new Error(err);
    });
});
/*
khi nguoi dung like 1 bai blog thi:
1. check xem nguoi dung do truoc do co dislike hay khong => bo dislike
2. check xem nguoi do co like hay khong => bo like hoac them like
*/
const likeBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { bid } = req.params;
  if (!bid) throw new Error("Missing inputs.");
  const blog = await blogModel.findById(bid);
  const alreadyDisliked = blog?.dislikes?.find((e) => e.toString() === _id);
  if (alreadyDisliked) {
    await blogModel.findByIdAndUpdate(
      bid,
      { $pull: { dislikes: _id } },
      { new: true }
    );
    const response = await blogModel.findByIdAndUpdate(
      bid,
      { $push: { likes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      mes: response ? "You liked the article." : "Cannot be removed.",
    });
  }
  const isliked = blog?.likes?.find((e) => e.toString() === _id);
  if (isliked) {
    const response = await blogModel.findByIdAndUpdate(
      bid,
      { $pull: { likes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      mes: response ? "Your like have been removed." : "Cannot be removed.",
    });
  } else {
    const response = await blogModel.findByIdAndUpdate(
      bid,
      { $push: { likes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      mes: response ? "You liked the article." : "Cannot be removed.",
    });
  }
});

const dislikeBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { bid } = req.params;
  if (!bid) throw new Error("Missing inputs.");
  const blog = await blogModel.findById(bid);
  const alreadyliked = blog?.likes?.find((e) => e.toString() === _id);
  if (alreadyliked) {
    await blogModel.findByIdAndUpdate(
      bid,
      { $pull: { likes: _id } },
      { new: true }
    );
    const response = await blogModel.findByIdAndUpdate(
      bid,
      { $push: { dislikes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      mes: response ? "You disliked the article." : "Cannot be removed.",
    });
  }
  const isDisliked = blog?.dislikes?.find((e) => e.toString() === _id);
  if (isDisliked) {
    const response = await blogModel.findByIdAndUpdate(
      bid,
      { $pull: { dislikes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      mes: response ? "Your dislike have been removed." : "Cannot be removed.",
    });
  } else {
    const response = await blogModel.findByIdAndUpdate(
      bid,
      { $push: { dislikes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      mes: response ? "You disliked the article." : "Cannot be removed.",
    });
  }
});

const getOneBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  // console.log(bid);
  const blog = await blogModel.findByIdAndUpdate(
    bid,
    { $inc: { numberViews: 1 } },
    { new: true }
  );
  // .populate("likes", "firstname lastname")
  // .populate("dislikes", "firstname lastname");
  return res.json({
    success: blog ? true : false,
    blog: blog ? blog : " Cannot get blogs.",
  });
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const blog = await blogModel.findByIdAndDelete(bid);
  return res.json({
    success: blog ? true : false,
    mes: blog ? "Deleted blog." : " Something went wrong. ",
  });
});

const uploadImagesBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  // console.log(req.file);
  if (!req.file) throw new Error("Missing inputs.");
  const response = await blogModel.findByIdAndUpdate(
    bid,
    {
      image: req.file.path,
    },
    { new: true }
  );
  return res.status(200).json({
    status: response ? true : false,
    updateBlog: response ? response : "Cannot upload images blog.",
  });
});

module.exports = {
  createNewBlog,
  updateBlog,
  getBlogs,
  likeBlog,
  dislikeBlog,
  getOneBlog,
  deleteBlog,
  uploadImagesBlog,
};
