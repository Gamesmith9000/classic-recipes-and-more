module Api
    module V1
        class PhotosController < ApplicationController
            protect_from_forgery with: :null_session
            before_action :authenticate_admin!, except: [:index, :show]

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

            def create
                photo = Photo.new(photo_params)

                if photo.save
                    render_serialized_json(photo)
                else
                    render json: {error: photo.errors.messages}, status: 422
                end
            end

            def update
                photo = Photo.find_by_id(params[:id])

                if photo.update(photo_params)
                    render_serialized_json(photo)   
                else
                    render json: {error: photo.errors.messages}, status: 422
                end
            end

            def destroy
                photo = Photo.find_by_id(params[:id])

                if photo.destroy
                    head :no_content
                else
                    render json: {error: photo.error.messages}, status: 422
                end
            end

            private

            def html_disallowed_response
                # [NOTE][DRY] This is a direct copy of method code from aux_controller
                redirect_back(fallback_location: root_path)
            end

            def photo_params
                params.require(:photo).permit(:file, :tag, :title)
            end

            def render_serialized_json (values)
                render json: PhotoSerializer.new(values).serialized_json
            end
        end
    end
end
