import path from "./ultils/path";
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import {
  Blog,
  DetailProduct,
  FAQ,
  Home,
  Login,
  Public,
  Services,
  Products,
  FinalRegister,
  ResetPassword,
  DetailCart,
  DetailBlog,
  DetailCheckout,
} from "./pages/public";

import {
  AdminLayout,
  Dashboard,
  ManageOrder,
  ManageUser,
  ManageProduct,
  CreateProduct,
  CreateBlog,
  ManageBlogs,
} from "./pages/admin";
import {
  MemberLayout,
  MyCart,
  Personal,
  Wishlist,
  History,
  Checkout,
} from "./pages/member";
import { getCategories } from "./store/app/asyncAction";
import { useDispatch, useSelector } from "react-redux";
import { Cart, CrOrderVNpay, Modal } from "./components";
import { showCart } from "./store/app/appSlice";
import io from "socket.io-client";
import CreateDriver from "./pages/admin/CreateDriver";
import ManageDriver from "./pages/admin/ManageDriver";

function App() {
  const dispatch = useDispatch();
  const { isShowModal, modalChildren, isShowCart } = useSelector(
    (state) => state.app
  );

  const [resetHistoryOrder, setResetHistoryOrder] = useState(false);

  // let socket;
  const socket = io("http://127.0.0.1:5001/orderStatus");
  // const socket = io("https://hoangvux-be-ecommerce.onrender.com/orderStatus");
  useEffect(() => {
    // Xử lý các sự kiện từ máy chủ
    socket.on("connect", () => {
      // console.log("Connected to server");
    });
    socket.on("updatedStatus", (data) => {
      setResetHistoryOrder((prev) => !prev);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleUpdateStatusOrder = (statusOrder) => {
    socket.emit("update-status-order", statusOrder);
  };

  const handleFindDriver = (statusOrder) => {
    socket.emit("find-driver", statusOrder);
  };

  useEffect(() => {
    dispatch(getCategories());
  }, []);
  return (
    <div className="font-main relative h-screen">
      {isShowCart && (
        <div
          onClick={() => dispatch(showCart())}
          className="absolute inset-0 bg-overlay z-[1000] flex justify-end"
        >
          <Cart></Cart>
        </div>
      )}
      {isShowModal && <Modal>{modalChildren}</Modal>}
      <Routes>
        <Route
          path={path.CHECKOUT_SUCCESS}
          element={<CrOrderVNpay></CrOrderVNpay>}
        />
        <Route path={path.PUBLIC} element={<Public></Public>}>
          <Route path={path.HOME} element={<Home></Home>} />
          <Route path={path.BLOGS} element={<Blog></Blog>} />
          <Route
            path={path.DETAIL_PRODUCT_CATEGORY_PID__TITLE}
            element={<DetailProduct></DetailProduct>}
          />
          <Route
            path={path.DETAIL_BLOG_TITLE}
            element={<DetailBlog></DetailBlog>}
          />
          <Route path={path.FAQS} element={<FAQ></FAQ>} />
          <Route path={path.CONTACT} element={<Services></Services>} />
          <Route path={path.PRODUCTS} element={<Products></Products>} />
          <Route path={path.DETAIL_CART} element={<DetailCart></DetailCart>} />
          <Route
            path={path.DETAIL_CHECKOUT}
            element={<DetailCheckout></DetailCheckout>}
          />
          <Route
            path={path.RESETPASSWORD}
            element={<ResetPassword></ResetPassword>}
          />
          <Route path={path.ALL} element={<Home></Home>} />
        </Route>
        <Route path={path.ADMIN} element={<AdminLayout></AdminLayout>}>
          <Route
            path={path.DASHBOARD}
            element={<Dashboard></Dashboard>}
          ></Route>
          <Route
            path={path.MANAGE_ORDER}
            element={
              <ManageOrder
                handleUpdateStatusOrder={handleUpdateStatusOrder}
                handleFindDriver={handleFindDriver}
                resetHistoryOrder={resetHistoryOrder}
              ></ManageOrder>
            }
          ></Route>
          <Route
            path={path.MANAGE_USER}
            element={<ManageUser></ManageUser>}
          ></Route>
          <Route
            path={path.MANAGE_DRIVER}
            element={<ManageDriver></ManageDriver>}
          ></Route>
          <Route
            path={path.CREATE_DRIVER}
            element={<CreateDriver></CreateDriver>}
          ></Route>
          <Route
            path={path.MANAGE_PRODUCTS}
            element={<ManageProduct></ManageProduct>}
          ></Route>
          <Route
            path={path.CREATE_PRODUCTS}
            element={<CreateProduct></CreateProduct>}
          ></Route>
          <Route
            path={path.CREATE_BLOGS}
            element={<CreateBlog></CreateBlog>}
          ></Route>
          <Route
            path={path.MANAGE_BLOGS}
            element={<ManageBlogs></ManageBlogs>}
          ></Route>
        </Route>
        <Route path={path.MEMBER} element={<MemberLayout></MemberLayout>}>
          <Route path={path.PERSONAL} element={<Personal></Personal>}></Route>
          <Route path={path.MY_CART} element={<MyCart></MyCart>}></Route>
          <Route
            path={path.HISTORY}
            element={
              <History
                resetHistoryOrder={resetHistoryOrder}
                handleUpdateStatusOrder={handleUpdateStatusOrder}
              ></History>
            }
          ></Route>
          <Route path={path.WISLIST} element={<Wishlist></Wishlist>}></Route>
          <Route path={path.CHECKOUT} element={<Checkout></Checkout>}></Route>
        </Route>
        <Route path={path.LOGIN} element={<Login></Login>} />
        <Route
          path={path.FINAL_REGISTER}
          element={<FinalRegister></FinalRegister>}
        />
      </Routes>
    </div>
  );
}

export default App;
