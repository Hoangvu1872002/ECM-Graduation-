const asyncHandle = require("express-async-handler");

const driverModel = require("../models/driver");
require("dotenv").config();

const registerDriver = asyncHandle(async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    password,
    mobile,
    vehicleBrand,
    travelMode,
    licensePlate,
  } = req.body;

  const avatar = req.files?.avatar[0]?.path;

  // Kiểm tra dữ liệu đầu vào
  if (!firstname || !lastname || !email || !password || !mobile) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  try {
    // Kiểm tra xem email đã tồn tại chưa
    const existingDriver = await driverModel.findOne({ email });
    if (existingDriver) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Tạo tài xế mới
    const newDriver = await driverModel.create({
      firstname,
      lastname,
      email,
      avatar,
      password, // Mật khẩu sẽ được mã hóa tự động trong middleware `pre('save')`
      mobile,
      vehicleBrand: vehicleBrand || "Honda", // Giá trị mặc định nếu không được cung cấp
      travelMode: travelMode || "Bike", // Giá trị mặc định nếu không được cung cấp
      licensePlate: licensePlate || "29V5-19850", // Giá trị mặc định nếu không được cung cấp
    });

    return res.status(201).json({
      success: true,
      message: "Register new driver successfully",
      data: {
        id: newDriver._id,
        avatar: newDriver.avatar,
        firstname: newDriver.firstname,
        lastname: newDriver.lastname,
        email: newDriver.email,
        mobile: newDriver.mobile,
        vehicleBrand: newDriver.vehicleBrand,
        travelMode: newDriver.travelMode,
        licensePlate: newDriver.licensePlate,
        status: newDriver.status,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

const getDrivers = asyncHandle(async (req, res) => {
  const queries = { ...req.query };

  // Loại bỏ các trường đặc biệt khỏi query
  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((el) => delete queries[el]);

  // Định dạng lại các toán tử MongoDB
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (matchedEl) => `$${matchedEl}`
  );
  const formatedQueries = JSON.parse(queryString);

  // Lọc theo tên
  if (queries?.name) {
    formatedQueries.name = { $regex: queries.name, $options: "i" };
  }

  // Tìm kiếm theo từ khóa (q)
  if (req.query.q) {
    delete formatedQueries.q;
    formatedQueries["$or"] = [
      { firstname: { $regex: req.query.q, $options: "i" } },
      { lastname: { $regex: req.query.q, $options: "i" } },
      { email: { $regex: req.query.q, $options: "i" } },
      { mobile: { $regex: req.query.q, $options: "i" } },
    ];
  }

  let queryCommand = driverModel.find(formatedQueries);

  // Sắp xếp
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  }

  // Giới hạn các trường trả về
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  }

  // Phân trang
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10; // Mặc định trả về 10 tài xế
  const skip = (page - 1) * limit;
  queryCommand = queryCommand.skip(skip).limit(limit);

  // Thực thi truy vấn
  try {
    const drivers = await queryCommand;
    const counts = await driverModel.find(formatedQueries).countDocuments();

    return res.status(200).json({
      success: true,
      counts,
      drivers,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Cannot get drivers",
      error: err.message,
    });
  }
});

const deleteDriver = asyncHandle(async (req, res) => {
  const { did } = req.params; // Lấy driver ID từ params

  try {
    // Tìm và xóa driver theo ID
    const deletedDriver = await driverModel.findByIdAndDelete(did);

    // Kiểm tra kết quả và trả về phản hồi
    return res.status(200).json({
      success: deletedDriver ? true : false,
      message: deletedDriver
        ? "Driver deleted successfully."
        : "Driver not found.",
    });
  } catch (error) {
    // Xử lý lỗi
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
});

const updateDriver = asyncHandle(async (req, res) => {
  const { did } = req.params; // Lấy driver ID từ params

  const files = req?.files;
  if (files?.avatar) {
    req.body.avatar = files?.avatar[0]?.path; // Cập nhật avatar nếu có
  } else {
    delete req.body.avatar; // Xóa trường avatar khỏi req.body nếu không có avatar mới
  }

  const { password, ...updateData } = req.body; // Tách mật khẩu ra khỏi dữ liệu cập nhật

  try {
    // Nếu có mật khẩu mới, mã hóa mật khẩu trước khi cập nhật
    if (password) {
      const salt = bcrypt.genSaltSync(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // Cập nhật thông tin tài xế
    const updatedDriver = await driverModel.findByIdAndUpdate(did, updateData, {
      new: true, // Trả về tài xế sau khi cập nhật
      runValidators: true, // Chạy các validator trong schema
    });

    // Kiểm tra nếu không tìm thấy tài xế
    if (!updatedDriver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Driver updated successfully",
      data: updatedDriver,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

module.exports = {
  registerDriver,
  getDrivers,
  deleteDriver,
  updateDriver,
};
