const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const cookieModel = require("../models/cookie");
const asyncHandler = require("express-async-handler");
const sendMail = require("../ultils/sendMail");
const crypto = require("crypto");
const makeToken = require("uniqid");
const { users } = require("../ultils/constant");
const productModel = require("../models/product");
const { ObjectId } = require("mongodb");

// const register = asyncHandler(async (req, res) => {
//   const { email, password, firstname, lastname, mobile } = req.body;
//   if (!email || !password || !lastname || !firstname || !mobile)
//     return res.status(400).json({
//       success: false,
//       mes: "Missing input",
//     });
//   const user = await userModel.findOne({ email });
//   if (user) throw new Error("User has existed!");
//   else {
//     const newUser = await userModel.create(req.body);
//     return res.status(200).json({
//       success: newUser ? true : false,
//       mes: newUser
//         ? "Register is successfully. Please go login."
//         : "Something went wrong",
//     });
//   }
// });

const register = asyncHandler(async (req, res) => {
  const { email, password, firstname, lastname, mobile, address } = req.body;

  console.log(req.body);

  if (!email || !password || !lastname || !firstname || !mobile)
    return res.status(400).json({
      success: false,
      mes: "Missing input",
    });

  const user = await userModel.findOne({ email });
  if (user) throw new Error("User has existed!");
  else {
    const token = makeToken();
    // console.log(token);
    // res.cookie(
    //   "dataregister",
    //   { ...req.body, token },
    //   {
    //     sameSite: 'none',
    //     httpOnly: true,
    //     secure: true,
    //     maxAge: 15 * 60 * 1000,
    //     // domain:'localhost',
    //   }
    // );
    await cookieModel.create({
      ...req.body,
      token,
    });

    const html = `Please select the link below.
  <a href = ${process.env.URL_SERVER}/users/finalregister/${token}>Click here.</a>`;
    const subject = "Complete registration";
    await sendMail(email, html, subject);
    return res.json({
      success: true,
      mes: "Please check your email to active account.",
    });
  }
});

const finalRegister = asyncHandler(async (req, res) => {
  const currentTime = new Date();

  const agoTime = new Date(currentTime - 15 * 60 * 1000);

  await cookieModel.deleteMany({
    createdAt: { $lt: agoTime },
  });

  const { token } = req.params;
  const cookie = await cookieModel.findOne({ token });

  if (!cookie || cookie?.token !== token) {
    await cookieModel.deleteOne({ token });
    return res.redirect(`${process.env.CLIENT_URL}/finalregister/falsed`);
  }
  const newUser = await userModel.create({
    email: cookie?.email,
    password: cookie?.password,
    mobile: cookie?.mobile,
    firstname: cookie?.firstname,
    lastname: cookie?.lastname,
    password: cookie?.password,
    address: cookie?.address,
  });
  const cookieDelete = await cookieModel.deleteOne({ token });
  if (newUser && cookieDelete)
    return res.redirect(`${process.env.CLIENT_URL}/finalregister/success`);
  else res.redirect(`${process.env.CLIENT_URL}/finalregister/falsed`);
});

// refresh token => cap moi access token
//access token => xac thuc va phan quyen nguoi dung
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({
      success: false,
      mes: "Missing input",
    });

  const response = await userModel.findOne({ email });

  if (response && (await response.isCorrectPassword(password))) {
    // tách pw và role ra khỏi response
    const { password, role, refreshToken, ...userData } = response.toObject();
    // tạo access token
    const accessToken = generateAccessToken(response._id, role);
    // tạo refresh token
    const newRefreshToken = generateRefreshToken(response._id);
    //Lưu refresh token vào database
    await userModel.findByIdAndUpdate(
      response._id,
      { refreshToken: newRefreshToken },
      { new: true }
    );
    // Lưu refresh token vào cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      accessToken,
      userData: response,
    });
  } else {
    throw new Error("Invalid credenttials!");
  }
});

const getCurrent = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await userModel
    .findById(_id)
    .select("-refreshToken -password")
    .populate({
      path: "cart",
      populate: {
        path: "product",
        select: "title thumb price",
      },
    })
    .populate("wishlist", "totalRating title thumb price color _id discount");
  return res.status(200).json({
    success: user ? true : false,
    rs: user ? user : "User not found!",
  });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie && !cookie.refreshToken)
    throw new Error("No refresh token in cookies");
  const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);

  const response = await userModel.findOne({
    _id: rs._id,
    refreshToken: cookie.refreshToken,
  });
  return res.status(200).json({
    succes: response ? true : false,
    newAccessToken: response
      ? generateAccessToken(response._id, response.role)
      : "Refresh token matched",
  });
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie || !cookie.refreshToken)
    throw new Error("No refresh token in cookies.");
  //Xoa refresh token o db
  await userModel.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true }
  );
  // Xoa refresh token o cookie trinh duyet
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({
    success: true,
    mes: " Logout is done.",
  });
});

//client gui email
//server check email co hop le hay khong => gui mail + kem theo link (password change token)
//clinet check mail => click link
//client gui api kem token
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new Error("Missing email");
  const user = await userModel.findOne({ email });
  if (!user) throw new Error("user not found.");
  const resetToken = user.createPasswordChangedToken();
  await user.save();

  const html = `Please select the link below, this link will expire after 15 minutes.
                <a href = ${process.env.CLIENT_URL}/reset-password/${resetToken}>Click here.</a>`;

  const subject = "Forgot password";
  const rs = await sendMail(email, html, subject);

  return res.status(200).json({
    success: true,
    mes: rs.response?.includes("OK")
      ? "Please check your email."
      : "Please do it again.",
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) throw new Error("Missing inputs");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  // console.log(passwordResetToken);
  const user = await userModel.findOne({
    passwordResetToken,
    passwordResetExprires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Invalid reset token");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordChangeAt = Date.now();
  user.passwordResetExprires = undefined;
  await user.save();
  return res.status(200).json({
    success: user ? true : false,
    mes: user ? "Updated password" : "Something went wrong",
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const queries = { ...req.query };

  // tach ca truong dac biet ra khoi query
  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((el) => delete queries[el]);

  // format lai cac operators cho dung cu phap cua mongoes
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (macthedEl) => `$${macthedEl}`
  );
  const formatedQueries = JSON.parse(queryString);

  //filltering
  if (queries?.name)
    formatedQueries.name = { $regex: queries.name, $options: "i" };

  if (req.query.q) {
    delete formatedQueries.q;
    formatedQueries["$or"] = [
      { firstname: { $regex: req.query.q, $options: "i" } },
      { lastname: { $regex: req.query.q, $options: "i" } },
      { email: { $regex: req.query.q, $options: "i" } },
    ];
  }

  let queryCommand = userModel.find(formatedQueries);
  //sorting
  //abc,efg => [abc,efg] => abc efg
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  }

  //fields limit
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  }

  //pagination
  //limit: so object lay ve trong 1 l;an goij api
  //skip: bo qua bao nhieu object
  const page = +req.query.page || 1;
  const limit = +req.query.limit || process.env.LIMIT_PRODUCT;
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);

  //execute query
  //so luong san pham thoa man dieu kien !== so luong sp tra ve 1 lan goi api
  queryCommand
    .then(async (response) => {
      const counts = await userModel.find(formatedQueries).countDocuments();
      return res.status(200).json({
        success: response ? true : false,
        counts,
        users: response ? response : "Cannot get users.",
      });
    })
    .catch((err) => {
      throw new Error(err);
    });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  const response = await userModel.findByIdAndDelete(uid);
  return res.status(200).json({
    success: response ? true : false,
    mes: response
      ? `User with email ${response.email} deleted.`
      : "No user delete!",
  });
});

const updateUser = async (req, res) => {
  try {
    const { address } = req.body;

    // Parse address nếu nó là chuỗi JSON
    let parsedAddress = null;
    if (address && typeof address === "string") {
      try {
        parsedAddress = JSON.parse(address); // Parse nếu address là chuỗi JSON hợp lệ
      } catch (error) {
        console.log("Address is a string but not JSON, skipping update.");
        parsedAddress = null; // Bỏ qua nếu không phải JSON hợp lệ
      }
    } else if (address && typeof address === "object") {
      parsedAddress = address; // Sử dụng trực tiếp nếu address là đối tượng
    }

    // Xóa address khỏi req.body nếu không hợp lệ
    if (!parsedAddress || typeof parsedAddress === "string") {
      delete req.body.address;
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        ...req.body,
        ...(parsedAddress &&
          typeof parsedAddress !== "string" && { address: parsedAddress }), // Chỉ thêm address nếu hợp lệ
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      mes: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      mes: "Something went wrong",
    });
  }
};

const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  const response = await userModel
    .findByIdAndUpdate(uid, req.body, { new: true })
    .select("-refreshToken -password -role");
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? "Updated." : "Some thing went wrong.",
  });
});

const updateUserAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!req.body.address) throw new Error("Missing inputs");
  const response = await userModel
    .findByIdAndUpdate(
      _id,
      { $push: { address: req.body.address } },
      { new: true }
    )
    .select("-refreshToken -password -role");
  return res.status(200).json({
    success: response ? true : false,
    updateUser: response ? response : "Some thing went wrong.",
  });
});

const updateCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const {
    pid,
    quantity = 1,
    color,
    price,
    thumbnail,
    title,
    discount,
  } = req.body;
  // console.log(discount);
  if (!pid || !color) throw new Error("Missing inputs");
  const user = await userModel.findById(_id).select("cart");
  const alreadyProduct = user?.cart.find(
    (el) => el.product.toString() === pid && el.color === color
  );
  if (alreadyProduct) {
    const findProduct = await productModel.findOne({
      _id: new ObjectId(pid),
      color: color,
    });

    let findVarriant = null;
    if (!findProduct) {
      findVarriant = await productModel.findOne({
        _id: new ObjectId(pid),
        varriants: { $elemMatch: { color: color } },
      });
    }

    let checkQuantity = false;
    let checkQuantityClear0 = false;
    if (findProduct) {
      if (findProduct.quantity === 0) {
        await userModel.findByIdAndUpdate(
          _id,
          {
            $pull: {
              cart: { product: pid, color },
            },
          },
          { new: true }
        );
        checkQuantityClear0 = true;
      } else if (findProduct.quantity >= quantity) checkQuantity = true;
    } else if (findVarriant) {
      if (
        findVarriant.varriants.find((e) => e.color === color).quantity === 0
      ) {
        await userModel.findByIdAndUpdate(
          _id,
          {
            $pull: {
              cart: { product: pid, color },
            },
          },
          { new: true }
        );
        checkQuantityClear0 = true;
      } else if (
        findVarriant.varriants.find((e) => e.color === color).quantity >=
        quantity
      )
        checkQuantity = true;
    }

    // console.log(checkQuantity);

    if (checkQuantity) {
      const response = await userModel.updateOne(
        {
          cart: { $elemMatch: alreadyProduct },
        },
        {
          $set: {
            "cart.$.quantity": quantity,
            "cart.$.price": price,
            // "cart.$.thumbnail": thumbnail,
            // "cart.$.title": title,
          },
        },
        { new: true }
      );
      return res.status(200).json({
        success: response ? true : false,
        mes: response ? "Updated your cart." : "Some thing went wrong.",
      });
    } else {
      return res.status(200).json({
        success: false,
        notEnough: true,
        checkQuantityClear0,
        mes: checkQuantityClear0
          ? `Product quantity of ${title} color ${color}  is out of stock.`
          : `Product quantity of ${title} color ${color}  is not enough.`,
      });
    }
  } else {
    const findProduct = await productModel.findOne({
      _id: new ObjectId(pid),
      color: color,
    });

    let findVarriant = null;
    if (!findProduct) {
      findVarriant = await productModel.findOne({
        _id: new ObjectId(pid),
        varriants: { $elemMatch: { color: color } },
      });
    }

    let checkQuantity = false;
    if (findProduct) {
      if (findProduct.quantity >= quantity) checkQuantity = true;
    } else if (findVarriant) {
      if (
        findVarriant.varriants.find((e) => e.color === color).quantity >=
        quantity
      )
        checkQuantity = true;
    }

    if (checkQuantity) {
      const response = await userModel.findByIdAndUpdate(
        _id,
        {
          $push: {
            cart: {
              product: pid,
              quantity,
              color,
              price,
              thumbnail,
              title,
              discount,
            },
          },
        },
        { new: true }
      );
      return res.status(200).json({
        success: response ? true : false,
        mes: response ? "Updated your cart." : "Some thing went wrong.",
      });
    } else {
      return res.status(401).json({
        success: false,
        notEnough: true,
        mes: `Product quantity of ${title} color ${color}  is not enough.`,
      });
    }
  }
});

const removeProductInCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid, color } = req.params;
  const user = await userModel.findById(_id).select("cart");
  const alreadyProduct = user?.cart.find(
    (el) => el.product.toString() === pid && el.color === color
  );
  if (!alreadyProduct) {
    return res.status(200).json({
      success: true,
      mes: "Updated.",
    });
  }
  const response = await userModel.findByIdAndUpdate(
    _id,
    { $pull: { cart: { product: pid, color } } },
    { new: true }
  );
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? "Updated." : "Some thing went wrong.",
  });
});

const createUsers = asyncHandler(async (req, res) => {
  const response = await userModel.create(users);
  return res.status(200).json({
    succes: response ? true : false,
    users: response ? response : "Some thing went wrong.",
  });
});

const updateWishlist = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const { _id } = req.user;
  const user = await userModel.findById(_id);
  const alreadyWishlist = user.wishlist?.find((e) => e.toString() === pid);
  if (alreadyWishlist) {
    const response = await userModel.findByIdAndUpdate(
      _id,
      { $pull: { wishlist: pid } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      mes: response ? "Updated your wishlist." : "Failed to update wishlist!",
    });
  } else {
    const response = await userModel.findByIdAndUpdate(
      _id,
      { $push: { wishlist: pid } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      mes: response ? "Updated your wishlist." : "Failed to update wishlist!",
    });
  }
});

module.exports = {
  register,
  login,
  getCurrent,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  getUsers,
  deleteUser,
  updateUser,
  updateUserByAdmin,
  updateUserAddress,
  updateCart,
  finalRegister,
  createUsers,
  removeProductInCart,
  updateWishlist,
};
