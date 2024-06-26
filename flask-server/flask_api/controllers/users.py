from flask_api import api
from flask import request
import json
from datetime import datetime, timezone, timedelta
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required, create_access_token
from flask_api.models import user

# Test route

@api.route('/test')
def test():
    return "modularized"


# Create User Route

@api.route('/api/users/create', methods=["POST"])
def create_user():
    response = user.User.create_user(request.json)
    if response['hasErrors']:
        return response['errors'], 500
    return response, 201

# Read Users Route

@api.route('/api/users')
@jwt_required()
def read_users():
    all_users = user.User.get_users()
    return (all_users)

@api.route('/api/users/<int:id>')
def read_user_with_recipes(id):
    this_user = user.User.get_user_with_recipes(id)
    return this_user, 201

# Test reading route
@api.route('/api/users/<int:id>/followed_users')
def get_user_with_followed_users(id):
    response = user.User.get_user_with_followed_users(id)
    return response, 201

# Follow User Route

@api.route('/api/users/follow/<int:id>', methods=["POST"])
@jwt_required()
def follow_user(id):
    token_from_request = request.headers['Authorization']
    followed_user = user.User.follow_user(token_from_request, id)
    return followed_user, 201

# UnFollow User Route

@api.route('/api/users/unfollow/<int:followed_user_id>', methods = ["DELETE"])
@jwt_required()
def unfollow_user(followed_user_id):
    token_from_request = request.headers['Authorization']
    response = user.User.unfollow_user(followed_user_id, token_from_request)
    if response['hasErrors']:
        return response['errors'], 500
    return "delete successful", 204

# Bookmark Recipe Route

@api.route('/api/users/bookmark/recipe/<int:recipe_id>', methods=["POST"])
@jwt_required()
def bookmark_recipe(recipe_id):
    token_from_request = request.headers['Authorization']
    user.User.bookmark_recipe(recipe_id, token_from_request)
    return "new bookmark", 201

# Read User's Bookmarks

@api.route('/api/users/bookmarks')
@jwt_required()
def read_users_bookmarks():
    token_from_request = request.headers['Authorization']
    results = user.User.get_users_bookmarks(token_from_request)
    return results, 201

# Delete Bookmark Route

@api.route('/api/users/bookmark/delete/<int:recipe_id>', methods=["DELETE"])
@jwt_required()
def delete_bookmark(recipe_id):
    token_from_request = request.headers['Authorization']
    user.User.delete_bookmark(recipe_id, token_from_request)
    return "delete successful", 204

# Token Refresh

@api.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token 
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response


# JWT Login Route

@api.route('/api/login', methods=["POST"])
def token():
    response = user.User.token(request.json)
    if response['hasErrors']:
        return response['error'], 401
    return response

@api.route('/api/logout', methods=["POST"])
def logout():
    return user.User.logout()