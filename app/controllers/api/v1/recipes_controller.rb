module Api
    module V1
        class RecipesController < ApplicationController
            protect_from_forgery with: :null_session
            before_action :authenticate_admin!, except: [:index, :show, :show_featured]

            def index
                respond_to do |format|
                    format.html { html_disallowed_response }
                    format.json { render_serialized_json(Recipe.all) }
                end
            end

            def show
                respond_to do |format|
                    format.html { html_disallowed_response }
                    format.json {
                        recipe = Recipe.find_by_id(params[:id])
                        render_serialized_json(recipe)
                    }
                end
            end

            def show_featured
                respond_to do |format|
                    format.html { html_disallowed_response }
                    format.json {
                        recipes = Recipe.where(featured: true)
                        render_serialized_json(recipes)
                    }
                end
            end

            def create
                recipe = Recipe.new(recipe_params)

                if recipe.save
                    if params.has_key? :photo_id
                        photo = params[:photo_id].nil? == false ? Photo.find_by_id(params[:photo_id]) : nil
                        photo.update(:recipe_id => recipe.id) if photo.nil? == false
                    end

                    if params.has_key? :instructions
                        params[:instructions].each do |instruction|
                            Instruction.create(:content => instruction[:content], :ordinal => instruction[:ordinal], :recipe_id => recipe.id)
                        end
                    else
                        Instruction.create(:recipe_id => recipe.id, :content => "", :ordinal => 0)
                    end
                    
                    render_serialized_json(recipe)
                else
                    render_error(recipe.errors.messages)
                end
            end

            def update
                recipe = Recipe.find_by_id(params[:id])

                prior_instructions_ids = []
                
                recipe.instructions.each do |p|
                    prior_instructions_ids.push p.id
                end

                prior_photo_id = recipe.photo_id

                if recipe.update(recipe_params)
                    if params.has_key? :photo_id
                        # if a photo_id was specified before updating...
                        if(prior_photo_id.nil? == false)
                            # find the photo (if it exists) and clear out its recipe_id
                            prior_photo = Photo.find_by_id(prior_photo_id)
                            prior_photo.update(:recipe_id => nil) if prior_photo.nil? == false
                        end

                        photo = params[:photo_id].nil? == false ? Photo.find_by_id(params[:photo_id]) : nil

                        if photo.nil? == false
                            photo.update(:recipe_id => recipe.id)
                        else
                            # set photo_id to nil if it wasn't already
                            recipe.update(:photo_id => nil) if prior_photo.nil? == false
                        end
                    end

                    if params.has_key? :instructions
                        params[:instructions].each do |i|
                            has_id_key = i.has_key?(:id) == true
                            item_id = has_id_key == true ? i[:id] : nil
                            existing_instruction = has_id_key == true ? Instruction.find_by_id(item_id) : nil

                            if existing_instruction.nil? == false
                                prior_instructions_ids.delete(i[:id])
                                existing_instruction.update(:content => checked_instruction_content(i[:content]), :ordinal => i[:ordinal])
                            else
                                Instruction.create(:recipe_id => params[:id], :content => checked_instruction_content(i[:content]), :ordinal => i[:ordinal])
                            end
                        end
                    end

                    prior_instructions_ids.each do |d|
                        Instruction.destroy(d)
                    end

                    render_serialized_json(recipe)   
                else
                    render_error(recipe.errors.messages)
                end
            end

            def destroy
                recipe = Recipe.find_by_id(params[:id])
                photo_id = recipe.photo_id

                if recipe.destroy
                    head :no_content
                else
                    render_error(recipe.errors.messages)
                end
            end

            private

            def checked_instruction_content (content_value)
                return content_value.nil? == true ? "" : content_value 
            end

            def inclusion_options
                options = {}
                options[:include] = [:instructions, :photo]
                return options
            end

            def recipe_params
                params.require(:recipe).permit(
                    :description,
                    :featured,
                    :photo_id,
                    :title, 
                    :ingredients => [], 
                    :instructions => [ :content, :id, :ordinal ]
                )
            end

            def render_serialized_json (values)
                render json: RecipeSerializer.new(values, inclusion_options).serializable_hash.to_json
            end
        end
    end
end

