module Api
    module V1
        class OrderedPhotosController < ApplicationController
            protect_from_forgery with: :null_session
            before_action :authenticate_admin!, except: [:index, :show, :show_multi]

            def index
                respond_to do |format|
                    format.html { html_disallowed_response }
                    format.json { render_serialized_json(OrderedPhoto.all) }
                end
            end

            def show
                respond_to do |format|
                    format.html { html_disallowed_response }
                    format.json {
                        ordered_photo = OrderedPhoto.find_by_id(params[:id])
                        render_serialized_json(ordered_photo, inclusion_options)
                    }
                end
            end

            def show_multi
                respond_to do |format|
                    format.html { html_disallowed_response }
                    format.json {
                        ordered_photos = multi_ordered_photos_params.key?(:ids) ? OrderedPhoto.find(multi_ordered_photos_params[:ids].values) : nil
                        render_serialized_json(ordered_photos, inclusion_options)
                    }
                end                
            end

            def create
                ordered_photo = OrderedPhoto.new(ordered_photo_params)

                if !ordered_photo_params.key?(:aux_data_id)
                    ordered_photo_params[:aux_data_id] = nil
                end
                if !ordered_photo_params.key?(:instruction_id)
                    ordered_photo_params[:instruction_id] = nil
                end

                if ordered_photo.save
                    render_serialized_json(ordered_photo)
                else
                    render_error(ordered_photo.errors.messages)
                end
            end

            def update
                ordered_photo = OrderedPhoto.find_by_id(params[:id])

                if ordered_photo.update(ordered_photo_params)
                    render_serialized_json(ordered_photo)   
                else
                    render_error(ordered_photo.errors.messages)
                end
            end

            # def update_multi
            # end

            def destroy
                respond_to do |format|
                    format.html { html_disallowed_response }
                    format.json {
                        ordered_photo = OrderedPhoto.find_by_id(params[:id])
                        aux_datas = ordered_photo.aux_datas
                        instructions = ordered_photo.instructions

                        if ordered_photo.destroy
                            aux_datas.each do |a|
                                a.ordered_photos.delete(o)
                            end
        
                            instructions.each do |a|
                                a.ordered_photos.delete(o)
                            end
                        else
                            render_error(ordered_photo.errors.messages)
                        end

                        head :no_content
                    }
                end
            end

            private

            def html_disallowed_response
                # [NOTE][DRY] This is a direct copy of method code from aux_controller
                redirect_back(fallback_location: root_path)
            end

            def inclusion_options
                options = {}
                options[:include] = [:photo]
                return options
            end

            def multi_ordered_photos_params
                params.require(:ordered_photos).permit(:ids => {})
            end

            def ordered_photo_params
                params.require(:ordered_photo).permit(:ordinal, :aux_data_id, :instruction_id, :photo_id)
            end

            def render_error (error_messages)
                render json: { error: error_messages }, status: 422
            end

            def render_serialized_json (values, inclusion_options_h = nil)
                if inclusion_options_h.nil?
                    render json: OrderedPhotoSerializer.new(values).serializable_hash.to_json
                else
                    render json: OrderedPhotoSerializer.new(values, inclusion_options_h).serializable_hash.to_json
                end
            end
        end
    end
end
