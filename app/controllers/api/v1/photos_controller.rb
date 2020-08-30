module Api
    module V1
        class PhotosController < ApplicationController
            def index
                photos = Photo.all

                render json: PhotoSerializer.new(photos).serialized_json
            end

            def show
                photo = Photo.find_by_id(params[:id])

                render json: PhotoSerializer.new(photo).serialized_json
            end

            def create
                photo = Photo.new(photo_params)

                if photo.save
                    render json: PhotoSerializer.new(photo).serialized_json     
                else
                    render json: {error: photo.errors.messages}, status: 422
                end
            end

            def update
                photo = Photo.find_by_id(params[:id])

                if photo.update(photo_params)
                    render json: PhotoSerializer.new(photo).serialized_json     
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

            def photo_params
                params.require(:photo).permit(:caption, :file, :url)
            end
        end
    end
end
