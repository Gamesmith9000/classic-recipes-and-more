module Api
    module V1
        class PhotosController < ApplicationController
            protect_from_forgery with: :null_session
            before_action :authenticate_admin!, except: [:index, :show, :show_multi]

            def index
                respond_to do |format|
                    format.html { html_disallowed_response }
                    format.json { render_serialized_json(Photo.all) }
                end                
            end

            def show
                respond_to do |format|
                    format.html { html_disallowed_response }
                    format.json {
                        photo = Photo.find_by_id(params[:id])
                        render_serialized_json(photo)
                    }
                end
            end

            def show_multi
                respond_to do |format|
                    format.html { html_disallowed_response }
                    format.json {
                        photos = multi_photos_params.key?(:ids) ? Photo.find(multi_photos_params[:ids].values) : nil
                        render_serialized_json(photos)
                    }
                end                
            end

            def create
                photo = Photo.new(photo_params)

                if photo.save
                    render_serialized_json(photo)
                else
                    render_error(photo.errors.messages)
                end
            end

            def update
                photo = Photo.find_by_id(params[:id])

                if photo.update(photo_params)
                    render_serialized_json(photo)   
                else
                    render_error(photo.errors.messages)
                end
            end

            def destroy
                photo = Photo.find_by_id(params[:id])
                associated_ordered_photos = photo.ordered_photos

                if photo.destroy
                    associated_ordered_photos.each do |o|
                        destroy(o)
                    end

                    associated_recipes.each do |r|
                        r.update(:photo_id => nil)
                    end

                    head :no_content
                else
                    render_error(photo.errors.messages)
                end
            end

            private

            def html_disallowed_response
                # [NOTE][DRY] This is a direct copy of method code from aux_controller
                redirect_back(fallback_location: root_path)
            end

            def multi_photos_params
                params.require(:photos).permit(:ids => {})
            end

            def photo_params
                params.require(:photo).permit(:file, :tag, :title)
            end

            def render_error (error_messages)
                render json: { error: error_messages }, status: 422
            end

            def render_serialized_json (values)
                render json: PhotoSerializer.new(values).serializable_hash.to_json
            end
        end
    end
end
