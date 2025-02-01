import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import FileTable from "./components/FileTable";
import './App.css';  // Assurez-vous d'importer le fichier CSS

function App() {
  const [fileUploaded, setFileUploaded] = useState(null);
  const [files, setFiles] = useState([]); // Stocker les fichiers téléchargés
  const [existingFile, setExistingFile] = useState(null); // Gérer l'affichage des fichiers existants

  const handleFileUploaded = (data) => {
    if (data.error) {
      setFileUploaded(data.error); // Affichage du message d'erreur
      if (data.existing_file) {
        setExistingFile(data.existing_file); // Mise à jour de l'état du fichier existant
      }
    } else {
      setFileUploaded(data.message); // Affichage du message de succès
      if (data.file) {
        setFiles((prevFiles) => [...prevFiles, data.file]); // Ajouter le fichier téléchargé à la liste
      }
      setExistingFile(null); // Réinitialiser l'existant si le fichier n'existe pas déjà
    }
  };

  return (
    <div className="App">
      <h1>PDF Uploader</h1>
      <div>
        <FileUpload onFileUploaded={handleFileUploaded} />
        {fileUploaded && <p>{fileUploaded}</p>} {/* Afficher un message si le fichier est uploadé */}
      </div>

      {/* Affichage des fichiers existants dans un tableau */}
      {existingFile && (
        <div className="existing-file-info">
          <h3>Fichier existant trouvé :</h3>
          <table>
            <thead>
              <tr>
                <th>Nom du fichier</th>
                <th>Hash du fichier</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{existingFile.filename}</td>
                <td>{existingFile.file_hash}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}<br></br>
      <div className="table-container">
        {/* Passer les fichiers téléchargés au tableau */}
        <FileTable files={files} />
      </div>
    </div>
  );
}

export default App;

