module Api
    module V1
        class ProductPhotosController < ApplicationController
            protect_from_forgery with: :null_session
            before_action :authenticate_admin!, except: [:index, :show, :show_multi]

            def index
                respond_to do |format|
                    format.html { html_disallowed_response }
                    format.json { render_serialized_json(ProductPhoto.all) }
                end                
            end

            def show
                respond_to do |format|
                    format.html { html_disallowed_response }
                    format.json {
                        product_photo = ProductPhoto.find_by_id(params[:id])
                        render_serialized_json(product_photo)
                    }
                end
            end

            def show_multi
                respond_to do |format|
                    format.html { html_disallowed_response }
                    format.json {
                        if multi_product_photos_params[:ids]
                            product_photos = ProductPhoto.find(multi_product_photos_params[:ids].values)
                        else
                            product_photos = ProductPhoto.all
                        end
                        render_serialized_json(product_photos)
                    }
                end                
            end

            def create
                product_photo = ProductPhoto.new(product_photo_params)

                if product_photo.save
                    render_serialized_json(product_photo)
                else
                    render json: {error: product_photo.errors.messages}, status: 422
                end
            end

            def update
                product_photo = ProductPhoto.find_by_id(params[:id])

                if product_photo.update(product_photo_params)
                    render_serialized_json(product_photo)   
                else
                    render json: {error: product_photo.errors.messages}, status: 422
                end
            end

            def destroy
                product_photo = ProductPhoto.find_by_id(params[:id])

                if product_photo.destroy
                    head :no_content
                else
                    render json: {error: product_photo.error.messages}, status: 422
                end
            end

            private

            def html_disallowed_response
                # [NOTE][DRY] This is a direct copy of method code from aux_controller
                redirect_back(fallback_location: root_path)
            end

            def multi_product_photos_params
                params.require(:product_photos).permit(:ids => {})
            end

            def product_photo_params
                params.require(:product_photo).permit(:file, :tag, :title)
            end

            def render_serialized_json (values)
                render json: ProductPhotoSerializer.new(values).serialized_json
            end
        end
    end
end
