class PhotosController < ApplicationController
    def create
        @photo = params.require(:photo).permit(:actual_file, :caption)
    end
end
