from flask import Flask, request, jsonify, session
from flask_pymongo import PyMongo
from flask_cors import CORS
import os

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb+srv://hirksa04:PoCigixTH2dLdVgK@matecoin.zkwwozh.mongodb.net/?retryWrites=true&w=majority&appName=matecoin'
app.secret_key = 'your_secret_key'
CORS(app)

mongo = PyMongo(app)

@app.route('/api/session/username', methods=['GET'])
def get_username():
    if 'username' in session:
        return jsonify({'username': session['username']})
    return jsonify({'error': 'No session username found'}), 401

@app.route('/api/users/<username>', methods=['GET'])
def get_user(username):
    user = mongo.db.users.find_one({'username': username})
    if user:
        return jsonify({
            'balance': user.get('balance', 0),
            'batteryLevel': user.get('batteryLevel', 10000)
        })
    return jsonify({'error': 'User not found'}), 404

@app.route('/api/update', methods=['POST'])
def update_user():
    data = request.json
    username = data.get('username')
    balance = data.get('balance')
    batteryLevel = data.get('batteryLevel')

    if username:
        mongo.db.users.update_one(
            {'username': username},
            {'$set': {'balance': balance, 'batteryLevel': batteryLevel}},
            upsert=True
        )
        return jsonify({'success': True})
    return jsonify({'error': 'Invalid data'}), 400

@app.route('/api/invite', methods=['POST'])
def handle_invite():
    data = request.json
    inviter_username = data.get('inviterUsername')
    invitee_username = data.get('inviteeUsername')
    
    if inviter_username and invitee_username:
        # Logic to handle invite (e.g., store invite info, award points, etc.)
        return jsonify({'success': True, 'message': f'Invite from {inviter_username} to {invitee_username} processed.'})
    return jsonify({'error': 'Invalid data'}), 400

if __name__ == '__main__':
    app.run(debug=True)
@app.route('/api/invite-link/<username>', methods=['GET'])
def get_invite_link(username):
    # Generate the invite link using the provided username
    invite_link = f"https://t.me/matecoin_bot?start={username}"
    return jsonify({'inviteLink': invite_link})
