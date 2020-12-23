module Api
    module V1
        class ProductsController < ApplicationController
            protect_from_forgery with: :null_session
            before_action :authenticate_admin!, except: [:index]

            def index
                respond_to do |format|
                    format.html { html_disallowed_response }
                    format.json { 
                        products = Product.all
                        options = {}
                        options[:include] = [:product_photo]

                        render json: ProductSerializer.new(products, options).serialized_json
                    }
                end
            end

            def html_disallowed_response
                # [NOTE][DRY] This is a direct copy of method code from aux_controller
                redirect_back(fallback_location: root_path)
            end

            def render_serialized_json (values)
                render json: ProductSerializer.new(values).serialized_json
            end
        end
    end
end