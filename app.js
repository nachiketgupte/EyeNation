const lib = require("./scripts.js");
const bodyParser = require("body-parser");
const { request } = require("express");
const fileUpload = require("express-fileupload");
let express = require("express");
const app = express();
const mongoose = require("mongoose");
const sha256 = require("sha256");
const nodemailer = require("nodemailer");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.set("view engine", "ejs");
app.use(fileUpload());
console.log(process.env.user);
let alert = require("alert");
var helper = require("./views/helper.js");
let products = [
  {
    name: "Clavin Klein CK-5327A",
    price: 55,
    image:
      "https://static5.lenskart.com/media/catalog/product/pro/1/thumbnail/480x480/9df78eab33525d08d6e5fb8d27136e95//c/a/calvin-klein-ck5327a-018-size-52-eyeglasses_m_7808.jpg",
    count: 0,
  },
  {
    name: "Lance Air",
    price: 75,
    image:
      "https://c3.iggcdn.com/indiegogo-media-prod-cld/image/upload/c_fit,w_auto,g_center,q_auto:best,dpr_2.6,f_auto/ibxjrxzsjcuxlavkzkge",
    count: 0,
  },
];

var cart = [
  {
    productId: 1,
    name: "Prada Rectangle Grey",
    price: 80.0,
    image:
      "https://cdn11.bigcommerce.com/s-28d61/products/9138/images/114235/eyewear-brands-prada-rectangle-grey-ufj1o1-metal-semi-rimless-mens-eyewear-0ps-55fv__12099.1653080532.1280.1280.jpg?c=2",
    count: 0,
  },
  {
    productId: 2,
    name: "Oakley Sportswear",
    price: 40.0,
    image: "https://m.media-amazon.com/images/I/719pG5fEsrL._UX679_.jpg",
    count: 0,
  },
  {
    productId: 3,
    name: "Ray Ban Classics",
    price: 50.0,
    image:
      "https://ph-test-11.slatic.net/p/39920b97783448ff127dcbb4d546722a.jpg",
    count: 0,
  },
  {
    productId: 4,
    name: "Ray Ban Sunglasses",
    price: 45.0,
    image:
      "https://images.ray-ban.com/is/image/RayBan/805289114567__001.png?impolicy=RB_Product_front&width=720&bgc=%23f2f2f2",
    count: 0,
  },
  {
    productId: 5,
    name: "Oakley Sunglasses",
    price: 47.5,
    image:
      "https://5.imimg.com/data5/AX/HL/MY-8321312/men-s-oakley-sunglasses-500x500.jpg",
    count: 0,
  },
  {
    productId: 6,
    name: "Diesel Womens Stylish",
    price: 99.99,
    image: "https://m.media-amazon.com/images/I/71oO71TTMGL._UL1500_.jpg",
    count: 0,
  },
  {
    productId: 7,
    name: "Diesel Rimless",
    price: 60.0,
    image:
      "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTDWVxQmut8oMeb2vB159yNjJHmpsPRRdTOhSWN-jS4Xis7oF8IhEQVHgC_GmNzjA-DEtINgRVWB93Rk2y6FK_IpHu4WkSu8EAEVh3rnGu9dubo520lahXr8g&usqp=CAE",
    count: 0,
  },
  {
    productId: 8,
    name: "Gucci Photochromic Sunglasses",
    price: 100.0,
    image:
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcR8g4R-AKmWa7AXIATTJbPgygDTUk8mH7Ps2yGkfjb15iljwqAPONGTH5nuvAEVvkXsLTTUf-2nWHXdgjdMq8Q_RcN66gzNqdqU6rOUFHtZeKIEbftwohM9FQ&usqp=CAE",
    count: 0,
  },
];

var allProducts = cart.concat(products);

cart.join();

let purchase = [];

var loggedIn = false;
var name;
var email;

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  fname: String,
  lname: String,
  email: String,
  pnumber: Number,
});

const User = new mongoose.model("users", userSchema);

// Main page
app.get("/", (req, res) => {
  if (loggedIn === true) {
    res.render("index1", {
      fname: name,
      totalProducts: purchase.length,
      cart: cart,
    });
  } else {
    res.render("index");
  }
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/logout", (req, res) => {
  loggedIn = false;
  res.redirect("/");
});

app.get("/about", (req, res) => {
  res.render("about", { loggedIn: loggedIn });
});

// Add Product Page
app.get("/addProduct", (req, res) => {
  res.render("addProduct", {
    fname: name,
    total: products.length,
    totalProducts: purchase.length,
  });
});

// New Arrivals
app.get("/newArrivals", (req, res) => {
  res.render("newArrivals", {
    products: products,
    fname: name,
    total: products.length,
    totalProducts: purchase.length,
  });
});

app.get("/success", (req, res) => {
  res.render("success", { fname: name, totalProducts: purchase.length });
});

//Cart page
app.get("/cart", (req, res) => {
  let totalPrice = 0;
  purchase.forEach((item) => {
    totalPrice += item.price * item.count;
  });
  // console.log(purchase[0].name)
  res.render("cart", {
    purchase: purchase,
    fname: name,
    totalProducts: purchase.length,
    totalPrice: totalPrice,
  });
});

app.get("/checkout", (req, res) => {
  let totalPrice = 0;
  purchase.forEach((item) => {
    totalPrice += item.price;
  });
  let tax = totalPrice * 0.18;
  totalPrice *= 1.18;
  res.render("checkout", {
    purchase: purchase,
    totalPrice: totalPrice.toFixed(2),
    totalProducts: purchase.length,
    tax: tax.toFixed(2),
  });
});

app.get("/allProducts", (req, res) => {
  if (loggedIn === false) {
    res.render("allProducts", { allProducts: allProducts });
  } else {
    res.render("allproducts1", {
      fname: name,
      totalProducts: purchase.length,
      allProducts: allProducts,
    });
  }
});

//Register

app.post("/register", function (req, res) {
  const newUser = new User({
    username: req.body.username,
    password: sha256(req.body.password),
    fname: req.body.Firstname,
    lname: req.body.Lastname,
    email: req.body.email,
    pnumber: req.body.phoneNo,
  });

  newUser.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

//Login Request

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username: username }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        console.log("found user");
        if (foundUser.password === sha256(password)) {
          name = foundUser.fname;
          email = foundUser.email;
          loggedIn = true;
          res.redirect("/");
        } else {
          alert("Wrong password!");
        }
      } else {
        alert("User does not exist");
      }
    }
  });
});

app.post("/logout", (req, res) => {
  loggedIn = false;
  res.redirect("/");
});

app.post("/contact", (req, res) => {
  let userEmail = req.body.email;
  let title = req.body.topic;
  let message = req.body.message;
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.user,
      pass: process.env.pass,
    },
  });

  var mailOptions = {
    from: process.env.user,
    to: userEmail,
    subject: title,
    text: "Your grievance was received. We will get back to you shortly! ;)",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Error: " + error);
    } else {
      res.redirect("/");
      console.log("Mail sent");
    }
  });
});

//Add product to website
app.post("/addProduct", (req, res) => {
  const { image } = req.files;
  if (!image) return res.sendStatus(400);
  console.log(image);
  image.mv(
    "C:/Users/Pranjal/Desktop/drive-download-20230320T063415Z-001/assets/uploads/" +
      image.name
  );
  let newProduct = {
    name: req.body.product,
    price: req.body.price,
    image: "/assets/uploads/" + image.name,
    count: 0,
  };
  products.push(newProduct);
  allProducts.push(newProduct);
  res.redirect("/");
});

//Add to cart
app.post("/", (req, res) => {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].name == req.body.item) {
      cart[i].count++;

      if (purchase.includes(cart[i])) {
        let j = purchase.indexOf(cart[i]);
        console.log(purchase[0].count);
      } else {
        purchase.push(cart[i]);
        console.log(purchase.indexOf(cart[i]));
      }
    }
  }
});

app.post("/allProducts1", (req, res) => {
  for (let i = 0; i < allProducts.length; i++) {
    if (allProducts[i].name == req.body.item) {
      allProducts[i].count++;
      console.log(allProducts[i].name);
      if (purchase.includes(allProducts[i])) {
        let j = purchase.indexOf(allProducts[i]);
        console.log(purchase[0].price);
      } else {
        purchase.push(allProducts[i]);
        console.log(purchase.indexOf(allProducts[i]));
      }
    }
  }
});

//Open cart from home page
app.post("/cartpage", (req, res) => {
  res.redirect("/cart");
});

// Checkout, continue shopping and clear cart
app.post("/cart", (req, res) => {
  if (req.body.cart_input === "home") {
    res.redirect("/");
  } else if (req.body.cart_input === "checkout") {
    res.redirect("/checkout");
  } else {
    purchase = [];
    allProducts.forEach((item) => {
      item.count = 0;
    });
    cart.forEach((item) => {
      item.count = 0;
    });
    res.redirect("/cart");
  }
});

// Send mail
app.post("/checkout", (req, res) => {
  let message = "";
  for (let i = 0; i < purchase.length; i++) {
    message += "Item " + (i + 1) + ": " + purchase[i].name + "\n";
  }
  message +=
    "\nExpected Delivery by " +
    ((new Date().getDate() + 3) % 30) +
    "/" +
    (new Date().getMonth() + 1) +
    "/" +
    new Date().getFullYear();
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email,
      pass: userpassword,
    },
  });

  var mailOptions = {
    from: process.env.user,
    to: email,
    subject: "Your order is confirmed!",
    text: "Order Summary: " + message,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Error: " + error);
    } else {
      console.log("Email sent: " + info.response);
      purchase = [];
      res.redirect("/success");
    }
  });
});

app.listen(5000, () => {
  console.log("Listening on port 5000");
});
