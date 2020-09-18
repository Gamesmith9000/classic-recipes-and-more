module Api
    module V1
        class RecipesController < ApplicationController
            protect_from_forgery with: :null_session
            before_action :authenticate_admin!, only: [:create, :update, :destroy]

            def index
                recipes = Recipe.all

                render_serialized_json(recipes)
            end

            def show
                recipe = Recipe.find_by_id(params[:id])

                render_serialized_json(recipe)
            end

            def create
                recipe = Recipe.new(recipe_params)

                if recipe.save
                    render_serialized_json(recipe)
                else
                    render json: {error: recipe.errors.messages}, status: 422
                end
            end

            def update
                recipe = Recipe.find_by_id(params[:id])

                if Recipe.update(recipe_params)
                    render_serialized_json(recipe)   
                else
                    render json: {error: recipe.errors.messages}, status: 422
                end
            end

            def destroy
                recipe = Recipe.find_by_id(params[:id])

                if recipe.destroy
                    head :no_content
                else
                    render json: {error: recipe.error.messages}, status: 422
                end
            end

            private

            def recipe_params
                params.require(:recipe).permit(:title, :photo_id, :ingredients => [], :paragraphs => [])
            end

            def render_serialized_json (values)
                render json: RecipeSerializer.new(values).serialized_json
            end
        end
    end
end
