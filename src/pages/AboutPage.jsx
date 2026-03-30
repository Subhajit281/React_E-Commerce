import React from "react";
import { Footer, Navbar } from "../components";
const AboutPage = () => {
  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">About Us</h1>
        <hr />
        <p className="lead text-center">
          At our core, we believe jewellery is more than just an accessory—it’s
          a reflection of culture, craftsmanship, and individuality. We are
          dedicated to creating handcrafted jewellery that embodies elegance,
          tradition, and timeless design. Every piece in our collection is
          thoughtfully crafted with attention to detail, combining heritage
          techniques with contemporary aesthetics. Our mission is to offer
          jewellery that not only enhances your style but also connects you to
          the artistry behind it.
        </p>

        <h2 className="text-center py-4">Our Products</h2>
        <div className="row">
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100">
              <img
                className="card-img-top img-fluid"
                src="https://images.unsplash.com/photo-1714733831162-0a6e849141be?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2lsdmVyJTIwZWFycmluZ3N8ZW58MHx8MHx8fDA%3D"
                alt=""
                style={{height:"200px", objectFit:"cover"}}
              />
              <div className="card-body">
                <h5 className="card-title text-center">Traditional Earrings</h5>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100">
              <img
                className="card-img-top img-fluid"
                src="https://images.unsplash.com/photo-1758995115518-26f90aa61b97?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGFuZGNyYWZ0ZWQlMjBuZWNsYWNlfGVufDB8fDB8fHww"
                alt=""
                style={{height:"200px", objectFit:"cover"}}
              />
              <div className="card-body">
                <h5 className="card-title text-center">Necklaces & Pendants</h5>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100">
              <img
                className="card-img-top img-fluid"
                src="https://media.istockphoto.com/id/2178607311/photo/image-of-jewellery-market-silver-heart-pendants-necklaces-display-handcrafted-romantic.webp?a=1&b=1&s=612x612&w=0&k=20&c=LVrzEObRNcDrZGep1h_5FbClo2NAaDTRt2J1q1I4QxA="
                alt=""
                style={{height:"200px", objectFit:"cover"}}
              />
              <div className="card-body">
                <h5 className="card-title text-center">Charms & Pendants</h5>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100">
              <img
                className="card-img-top img-fluid"
                src="https://media.istockphoto.com/id/2191208318/photo/indian-handcrafted-jewellery-and-bangles-displayed-in-local-shop-in-a-market-of-pune-india.jpg?s=612x612&w=0&k=20&c=TbvANh1WsFbFlzLY8XP1Q2PnUq-wj71Bl9o3XLCL7aE="
                alt=""
                style={{height:"200px", objectFit:"cover"}}
              />
              <div className="card-body">
                <h5 className="card-title text-center">Ethical Jewelry</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;
