import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";

const ViewAllProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const api_Url = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const getAllProducts = async () => {
      const allProducts = await retrieveAllProducts();
      if (allProducts) {
        setAllProducts(allProducts.products);
      }
    };
    getAllProducts();
    // eslint-disable-next-line
  }, []);

  const retrieveAllProducts = async () => {
    const response = await axios.get(
      `${api_Url}/api/product/fetch/all`
    );
    console.log(response.data);
    return response.data;
  };

  return (
    <div className="mt-3">
      <div
        className="card form-card ms-2 me-2 mb-5 custom-bg shadow-lg"
        style={{
          height: "45rem",
        }}
      >
        <div
          className="card-header custom-bg-text text-center bg-color"
          style={{
            borderRadius: "1em",
            height: "50px",
          }}
        >
          <h2>My Products</h2>
        </div>
        <div
          className="card-body"
          style={{
            overflowY: "auto",
          }}
        >
          <div className="table-responsive">
            <table className="table table-hover text-color text-center">
              <thead className="table-bordered border-color bg-color custom-bg-text">
                <tr>
                  <th scope="col">Product</th>
                  <th scope="col">Name</th>
                  <th scope="col">Description</th>
                  <th scope="col">Category</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Price</th>
                  <th scope="col">Seller</th>
                </tr>
              </thead>
              <tbody>
                {allProducts.map((product) => {
                  return (
                    <tr>
                      <td>
                        <img
                          src={
                            `${api_Url}/api/product/` +
                            product.image1
                          }
                          class="img-fluid"
                          alt="product_pic"
                          style={{
                            maxWidth: "90px",
                          }}
                        />
                      </td>
                      <td>
                        <b>{product.name}</b>
                      </td>
                      <td>
                        <b>{product.description}</b>
                      </td>
                      <td>
                        <b>{product.category ? product.category.name : "No Category"}</b>
                      </td>
                      <td>
                        <b>{product.quantity}</b>
                      </td>
                      <td>
                        <b>{product.price}</b>
                      </td>
                      <td>
                        <b>{product.seller.firstName}</b>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAllProducts;
