from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class PDFFile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), unique=True, nullable=False)
    file_hash = db.Column(db.String(64), unique=True, nullable=False)
    content_text = db.Column(db.Text, nullable=False)
