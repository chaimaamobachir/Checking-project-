from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, PDFFile
import fitz  # PyMuPDF pour extraire le texte
import hashlib
import os
import pymysql
pymysql.install_as_MySQLdb()  # Utilisation de PyMySQL au lieu de MySQLdb

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql://root@localhost/pdf_database"
app.config['UPLOAD_FOLDER'] = "uploads"

CORS(app)  # Autorise React à faire des requêtes API
db.init_app(app)

with app.app_context():
    db.create_all()

# Fonction pour extraire le texte d’un PDF
def extract_text(pdf_path):
    doc = fitz.open(pdf_path)
    return "\n".join(page.get_text("text") for page in doc)

# Fonction pour calculer un hash SHA256 du texte
def compute_hash(content):
    return hashlib.sha256(content.encode()).hexdigest()

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "Aucun fichier fourni"}), 400

    file = request.files['file']
    filename = file.filename
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)

    # Extraction du texte
    text = extract_text(file_path)
    file_hash = compute_hash(text)

    # Vérification dans la base de données
    existing_file = PDFFile.query.filter(PDFFile.file_hash == file_hash).first()
    if existing_file:
        print(f"Fichier existant trouvé: {existing_file.filename}")  # Log côté serveur
        return jsonify({
            "error": "Ce fichier ou son contenu existe déjà.",
            "existing_file": {
                "filename": existing_file.filename,
                "file_hash": existing_file.file_hash
            }
        }), 409

    # Enregistrer le fichier dans la base de données
    new_pdf = PDFFile(filename=filename, file_hash=file_hash, content_text=text)
    db.session.add(new_pdf)
    db.session.commit()

    return jsonify({"message": "Fichier uploadé avec succès", "file": {"filename": filename, "file_hash": file_hash}}), 201


@app.route('/files', methods=['GET'])
def get_files():
    files = PDFFile.query.all()
    file_list = [{"filename": file.filename, "file_hash": file.file_hash, "content_text": file.content_text} for file in files]
    return jsonify({"files": file_list})

if __name__ == '__main__':
    app.run(debug=True)
