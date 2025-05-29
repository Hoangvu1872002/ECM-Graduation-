const orderModel = require("../models/order");
const userModel = require("../models/user"); // Import user model
const axios = require("axios");

module.exports = function (io, socketBooking) {
  io.of("/orderStatus").on("connection", (socket) => {
    // console.log("New client connected: " + socket.id);

    socket.on("find-driver", async (data) => {
      console.log(data);

      try {
        const { _id, status } = data;

        const order = await orderModel.findById(_id);

        // console.log(order);

        const pickupAddress = order.shippingAddress; // Điểm nhận đơn
        const deliveryAddress = order.billingAddress; // Điểm giao đơn

        const fetchRoute = async () => {
          try {
            const response = await axios.get(
              "https://rsapi.goong.io/Direction",
              {
                params: {
                  origin: `${pickupAddress.latitude},${pickupAddress.longitude}`,
                  destination: `${deliveryAddress.latitude},${deliveryAddress.longitude}`,
                  vehicle: "bike",
                  api_key: "sJrvIqiCKE2h7akqUhzs1gyVqt5PiCURtoVihCjg",
                },
              }
            );

            const totalDistance =
              response.data.routes[0].legs[0].distance.value; // Đơn vị: mét
            // console.log(`Tổng quãng đường: ${totalDistance} m`);

            return totalDistance;
          } catch (error) {
            console.error("Error fetching route:", error);
            return null;
          }
        };

        const totalDistance = await fetchRoute();

        if (totalDistance !== null) {
          // Gửi sự kiện 'find-driver' qua socketBooking
          socketBooking.emit("find-driver", {
            addressSelectedPickup: pickupAddress,
            addressSelectedDestination: deliveryAddress,
            totalDistance,
            orderId: _id,
            typeVehicleSelected: "Bike", // Ví dụ: loại phương tiện
            costVehicleSelected: 1.2, // Ví dụ: hệ số chi phí
            averageTimeVehicleSelected: Math.ceil(totalDistance / 1000 / 30), // Ví dụ: thời gian trung bình (30 km/h)
            infCustomer: { _id: order.orderBy }, // Thông tin khách hàng
          });

          const response = await orderModel.findByIdAndUpdate(
            _id,
            {
              status,
            },
            { new: true }
          );

          if (response) {
            io.of("/orderStatus").emit("updatedStatus");
          }

          console.log("Event 'find-driver' sent to socketBooking.");
        }

        // const response = await orderModel.findByIdAndUpdate(
        //   _id,
        //   {
        //     status,
        //   },
        //   { new: true }
        // );

        // if (response) {
        //   io.of("/orderStatus").emit("updatedStatus", response);
        //   if (socketBooking.connected) {
        //     socketBooking.emit("serverB-connection");
        //   } else {
        //     console.error("socketBooking is not connected");
        //   }
        // }
      } catch (err) {
        console.error("Error saving socket ID:", err);
      }
    });
    socket.on("update-status-order", async (data) => {
      console.log("Update status order:", data);

      if (data.status === "Proccessing") {
        socketBooking.emit("notice-remove-order-from-admin", data._id);
      }
      const response = await orderModel.findByIdAndUpdate(
        data._id,
        {
          status: data.status,
        },
        { new: true }
      );

      if (response) {
        io.of("/orderStatus").emit("updatedStatus");
      }
    });
  });

  // Lắng nghe sự kiện kết nối từ socketBooking
  socketBooking.on("connect", async () => {
    console.log(`New client connected to socketBooking: ${socketBooking.id}`);

    try {
      // Tìm người dùng theo userId và kiểm tra vai trò
      const user = await userModel.findOne({ role: "admin" });

      if (user) {
        // Cập nhật socketId nếu người dùng là admin
        user.socketId = socketBooking.id;
        await user.save();

        console.log(`Updated socketId for admin ${socketBooking.id}`);
      } else {
        console.error(`User with ID is not an admin or not found.`);
      }
    } catch (error) {
      console.error("Error updating socketId:", error);
    }
  });

  socketBooking.on("update-status-order", async (data) => {
    const response = await orderModel.findByIdAndUpdate(
      data._id,
      {
        status: data.status,
      },
      { new: true }
    );

    if (response) {
      io.of("/orderStatus").emit("updatedStatus");
    }
  });
};
