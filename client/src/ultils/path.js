const path = {
  PUBLIC: "/",
  HOME: "",
  ALL: "*",
  LOGIN: "login",
  PRODUCTS: ":category",
  BLOGS: "blogs/blogs",
  CONTACT: "contact/:contact",
  FAQS: "faqs",
  DETAIL_PRODUCT_CATEGORY_PID__TITLE: ":category/:pid/:title",
  DETAIL_BLOG_TITLE: "blogs/blogs/:bid",
  FINAL_REGISTER: "finalregister/:status",
  RESETPASSWORD: "reset-password/:token",
  DETAIL_CART: "my-cart",
  DETAIL_CHECKOUT: "checkout",
  CHECKOUT_SUCCESS: "success",

  //admin
  ADMIN: "admin",
  DASHBOARD: "dashboard",
  MANAGE_PRODUCTS: "manage-products",
  MANAGE_USER: "manage-user",
  CREATE_DRIVER: "create-driver",
  MANAGE_DRIVER: "manage-driver",
  MANAGE_ORDER: "manage-order",
  CREATE_PRODUCTS: "create-products",
  CREATE_BLOGS: "create-blogs",
  MANAGE_BLOGS: "manage-blogs",

  // member
  MEMBER: "member",
  PERSONAL: "personal",
  MY_CART: "my-cart",
  HISTORY: "buy-history",
  WISLIST: "wishlist",
  CHECKOUT: "checkout",
};
export default path;
