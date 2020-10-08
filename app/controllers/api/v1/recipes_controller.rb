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
                options = {}
                options[:include] = [:sections]
                render json: RecipeSerializer.new(recipe, options).serialized_json
            end

            def create
                recipe = Recipe.new(recipe_params)

                if recipe.save
                    if params.has_key? :sections && params[:sections].length > 0
                        params[:section].each do |section|
                            # [NOTE] validation will be needed to ensure proper creation of new sections
                            # Also consider new vs create
                           Section.create(:recipe_id => section.recipe_id, :text_content => section.text_content, :ordered_photo_ids => section.ordered_photo_ids)
                        end
                    end
                    render_serialized_json(recipe)
                else
                    render json: {error: recipe.errors.messages}, status: 422
                end
            end

            def update
                recipe = Recipe.find_by_id(params[:id])

                if Recipe.update(recipe_params)
                    if params.has_key? :sections
                        prior_sections_data = Section.where(recipe_id: params[:id]).order('created_at DESC').reverse_order.as_json
                        new_sections_data = params[:sections]

                        # The following will successfully update items, but will not work if a new item is added or prior item is deleted

                        prior_sections_data.each_with_index do |data, index|
                            new_data = new_sections_data[index]
                            section_id = prior_sections_data[index][:id]

                            Section.update(new_data[:id], :text_content => new_data[:text_content], :ordered_photo_ids => new_data[:ordered_photo_ids])
                        end
                    end

                    render_serialized_json(recipe)   
                else
                    render json: {error: recipe.errors.messages}, status: 422
                end
            end

            def destroy
                recipe = Recipe.find_by_id(params[:id])

                if recipe.destroy
                    Section.destroy_all(:recipe_id => params[:id])
                    head :no_content
                else
                    render json: {error: recipe.error.messages}, status: 422
                end
            end

            private

            def recipe_params
                params.require(:recipe).permit(
                    :title, 
                    :ingredients => [], 
                    :paragraphs => [],
                    :sections => [ :id, :text_content, :ordered_photo_ids => [] ]
                )
            end

            def render_serialized_json (values)
                render json: RecipeSerializer.new(values).serialized_json
            end
        end
    end
end
