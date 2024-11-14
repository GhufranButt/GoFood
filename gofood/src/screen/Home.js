import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.js";
import Footer from "../components/Footer.js";
import Card from "../components/Card.js";
import Carousel from "../components/Carousel.js";

export default function Home() {
  const [search, setSearch] = useState("");
  const [foodCat, setFoodCat] = useState([]);
  const [foodItem, setFoodItem] = useState([]);

  const loadData = async () => {
    try {
      let response = await fetch(
        "http://localhost:8000/api/v1/home/displayData",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      // console.log("API Response:", data);

      if (data && data.gofood && data.gofoodCategory) {
        setFoodItem(data.gofood);
        setFoodCat(data.gofoodCategory);
      } else {
        console.error("Unexpected response structure", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <Navbar />

      <div
        id="carouselExampleFade"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
        style={{ objectFit: "contain !important" }}
      >
        <div className="carousel-inner" id="carousel">
          <div className="carousel-caption" style={{ zIndex: "10" }}>
            <div className="d-flex justify-content-center">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              {/* <button
                className="btn btn-outline-dark text-white bg-dark"
                type="submit"
              >
                Search
              </button> */}
            </div>
          </div>

          <div className="carousel-item active">
            <img
              src="https://images.pexels.com/photos/1556688/pexels-photo-1556688.jpeg?w=1920&h=1080&dpr=2"
              // style={{ filter: "brightness(5)" }}
              className="d-block w-100"
              alt="..."
              style={{
                maxHeight: "700px",
                maxWidth: "2000px",
                objectFit: "cover",
              }}
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://images.pexels.com/photos/27588092/pexels-photo-27588092/free-photo-of-a-black-dish-with-meat-and-vegetables-on-it.jpeg?w=1920&h=1080&dpr=2"
              // style={{ filter: "brightness(100)" }}
              className="d-block w-100"
              alt="..."
              style={{
                maxHeight: "700px",
                maxWidth: "2000px",
                objectFit: "cover",
              }}
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://images.pexels.com/photos/5903162/pexels-photo-5903162.jpeg?w=1920&h=1080&dpr=2"
              // style={{ filter: "brightness(5)" }}
              className="d-block w-100"
              alt="..."
              style={{
                maxHeight: "700px",
                maxWidth: "2000px",
                objectFit: "cover",
              }}
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://images.pexels.com/photos/17481113/pexels-photo-17481113/free-photo-of-raw-slices-of-meal-on-cutting-bard.jpeg?w=1920&h=1080&dpr=2
"
              // style={{ filter: "brightness(5)" }}
              className="d-block w-100"
              alt="..."
              style={{
                maxHeight: "700px",
                maxWidth: "2000px",
                objectFit: "cover",
              }}
            />
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleFade"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleFade"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      <div className="container">
        {foodCat.length > 0 ? (
          foodCat.map((category) => {
            return (
              <div key={category._id || category.id}>
                <div className="fs-3 m-3">{category.CategoryName}</div>
                <hr />
                <div className="row">
                  {foodItem.length > 0 ? (
                    foodItem
                      .filter(
                        (item) =>
                          item.CategoryName === category.CategoryName &&
                          item.name
                            .toLowerCase()
                            .includes(search.toLocaleLowerCase())
                      )
                      .map((filteredItem) => (
                        <div
                          key={filteredItem._id}
                          className="col-12 col-md-6 col-lg-3"
                        >
                          <Card
                            foodName={filteredItem.name}
                            options={filteredItem.options[0]}
                            imgSrc={filteredItem.img}
                            description={filteredItem.description}
                          />
                        </div>
                      ))
                  ) : (
                    <p>No food items found for this category</p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p>No categories available</p>
        )}
      </div>

      <Footer />
    </div>
  );
}
