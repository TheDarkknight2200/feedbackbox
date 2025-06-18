from flask import Flask, render_template, request, redirect, session, url_for
import sqlite3

app = Flask(__name__)
app.secret_key = 'cle_secrete_123'  # Change cette clé en production !


# Page d'accueil : formulaire d'envoi
@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        message = request.form.get('message')
        code = request.form.get('code')
        if not message or not code:
            return render_template('index.html', error="Veuillez remplir tous les champs.")
        conn = sqlite3.connect('messages.db')
        c = conn.cursor()
        c.execute('''
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                code TEXT NOT NULL,
                message TEXT NOT NULL,
                date_sent DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        c.execute("INSERT INTO messages (code, message) VALUES (?, ?)", (code, message))
        conn.commit()
        conn.close()
        return render_template('success.html')
    return render_template('index.html')


# Page login admin
@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        if request.form['password'] == 'admin123':  # Changez le mot de passe
            session['admin_logged_in'] = True
            return redirect(url_for('admin'))
        else:
            error = "Mot de passe incorrect"
    return render_template('login.html', error=error)


# Page logout admin
@app.route('/logout')
def logout():
    session.pop('admin_logged_in', None)
    return redirect(url_for('index'))


# Page admin avec pagination
@app.route('/admin')
def admin():
    if 'admin_logged_in' not in session:
        return redirect(url_for('login'))

    page = request.args.get('page', 1, type=int)
    per_page = 10
    offset = (page - 1) * per_page

    conn = sqlite3.connect('messages.db')
    c = conn.cursor()

    c.execute("SELECT COUNT(*) FROM messages")
    total_messages = c.fetchone()[0]
    total_pages = (total_messages + per_page - 1) // per_page

    c.execute("SELECT * FROM messages ORDER BY date_sent DESC LIMIT ? OFFSET ?", (per_page, offset))
    messages = c.fetchall()
    conn.close()

    return render_template('admin.html', messages=messages, page=page, total_pages=total_pages)


if __name__ == '__main__':
    app.run(debug=True)
