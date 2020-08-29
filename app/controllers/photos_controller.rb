class PhotosController < ApplicationController
    def create
        @photo = params.require(:photo).permit(:url, :caption)
    end
end
