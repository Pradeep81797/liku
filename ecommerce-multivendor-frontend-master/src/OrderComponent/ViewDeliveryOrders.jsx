import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { Button, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

const ViewDeliveryOrders = () => {
  const deliveryPerson = JSON.parse(sessionStorage.getItem("active-delivery")) || {};
  const [orders, setOrders] = useState([]);
  const [deliveryStatus, setDeliveryStatus] = useState([]);
  const [deliveryTime, setDeliveryTime] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [tempOrderId, setTempOrderId] = useState("");
  const [assignOrderId, setAssignOrderId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deliveryUpdateRequest, setDeliveryUpdateRequest] = useState({
    orderId: "",
    deliveryStatus: "",
    deliveryTime: "",
    deliveryDate: "",
    deliveryId: deliveryPerson.id,
  });
  const delivery_jwtToken = sessionStorage.getItem("delivery-jwtToken");

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleInput = (e) => {
    setDeliveryUpdateRequest({
      ...deliveryUpdateRequest,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const retrieveOrdersById = async () => {
      const response = await axios.get(
        "http://43.204.61.151:8080/api/order/fetch?orderId=" + orderId
      );
      return response.data;
    };

    const retrieveAllorders = async () => {
      const response = await axios.get(
        "http://43.204.61.151:8080/api/order/fetch/delivery-wise?deliveryPersonId=" +
          deliveryPerson.id,
        {
          headers: {
            Authorization: "Bearer " + delivery_jwtToken,
          },
        }
      );
      return response.data;
    };

    const getAllOrders = async () => {
      if (!delivery_jwtToken || !deliveryPerson.id) {
        window.location.href = "/home";
        return;
      }
      let allOrders;
      if (orderId) {
        allOrders = await retrieveOrdersById();
      } else {
        allOrders = await retrieveAllorders();
      }
      if (allOrders) {
        setOrders(allOrders.orders);
      }
    };

    const getAllDeliveryStatus = async () => {
      let allStatus = await retrieveAllDeliveryStatus();
      if (allStatus) {
        setDeliveryStatus(allStatus);
      }
    };

    const getAllDeliveryTiming = async () => {
      let allTiming = await retrieveAllDeliveryTiming();
      if (allTiming) {
        setDeliveryTime(allTiming);
      }
    };

    getAllOrders();
    getAllDeliveryStatus();
    getAllDeliveryTiming();
  }, [orderId, delivery_jwtToken, deliveryPerson.id]);

  const retrieveAllDeliveryStatus = async () => {
    const response = await axios.get(
      "http://43.204.61.151:8080/api/order/fetch/delivery-status/all"
    );
    return response.data;
  };

  const retrieveAllDeliveryTiming = async () => {
    const response = await axios.get(
      "http://43.204.61.151:8080/api/order/fetch/delivery-time/all"
    );
    return response.data;
  };

  const formatDateFromEpoch = (epochTime) => {
    const date = new Date(Number(epochTime));
    return date.toLocaleString();
  };

  const searchOrderById = (e) => {
    e.preventDefault();
    setOrderId(tempOrderId);
  };

  const updateDelivery = (orderId, e) => {
    setAssignOrderId(orderId);
    handleShow();
  };

  const updateOrderStatus = (orderId, e) => {
    deliveryUpdateRequest.orderId = assignOrderId;
    fetch("http://43.204.61.151:8080/api/order/update/delivery-status", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + delivery_jwtToken,
      },
      body: JSON.stringify(deliveryUpdateRequest),
    })
      .then((result) => {
        result.json().then((res) => {
          if (res.success) {
            toast.success(res.responseMessage, {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            setTimeout(() => {
              window.location.reload(true);
            }, 2000);
          } else if (!res.success) {
            toast.error(res.responseMessage, {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            setTimeout(() => {
              window.location.reload(true);
            }, 2000);
          } else {
            toast.error("It Seems Server is down!!!", {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            setTimeout(() => {
              window.location.reload(true);
            }, 2000);
          }
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error("It seems server is down", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          window.location.reload(true);
        }, 1000);
      });
  };

  return (
    <div className="mt-3">
      <div className="card form-card ms-2 me-2 mb-5 custom-bg shadow-lg" style={{ height: "40rem" }}>
        <div className="card-header custom-bg-text text-center bg-color" style={{ borderRadius: "1em", height: "50px" }}>
          <h2>My Delivery Orders</h2>
        </div>
        <div className="card-body" style={{ overflowY: "auto" }}>
          <form className="row g-3">
            <div className="col-auto">
              <input
                type="text"
                className="form-control"
                id="inputPassword2"
                placeholder="Enter Order Id..."
                onChange={(e) => setTempOrderId(e.target.value)}
                value={tempOrderId}
              />
            </div>
            <div className="col-auto">
              <button
                type="submit"
                className="btn bg-color custom-bg-text mb-3"
                onClick={searchOrderById}
              >
                Search
              </button>
            </div>
          </form>

          <div className="table-responsive">
            <table className="table table-hover text-color text-center">
              <thead className="table-bordered border-color bg-color custom-bg-text">
                <tr>
                  <th scope="col">Order Id</th>
                  <th scope="col">Product</th>
                  <th scope="col">Product Name</th>
                  <th scope="col">Category</th>
                  <th scope="col">Seller</th>
                  <th scope="col">Price</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Customer</th>
                  <th scope="col">Order Time</th>
                  <th scope="col">Order Status</th>
                  <th scope="col">Delivery Person</th>
                  <th scope="col">Delivery Contact</th>
                  <th scope="col">Delivery Time</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  return (
                    <tr key={order.orderId}>
                      <td>
                        <b>{order.orderId}</b>
                      </td>
                      <td>
                        <img
                          src={
                            "http://43.204.61.151:8080/api/product/" +
                            order.product.image1
                          }
                          className="img-fluid"
                          alt="product_pic"
                          style={{
                            maxWidth: "90px",
                          }}
                        />
                      </td>
                      <td>
                        <b>{order.product.name}</b>
                      </td>
                      <td>
                        <b>{order.product.category ? order.product.category.name : 'Not Available'}</b>
                      </td>
                      <td>
                        <b>{order.product.seller.firstName}</b>
                      </td>
                      <td>
                        <b>{order.product.price}</b>
                      </td>
                      <td>
                        <b>{order.quantity}</b>
                      </td>
                      <td>
                        <b>{order.user.firstName}</b>
                      </td>

                      <td>
                        <b>{formatDateFromEpoch(order.orderTime)}</b>
                      </td>
                      <td>
                        <b>{order.status}</b>
                      </td>
                      <td>
                        {(() => {
                          if (order.deliveryPerson) {
                            return <b>{order.deliveryPerson.firstName}</b>;
                          } else {
                            return <b className="text-danger">Pending</b>;
                          }
                        })()}
                      </td>
                      <td>
                        {(() => {
                          if (order.deliveryPerson) {
                            return <b>{order.deliveryPerson.phoneNo}</b>;
                          } else {
                            return <b className="text-danger">Pending</b>;
                          }
                        })()}
                      </td>
                      <td>
                        {(() => {
                          if (order.deliveryDate) {
                            return (
                              <b>
                                {order.deliveryDate + " " + order.deliveryTime}
                              </b>
                            );
                          } else {
                            return <b className="text-danger">Processing</b>;
                          }
                        })()}
                      </td>
                      <td>
                        {(() => {
                          if (order.status === "Delivered") {
                            return <b className="text-success">Delivered</b>;
                          } else {
                            return (
                              <button
                                className="btn btn-sm bg-color custom-bg-text ms-2"
                                variant="primary"
                                onClick={() => updateDelivery(order.orderId)}
                              >
                                Update Status
                              </button>
                            );
                          }
                        })()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton className="bg-color custom-bg-text">
          <Modal.Title
            style={{
              borderRadius: "1em",
            }}
          >
            Update Delivery Status
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="ms-3 mt-3 mb-3 me-3">
            <form>
              <div className="mb-3">
                <label for="title" className="form-label">
                  <b>Order Id</b>
                </label>
                <input type="text" className="form-control" value={assignOrderId} />
              </div>

              <div className="mb-3">
                <label for="deliveryDate" className="form-label">
                  <b>Delivery Date</b>
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="deliveryDate"
                  name="deliveryDate"
                  onChange={handleInput}
                  value={deliveryUpdateRequest.deliveryDate}
                />
              </div>

              <div className=" mb-3">
                <label className="form-label">
                  <b>Delivery Time</b>
                </label>

                <select
                  name="deliveryTime"
                  onChange={handleInput}
                  className="form-control"
                >
                  <option key="default" value="">Select Delivery Time</option>

                  {deliveryTime.map((time, index) => {
                    return <option key={index} value={time}>{time}</option>;
                  })}
                </select>
              </div>

              <div className=" mb-3">
                <label className="form-label">
                  <b>Delivery Status</b>
                </label>

                <select
                  name="deliveryStatus"
                  onChange={handleInput}
                  className="form-control"
                >
                  <option  key="default" value="">Select Delivery Status</option>

                  {deliveryStatus.map((status,index) => {
                    return <option key={index} value={status}>{status}</option>;
                  })}
                </select>
              </div>

              <div className="d-flex aligns-items-center justify-content-center mb-2">
                <button
                  type="submit"
                  onClick={() => updateOrderStatus(assignOrderId)}
                  className="btn bg-color custom-bg-text"
                >
                  Update Status
                </button>
                <ToastContainer />
              </div>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewDeliveryOrders;
