from flask import Flask, render_template, request, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(__name__)
app.secret_key = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tmp/feedbacks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# MODELE
class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    message = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

with app.app_context():
    db.create_all()

# PAGE ACCUEIL + ENVOI
@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        name = request.form['name']
        message = request.form['message']
        db.session.add(Feedback(name=name, message=message))
        db.session.commit()
        return render_template('index.html', message="Message sent successfully!", feedbacks=[], page=1, has_next=False)

    page = request.args.get('page', 1, type=int)
    per_page = 10
    feedbacks = Feedback.query.order_by(Feedback.timestamp.desc()).paginate(page=page, per_page=per_page)
    return render_template('index.html', feedbacks=feedbacks.items, page=page, has_next=feedbacks.has_next)

# PAGE ADMIN
@app.route('/admin')
def admin():
    if 'logged_in' not in session:
        return redirect(url_for('login'))
    feedbacks = Feedback.query.order_by(Feedback.timestamp.desc()).all()
    return render_template('admin.html', feedbacks=feedbacks)

# LOGIN
@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        if request.form['username'] == 'admin' and request.form['password'] == 'password':
            session['logged_in'] = True
            return redirect(url_for('admin'))
        else:
            error = 'Invalid Credentials'
    return render_template('login.html', error=error)

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('index'))

# LANCEMENT LOCAL
if __name__ == '__main__':
    app.run(debug=True)
