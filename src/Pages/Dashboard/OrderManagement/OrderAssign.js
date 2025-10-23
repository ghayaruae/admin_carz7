import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { ConfigContext } from "../../../Context/ConfigContext";

const OrderAssign = ({ order_id }) => {
  const { apiURL, token } = useContext(ConfigContext);
  const [operators, setOperators] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOperators();
  }, []);

  const loadOperators = () => {
    const headers = {
      token: `${token}`,
      "Content-Type": "application/json",
    };

    axios
      .get(`${apiURL}User/AllUsers`, { headers })
      .then((response) => {
        if (response.data.success) {
          setOperators(response.data.data);
        } else {
          Swal.fire({
            title: "<strong>Error</strong>",
            html: response.data.message,
            icon: "error",
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          title: "<strong>Error</strong>",
          html: error.toString(),
          icon: "error",
        });
      });
  };

  const handleAssign = () => {
    if (!selectedOperator) {
      Swal.fire({
        title: "<strong>Error</strong>",
        html: "Please select an operator",
        icon: "error",
      });
      return;
    }

    setLoading(true);
    const headers = {
      token: `${token}`,
      "Content-Type": "application/json",
    };

    const formData = {
      order_id: order_id,
      order_assigned_to: selectedOperator,
       order_assigned_by: localStorage.getItem('user_id')
    };

    axios
      .post(`${apiURL}User/AssignOrder`, formData, { headers })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          Swal.fire({
            title: "<strong>Success</strong>",
            html: response.data.message,
            icon: "success",
          });
          // Close modal
          document.getElementById("closeAssignModal").click();
        } else {
          Swal.fire({
            title: "<strong>Error</strong>",
            html: response.data.message,
            icon: "error",
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          title: "<strong>Error</strong>",
          html: error.toString(),
          icon: "error",
        });
      });
  };

  return (
    <div className="modal fade" id="assignModal" tabIndex="-1" aria-labelledby="assignModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="assignModalLabel">Assign Order</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeAssignModal"></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="operatorSelect" className="form-label">Select Operator</label>
              <select 
                className="form-select" 
                id="operatorSelect"
                value={selectedOperator}
                onChange={(e) => setSelectedOperator(e.target.value)}
              >
                <option value="">Choose operator...</option>
                {operators.map((operator) => (
                  <option key={operator.user_id} value={operator.user_id}>
                    {operator.user_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={handleAssign}
              disabled={loading}
            >
              {loading ? 'Assigning...' : 'Assign Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderAssign;
