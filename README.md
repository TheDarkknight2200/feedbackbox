# Boîte à messages anonymes

Ce projet est une application web simple développée en Python avec Flask, permettant à des utilisateurs d'envoyer des messages anonymes avec un code. Un administrateur peut consulter ces messages via une interface sécurisée.

---

## Fonctionnalités

- Envoi de messages anonymes avec code
- Authentification sécurisée pour l'administrateur
- Interface responsive avec Bootstrap
- Mode clair / sombre avec bouton de bascule
- Pagination (10 messages par page)

---

## Installation

1. Cloner le dépôt ou télécharger les fichiers
2. Installer les dépendances :

```bash
pip install -r requirements.txt
```

3. Lancer l'application :

```bash
python app.py
```

4. Accéder à l'application via : [http://127.0.0.1:5000](http://127.0.0.1:5000)

5. Accéder à l'administration : [http://127.0.0.1:5000/login](http://127.0.0.1:5000/login)

- Mot de passe admin par défaut : `admin123` (à modifier dans `app.py`)

---

## Auteur

**Mamadou Lamine Tine**

---

## Déploiement

Cette application peut être déployée facilement sur des services comme [Render](https://render.com) ou [Heroku](https://heroku.com).

---

## Licence

Projet open-source, libre à utiliser et modifier.
