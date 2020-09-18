class GeneralController < ApplicationController
  def index
  end

  def get_current_admin
    respond_to do |format|
      format.html { redirect_back(fallback_location: root_path) }
      format.json { render json: current_admin }
    end
  end
end
