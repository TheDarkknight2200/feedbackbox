
from flask import Flask, render_template, request, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'change_this_secret_key'

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///feedbacks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    message = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

ADMIN_USERNAME = 'admin'
ADMIN_PASSWORD = 'password123'

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        name = request.form['name']
        message = request.form['message']
        fb = Feedback(name=name, message=message)
        db.session.add(fb)
        db.session.commit()
        feedbacks = Feedback.query.order_by(Feedback.timestamp.desc()).limit(10).all()
        return render_template('index.html', feedbacks=feedbacks, message="Thank you for your feedback!")
    feedbacks = Feedback.query.order_by(Feedback.timestamp.desc()).limit(10).all()
    return render_template('index.html', feedbacks=feedbacks)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
            session['logged_in'] = True
            return redirect(url_for('admin'))
        else:
            return render_template('login.html', error="Invalid credentials")
    return render_template('login.html')

@app.route('/admin')
def admin():
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    feedbacks = Feedback.query.order_by(Feedback.timestamp.desc()).all()
    return render_template('admin.html', feedbacks=feedbacks)

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('index'))

import os

if __name__ == '__main__':
    with app.app_context():
        if not os.path.exists('feedbacks.db'):
            db.create_all()
    app.run(debug=True)
