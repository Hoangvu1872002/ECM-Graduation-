const orderModel = require("../models/order");
const userModel = require("../models/user"); // Import user model
const axios = require("axios");

const orderTimeouts = {};
const orderTimeoutsFinish = {};
const orderIntervals = {};
const orderIdNew = {};
const orderArrDriverReceived = {};

module.exports = function (io, socketBooking) {
  io.of("/orderStatus").on("connection", (socket) => {
    socket.on("find-driver", async (data) => {
      // console.log(data);
      let radius = 2500;
      let numberDriverFind = 15;
      const maxRadius = 4000;

      try {
        const { _id, status } = data;
        const order = await orderModel.findById(_id).populate("orderBy");
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
            infCustomer: order.orderBy, // Thông tin khách hàng
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

        const arrDriverHandler = async (data) => {
          console.log(data);
          if (data.orderId === _id) {
            orderArrDriverReceived[_id] = data.socketIds;
          }
        };

        const idNewHandler = async (data) => {
          if (data.orderId === _id) {
            orderIdNew[_id] = data.newBillTemId;
          }
        };

        socketBooking.on("arr-driver-received-order", arrDriverHandler);

        socketBooking.on("id-new-order", idNewHandler);

        clearTimeout(orderTimeouts[_id]);
        delete orderTimeouts[_id];
        orderTimeouts[_id] = setTimeout(async () => {
          socketBooking.emit("find-driver-again", {
            idNewOrder: orderIdNew[_id],
            radius: radius,
            numberDriverFind: numberDriverFind,
            arrDriversRevceivOrder: orderArrDriverReceived[_id],
          });

          clearInterval(orderIntervals[_id]);
          delete orderIntervals[_id];
          orderIntervals[_id] = setInterval(() => {
            socketBooking.emit("find-driver-again", {
              idNewOrder: orderIdNew[_id],
              radius: radius === maxRadius ? radius : radius + 500,
              numberDriverFind: numberDriverFind + 5,
              arrDriversRevceivOrder: orderArrDriverReceived[_id],
            });

            if (radius < maxRadius) radius += 500;
            numberDriverFind += 5;
          }, 10000);

          clearTimeout(orderTimeoutsFinish[_id]);
          delete orderTimeoutsFinish[_id];

          orderTimeoutsFinish[_id] = setTimeout(async () => {
            clearInterval(orderIntervals[_id]);
            delete orderIntervals[_id];

            socketBooking.emit(
              "notice-remove-order-from-user",
              orderIdNew[_id]
            );
            const response = await orderModel.findByIdAndUpdate(
              _id,
              {
                status: "Proccessing",
              },
              { new: true }
            );

            delete orderIdNew[_id];
            delete orderArrDriverReceived[_id];
            delete orderTimeouts[_id];
            delete orderTimeoutsFinish[_id];

            socketBooking.off("arr-driver-received-order", arrDriverHandler);
            socketBooking.off("id-new-order", idNewHandler);
            socketBooking.off(
              "notice-driver-receipted-order",
              noticeDriverReceiptedOrderHandler
            );

            if (response) {
              io.of("/orderStatus").emit("updatedStatus");
            }
          }, 52000);
        }, 10000);

        const noticeDriverReceiptedOrderHandler = async (data) => {
          if (data.orderId === _id) {
            clearTimeout(orderTimeouts[_id]);
            delete orderTimeouts[_id];

            clearInterval(orderIntervals[_id]);
            delete orderIntervals[_id];

            clearTimeout(orderTimeoutsFinish[_id]);
            delete orderTimeoutsFinish[_id];

            delete orderIdNew[_id];
            delete orderArrDriverReceived[_id];

            socketBooking.off("arr-driver-received-order", arrDriverHandler);
            socketBooking.off("id-new-order", idNewHandler);
            socketBooking.off(
              "notice-driver-receipted-order",
              noticeDriverReceiptedOrderHandler
            );
          }
        };

        socketBooking.on(
          "notice-driver-receipted-order",
          noticeDriverReceiptedOrderHandler
        );
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
