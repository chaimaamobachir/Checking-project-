// src/components/FileTable.js
import React, { useEffect, useState } from "react";
import axios from "axios";


const FileTable = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/files");
        setFiles(response.data.files);
      } catch (err) {
        console.error("Erreur lors de la récupération des fichiers", err);
      }
    };

    fetchFiles();
  }, []); // Appel au backend pour récupérer les fichiers lors du premier rendu

  return (
    <div className="file-table">
      <h3>Fichiers téléchargés</h3>
      <table>
        <thead>
          <tr>
            <th>Nom du fichier</th>

            <th>Contenu extrait</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr key={index}>
              <td>{file.filename}</td>
              
              <td>{file.content_text.substring(0, 100)}...</td> {/* Afficher un extrait du texte */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileTable;
