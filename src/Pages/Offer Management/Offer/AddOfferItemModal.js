import React, { useContext, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { ConfigContext } from "../../../Context/ConfigContext";
const AddOfferItemModal = ({ offer_id }) => {
  const { apiURL, token } = useContext(ConfigContext);
  const [formData, setFormData] = useState({
    offer_id: offer_id,
    offer_item_app_url: "",
    offer_item_web_url: "",
    offer_item_position: 1,
    OI_ART_ID: "",
    OI_SUP_ID: "",
    OI_STR_ID: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const headers = {
      token: `${token}`,
      "Content-Type": " application/x-www-form-urlencoded",
    };

    axios
      .post(`${apiURL}Offers/AddOfferItem`, formData, { headers })
      .then((response) => {
        if (response.data.success === true) {
          setFormData({
            offer_id: offer_id,
            offer_item_app_url: "",
            offer_item_web_url: "",
            offer_item_position: 1,
            OI_ART_ID: "",
            OI_SUP_ID: "",
            OI_STR_ID: "",
          })
          Swal.fire({
            title: "<strong>Success</strong>",
            html: response.data.message,
            icon: "success",
          });
        
        } else {
          Swal.fire({
            title: "<strong>Error</strong>",
            html: response.data.message,
            icon: "error",
          });
        }
        // console.log('API Response:', JSON.stringify(response.data.success));
      })
      .catch((error) => {
        // Handle any errors that occur during the request
        // console.error('API Error:', error);
        Swal.fire({
          title: <strong>Error</strong>,
          html: error,
          icon: "error",
        });
      });
  };
  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="offer_item_web_url" className="form-label">
            Web URL
          </label>
          <input
            type="text"
            className="form-control"
            id="offer_item_web_url"
            name="offer_item_web_url"
            value={formData.offer_item_web_url}
            onChange={(e) => {
              if(e.target.value){
                const cleanedUrls = e.target.value.split('#')[0];
                const parts = cleanedUrls.split('-')
                
                setFormData({
                  ...formData,
                  ['offer_item_web_url']: e.target.value,
                  ['offer_item_app_url']: e.target.value,
                  ['OI_ART_ID']: parts.at(-1),
                  ['OI_SUP_ID']: parts.at(-2),
                  ['OI_STR_ID']: parts.at(-3),
                });
                // const STR_ID = parts.s.at(-1);
                // const SUP_ID = parts.at(-2);
                // const ART_ID = parts.at(-3);
              }
              
            }}
            // onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="offer_item_app_url" className="form-label">
            App URL
          </label>
          <input
            type="text"
            className="form-control"
            readOnly
            id="offer_item_app_url"
            name="offer_item_app_url"
           
            value={formData.offer_item_app_url}
            placeholder={formData.offer_item_app_url}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="offer_item_position" className="form-label">
            Offer Item Position
          </label>
          <input
            type="text"
            className="form-control"
            id="offer_item_position"
            name="offer_item_position"
            value={formData.offer_item_position}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="OI_ART_ID" className="form-label">
            OI_ART_ID
          </label>
          <input
            type="text"
            readOnly
            className="form-control"
            id="OI_ART_ID"
            name="OI_ART_ID"
            value={formData.OI_ART_ID}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="OI_SUP_ID" className="form-label">
            OI_SUP_ID
          </label>
          <input
            type="text"
            readOnly
            className="form-control"
            id="OI_SUP_ID"
            name="OI_SUP_ID"
            value={formData.OI_SUP_ID}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="OI_STR_ID" className="form-label">
            OI_STR_ID
          </label>
          <input
            type="text"
            readOnly
            className="form-control"
            id="OI_STR_ID"
            name="OI_STR_ID"
            value={formData.OI_STR_ID} 
            
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddOfferItemModal;
