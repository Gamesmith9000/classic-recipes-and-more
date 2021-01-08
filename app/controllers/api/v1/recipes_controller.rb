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
                        render json: RecipeSerializer.new(recipe, inclusion_options).serialized_json
                    }
                end
            end

            def show_featured
                respond_to do |format|
                    format.html { html_disallowed_response }
                    format.json {
                        recipes = Recipe.where(featured: true)
                        render json: RecipeSerializer.new(recipes, inclusion_options).serialized_json
                    }
                end
            end

            def create
                recipe = Recipe.new(recipe_params)

                if recipe.save
                    if params.has_key? :instructions
                        params[:instructions].each do |instruction|
                            Instruction.create(:content => checked_instruction_content(instruction[:content]), :recipe_id => recipe.id)
                        end
                    else
                        Instruction.create(:recipe_id => recipe.id, :content => "")
                    end
                    render_serialized_json(recipe)
                else
                    render_error(error: recipe.errors.messages)
                end
            end

            def update
                recipe = Recipe.find_by_id(params[:id])

                if recipe.update(recipe_params)
                    if params.has_key? :sections
                        prior_sections_data = Section.where(recipe_id: params[:id]).order('created_at DESC').reverse_order.as_json
                        new_sections_data = params[:sections]

                        are_fewer_new_sections = (new_sections_data.length < prior_sections_data.length)
                        length_variance = (new_sections_data.length - prior_sections_data.length).abs

                        if are_fewer_new_sections
                            new_sections_data.each_with_index do |data, index|
                                new_data = new_sections_data[index]
                                section_id = prior_sections_data[index][:id]

                                Section.update(new_data[:id], :text_content => new_data[:text_content], :ordered_photo_ids => new_data[:ordered_photo_ids])
                            end

                            length_variance.times do |i|
                                prior_data = prior_sections_data[new_sections_data.length + i]

                                # For some reason, using prior_data[:id] rather than prior_data['id'] causes the key not to be found
                                Section.destroy(prior_data["id"])
                            end
                        else
                            prior_sections_data.each_with_index do |data, index|
                                new_data = new_sections_data[index]
                                section_id = prior_sections_data[index][:id]

                                Section.update(new_data[:id], :text_content => new_data[:text_content], :ordered_photo_ids => new_data[:ordered_photo_ids])
                            end

                            if length_variance > 0
                                length_variance.times do |i|
                                    new_data = new_sections_data[prior_sections_data.length + i]
                                    
                                    Section.create(:recipe_id => params[:id], :text_content => new_data[:text_content], :ordered_photo_ids => new_data[:ordered_photo_ids])
                                end
                            end
                        end
                    end

                    render_serialized_json(recipe)   
                else
                    render_error(error: recipe.errors.messages)
                end
            end

            def destroy
                recipe = Recipe.find_by_id(params[:id])

                if recipe.destroy
                    # Section.where(:recipe_id => params[:id]).destroy_all
                    head :no_content
                else
                    render_error(error: recipe.errors.messages)
                end
            end

            def remove_photo_id_instances
                return if photo_id_removal_params.has_key?(:id) == false

                idParam = photo_id_removal_params[:id]
                instances = Recipe.where(preview_photo_id: idParam)
        
                instances.each do |i|
                    i.update(preview_photo_id: nil)
                end

                q = "'" + idParam.to_s  + "' = ANY (ordered_photo_ids)"
                instances = Section.where(q)
        
                instances.each do |i|
                    updatedArray = i.ordered_photo_ids.select {|p| p != idParam}
                    i.update(ordered_photo_ids: updatedArray)
                end
            end

            private

            def checked_instruction_content (content_value)
                return content_value.nil? ? "" : content_value 
            end

            def html_disallowed_response
                # [NOTE][DRY] This is a direct copy of method code from aux_controller
                redirect_back(fallback_location: root_path)
            end

            def inclusion_options
                options = {}
                options[:include] = [:instructions]
                return options
            end

            def photo_id_removal_params
                params.require(:photo).permit(:id)
            end

            def recipe_params
                params.require(:recipe).permit(
                    :description,
                    :featured,
                    :preview_photo_id,
                    :title, 
                    :ingredients => [], 
                    :instuctions => [ :content, :id  ] # :recipe_id
                )
            end

            def render_error (error_messages)
                render json: { error: error_messages }, status: 422
            end

            def render_serialized_json (values)
                render json: RecipeSerializer.new(values).serialized_json
            end
        end
    end
end

