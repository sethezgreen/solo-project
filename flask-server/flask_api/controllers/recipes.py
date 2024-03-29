from flask_api import api
from flask import request
from flask_api.models import recipe
from flask_jwt_extended import jwt_required

# Create Recipe Route

@api.route('/api/recipes/create', methods=["POST"])
@jwt_required()
def create_recipe():
    token_from_request = request.headers['Authorization']
    response = recipe.Recipe.create_recipe(request.json, token_from_request)
    if response['hasErrors']:
        return response['errors'], 500
    return response, 201

# Read Recipe Routes

@api.route('/api/recipes/<int:recipe_id>')
def read_recipe(recipe_id):
    one_recipe = recipe.Recipe.read_recipe_with_user(recipe_id)
    return (one_recipe), 200

@api.route('/api/recipes')
def read_all_recipes():
    all_recipes = recipe.Recipe.read_all_recipes_with_user()
    return (all_recipes), 200

# Update Recipe Route

@api.route('/api/recipes/update', methods = ["POST"])
@jwt_required()
def update_recipe():
    token_from_request = request.headers['Authorization']
    response = recipe.Recipe.update_recipe(request.json, token_from_request)
    if response['hasErrors']:
        return response['errors'], 500
    return "update successful", 201

# Delete Recipe Route

@api.route('/api/recipes/delete/<int:recipe_id>', methods = ["DELETE"])
@jwt_required()
def delete_recipe(recipe_id):
    token_from_request = request.headers['Authorization']
    response = recipe.Recipe.delete_recipe(recipe_id, token_from_request)
    if response['hasErrors']:
        return response['errors'], 500
    return "delete successful", 204