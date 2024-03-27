import React, { useState } from 'react';
import axios from 'axios';

const IndexPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Data = reader.result.split(',')[1];

        const response = await axios.post('https://1v6q9umy9i.execute-api.eu-central-1.amazonaws.com/celebrity', {
          image_bytes: base64Data
        });

        setResponseData(response.data);
        
        if (!response.data || response.data.length === 0) {
          setError("Personne n'a été reconnu, surement une célébrité en devenir !");
          console.log(error.message)
        } else {
          setError(null); // Clear error if response is not empty
        }
      };
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card mb-3">
        
        <div className="card-body">
          <h5 className="card-title">Sélectionnez une image</h5>
          <input
            type="file"
            className="form-control mb-3"
            id="inputImage"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      </div>



      {responseData && (
        <div>
          <h5>Voici les informations sur la célébrité présente sur cette photo !</h5>
          {responseData.map((data, index) => (
            <div key={index} className="card mb-3">
{imagePreview && (
          <img src={imagePreview} className="card-img-top img-fluid" alt="Preview" style={{ maxWidth: '200px' }} />
        )}
              <div className="card-body">
                <h5 className="card-title">{data.Name}</h5>
                <p className="card-text">Id: {data.Id}</p>
                <p className="card-text">Genre: {data.KnownGender}</p>
                <p className="card-text">Sourire: {data.Smile ? 'Oui' : 'Non'}</p>
                <div className="mt-2">
                  {data.Info.map((link, index) => (
                    <a key={index} href={`https://${link}`} target="_blank" className="btn btn-primary me-2">{link}</a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

{error && (
        <div className="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      )}

    </div>
  );
};

export default IndexPage;
