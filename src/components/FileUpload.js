import React, { useState, useRef } from "react";
import axios from "axios";
import "./FileUpload.css"; // Import du CSS

function FileUpload({ onFileUploaded }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null); // Référence pour l'input caché

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);

    axios
      .post("http://localhost:5000/upload", formData)
      .then((response) => {
        console.log("Réponse du serveur : ", response.data); // Log de la réponse
        onFileUploaded(response.data);  // Passer les données au parent
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          onFileUploaded(error.response.data); // Passer le message d'erreur au parent
        } else {
          console.error("Erreur inconnue : ", error);
        }
      })
      .finally(() => {
        setUploading(false); // Réinitialiser l'état de l'upload
      });
  };

  return (
    <div className="file-upload-container">
      <h2 className="upload-title">Uploader un fichier PDF</h2>

      {/* Zone cliquable pour sélectionner un fichier */}
      <div
        className="file-upload-label"
        onClick={() => fileInputRef.current.click()} // Simule le clic sur l'input caché
      >
        {file ? file.name : "Cliquez pour sélectionner un fichier"}
      </div>

      {/* Input caché avec un style CSS pour être totalement invisible */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden-input"
        onChange={handleFileChange}
      />

      {/* Bouton de téléchargement */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className={`file-upload-button ${uploading ? "disabled" : ""}`}
      >
        {uploading ? "Téléchargement..." : "Télécharger"}
      </button>
    </div>
  );
}

export default FileUpload;
