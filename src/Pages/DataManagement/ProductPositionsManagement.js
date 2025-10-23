import React, { useState, useEffect, useContext } from 'react';
import PageTitle from "../../Components/PageTitle";
import Select from 'react-select';
import { TextBox, SubmitBtn } from "../../Components/InputElements";
import { ConfigContext } from '../../Context/ConfigContext';
import axios from 'axios';
import Swal from 'sweetalert2';


const ProductPositionsManagement = () => {
  const { gdcURL } = useContext(ConfigContext);
  const [products, setProducts] = useState([]); // State for products
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [ProductPositions, setProductPositions] = useState([]); // Existing positions
  const [positions, setPositions] = useState([]); 
  const [newPosition, setNewPosition] = useState(''); // New position to add
  const [status, setStatus] = useState(false); // Status for loading
  const [limit, setLimit] = useState(4000); // Status for loading
  const [page, setPage] = useState(0); // Status for loading
  const [keyword, setKeyword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [newPositionName, setNewPositionName] = useState(''); // State for new position name
  const [positionImage, setPositionImage] = useState(null); // State for position image

  useEffect(() => {
    GetProducts();
    GetPositions();
  }, []);

  useEffect(() => {
    // if(keyword === "" || keyword.length > 2){
    //   GetProducts();
    // }
    
  }, [keyword]);
  const GetProducts = () => {
    axios.get(`${gdcURL}Products/GetAllProducts`, {params: {limit: limit, page: page, keyword: keyword}})
      .then(response => {
        if (response.data.success) {
          setProducts(response.data.data.map(product => ({
            value: product.PT_ID,
            label: product.PRODUCT_NAME
          })));
        } else {
          console.error('Error fetching products:', response.data.message);
        }
      })
      .catch(error => console.error('Error fetching products:', error));
  }

  const GetPositions = () => {
    axios.get(`${gdcURL}Products/GetPositions`, {params: {limit: limit, page: page, keyword: keyword}})
      .then(response => {
        if (response.data.success) {
          setPositions(response.data.data);
        } else {
          console.error('Error fetching products:', response.data.message);
        }
      })
      .catch(error => console.error('Error fetching products:', error));
  }
  const handleProductChange = (selectedOption) => {
    setSelectedProduct(selectedOption);
    fetchProductPositions(selectedOption.value);
  };

  const fetchProductPositions = (productId) => {
    axios.get(`${gdcURL}Products/GetProductPositions?PT_ID=${productId}`)
      .then(response => {
        if (response.data.success) {
          console.log("p", response.data)
          setProductPositions(response.data.data);
        } else {
          console.error('Error fetching product positions:', response.data.message);
        }
      })
      .catch(error => console.error('Error fetching product positions:', error));
  };

  const handleAddPosition = () => {
    if (!newPosition) {
      Swal.fire('Please select a position to add');
      return;
    }

    setStatus(true);
    console.log({
      PT_ID: selectedProduct.value,
      POSITION_ID: newPosition.POSITION_ID,
      POSITION: newPosition.POSITION
    })
    axios.post(`${gdcURL}Products/AddProductPosition`, {
      PT_ID: selectedProduct.value,
      POSITION_ID: newPosition.POSITION_ID,
      POSITION: newPosition.POSITION
    })
      .then(response => {
        setStatus(false);
        if (response.data.success) {
          Swal.fire('Success', 'Position added successfully');
          fetchProductPositions(selectedProduct.value); // Refresh positions
        } else {
          Swal.fire('Error', response.data.message);
        }
      })
      .catch(error => {
        setStatus(false);
        console.error('Error adding position:', error);
        Swal.fire('Error', error.message);
      });
  };

  const DeleteProductPosition = (productPositionId) => {
    axios.post(`${gdcURL}Products/DeleteProductPosition`, {PRODUCT_POSITION_ID: productPositionId})
      .then(response => {
        if (response.data.success) {
          Swal.fire('Success', 'Position deleted successfully');
          fetchProductPositions(selectedProduct.value); // Refresh positions after deletion
        } else {
          Swal.fire('Error', response.data.message);
        }
      })
      .catch(error => {
        console.error('Error deleting position:', error);
        Swal.fire('Error', error.message);
      });
  };
  const DeletePosition = (PositionId) => {
    axios.post(`${gdcURL}Products/DeletePosition`, {POSITION_ID: PositionId})
      .then(response => {
        if (response.data.success) {
          Swal.fire('Success', 'Position deleted successfully');
          GetPositions() // Refresh positions after deletion
        } else {
          Swal.fire('Error', response.data.message);
        }
      })
      .catch(error => {
        console.error('Error deleting position:', error);
        Swal.fire('Error', error.message);
      });
  };

  const handleAddNewPosition = () => {
    const formData = new FormData();
    formData.append('POSITION', newPositionName);
    formData.append('positionImage', positionImage);

    axios.post(`${gdcURL}Products/AddPosition`, formData)
      .then(response => {
        if (response.data.success) {
          Swal.fire('Success', 'Position added successfully');
          setIsModalOpen(false); // Close modal
          GetPositions(); // Refresh positions

          setNewPositionName(''); // Clear position name
          setPositionImage(null); 
        } else {
          Swal.fire('Error', response.data.message);
        }
      })
      .catch(error => {
        console.error('Error adding position:', error);
        Swal.fire('Error', error.message);
      });
  };

  const handleImageChange = (event, positionId) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPositions(prevPositions =>
          prevPositions.map(item =>
            item.POSITION_ID === positionId ? { ...item, POSITION_IMAGE: reader.result } : item
          )
        );
      };
      reader.readAsDataURL(file);

      // Proceed with the upload as shown above...
    }
  };

  const handlePositionChange = (event, positionId) => {
    const newPosition = event.target.value;
    setPositions(prevPositions =>
      prevPositions.map(item =>
        item.POSITION_ID === positionId ? { ...item, POSITION: newPosition } : item
      )
    );
  };

  const handleUpdatePosition = (positionId) => {
    const positionToUpdate = positions.find(item => item.POSITION_ID === positionId);
    
    const formData = new FormData();
    var hasChanges = false;

    // Check if the position name has changed
    formData.append('POSITION_ID', positionId);
    if (positionToUpdate.POSITION) {
      
      formData.append('POSITION', positionToUpdate.POSITION);
      hasChanges = true;
    }

    // Check if a new image has been selected (optional)
    const fileInput = document.getElementById(`file-input-${positionId}`);
    if (fileInput && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      formData.append('positionImage', file);
      hasChanges = true;
    }

    // If there are changes, send the request
    if (hasChanges) {
      console.log(formData)
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      axios.post(`${gdcURL}Products/UpdatePosition`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(response => {
          if (response.data.success) {
            Swal.fire('Success', 'Position updated successfully');
            GetPositions(); // Refresh positions
          } else {
            Swal.fire('Error', response.data.message);
          }
        })
        .catch(error => {
          console.error('Error updating position:', error);
          Swal.fire('Error', error.message);
        });
    } else {
      
      Swal.fire('No changes detected', 'Please make changes to update.');
    }
  };

  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
          <br />
          <PageTitle title={`Product Positions Management`} primary={`Home`} />
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header align-items-center d-flex">
                  <h4 className="card-title mb-0 flex-grow-1">Manage Product Positions</h4>
                  <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Add New Position</button>
                </div>
                <div className="card-body">
                  <form onSubmit={(e) => { e.preventDefault(); handleAddPosition(); }}>
                    <div className="row gy-4">
                      <div className="col-xxl-5 col-md-12">
                        <Select
                          options={products}
                          onChange={handleProductChange}
                          value={selectedProduct}
                          onInputChange={(e) => setKeyword(e)}
                          placeholder="Select a product"
                        />
                      </div>
                      <div className="col-xxl-5 col-md-12">
                       
                      <Select
                          options={positions}
                          onChange={(e) => {
                            setNewPosition(e); 
                          }}
                          // onChange={handleProductChange}  
                          placeholder="Select a Position"
                        />
                        {/* <select onChange={(e) => setNewPosition(e.target.value)} className="form-control">
                          <option value="">Select Position</option>
                          <option value="Left">Left</option>
                          <option value="Right">Right</option>
                          <option value="Axle Front">Axle Front</option>
                          <option value="Axle Back">Axle Back</option>
                          <option value="Axle Front Right">Axle Front Right</option>
                          <option value="Axle Front Left">Axle Front Left</option>
                          <option value="Axle Back Right">Axle Back Right</option>
                          <option value="Axle Back Left">Axle Back Left</option>
                        </select> */}
                      </div>
                      <div className="col-xxl-2">
                        <SubmitBtn
                          icon={`mdi mdi-plus fs-18`}
                          text={`Add Position`}
                          type={`primary`}
                          status={status}
                        />
                      </div>
                      <hr />
                      <div className="col-xxl-12">
                        <div className='row'>
                          {ProductPositions.map((item, index) => (
                            <div className='col-3' key={index}>
                              <h4>{item.POSITION}</h4>
                              <button 
                                type="button"
                                className='btn btn-xs btn-sm btn-danger' 
                                onClick={() => DeleteProductPosition(item.PRODUCT_POSITION_ID)}
                              >
                                <i className='ri-delete-bin-line'></i>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
     
      
      <div className={`modal fade ${isModalOpen ? 'show' : ''}`} style={{ display: isModalOpen ? 'block' : 'none' }} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden={!isModalOpen}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Add New Position</h5>
              <button type="button" className="close" onClick={() => setIsModalOpen(false)} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Position Name" 
                value={newPositionName} 
                onChange={(e) => setNewPositionName(e.target.value)} 
              />
              <input 
                type="file" 
                className="form-control mt-2" 
                onChange={(e) => setPositionImage(e.target.files[0])} 
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={handleAddNewPosition}>Submit</button>
            </div>
            <div className="modal-footer">
              <table className="table">
                <thead>
                  <tr>
                    <th>IMG</th>
                    <th>Position Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map((item, index) => (
                    <tr key={index} className="py-1">
                      <td style={{ position: 'relative' }}>
                        <img 
                          src={`https://dcapi.carz7.com/productPosition/${item.POSITION_IMAGE ? item.POSITION_IMAGE.split('/').pop() : ''}`} 
                          width={70} 
                          alt={item.POSITION} 
                        />
                        <input 
                          type="file" 
                          style={{ display: 'none' }} 
                          onChange={(e) => handleImageChange(e, item.POSITION_ID)} 
                          id={`file-input-${item.POSITION_ID}`} 
                        />
                        <label 
                          htmlFor={`file-input-${item.POSITION_ID}`} 
                          style={{ position: 'absolute', top: '5px', left: '5px', cursor: 'pointer' }}
                        >
                          <i className='ri-edit-line' style={{ fontSize: '20px', color: 'blue' }}></i>
                        </label>
                      </td>
                      <td>
                        <input 
                          type="text" 
                          value={item.POSITION} 
                          onChange={(e) => handlePositionChange(e, item.POSITION_ID)} 
                        />
                      </td>
                      <td>
                        <button 
                          type="button"
                          className='btn btn-sm btn-success'
                          onClick={() => handleUpdatePosition(item.POSITION_ID)}
                        >
                          <i className='ri-save-line'></i>
                        </button>
                        <button 
                          type="button"
                          className='btn btn-sm btn-danger'
                          onClick={() => DeletePosition(item.POSITION_ID)}
                        >
                          <i className='ri-delete-bin-line'></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPositionsManagement; 
