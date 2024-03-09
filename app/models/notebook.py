from .db import db, environment, SCHEMA

class Notebook(db.Model):
    __tablename__ = 'notebooks'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(255))
    notes = db.relationship("Note", back_populates="notebooks", cascade='all, delete')
