class ApplicationController < ActionController::Base
    def html_disallowed_response
        # [NOTE] When someone visits one of the request pages that are only meant for API purposes, this is the response. Consider a 403 response (?)
        redirect_back(fallback_location: root_path)
    end

    def render_error (error_messages)
        render json: { error: error_messages }, status: 422
    end
end
