class Api::V1::AuxController < ApplicationController
    protect_from_forgery with: :null_session
    before_action :authenticate_admin!, except: [:show, :youtube_video_data]
    
    # General API methods
    
    def youtube_video_data
        respond_to do |format|
            format.html { html_disallowed_response }
            format.json {
                channel = Yt::Channel.new id: ENV['YOUTUBE_CHANNEL_ID']
                all_videos = Array.new
                channel.videos.each do |v|
                    all_videos.push v
                end
                all_videos.sort! { |a, b| b.published_at <=> a.published_at }
        
                use_max = false
        
                if params[:max]
                    max = params[:max].to_i
                    use_max = true if max > 0
                end
        
                if use_max
                    render json: all_videos.pop(max)
                else
                    render json: all_videos   
                end
            }
        end
    end

    # AuxData methods
    #   [DESIGN] The record with the lowest id is used as the sole instance
    #   [DESIGN] Creation and deletion must be done via console

    def show
        respond_to do |format|
            format.html { html_disallowed_response }
            format.json { render_serialized_json(AuxData.first) }
        end
    end

    def update
        aux_data = AuxData.first

        if aux_data.update(aux_data_params)
            render_serialized_json(aux_data)   
        else
            render json: { error: aux_data.errors.messages }, status: 422
        end
    end

    def remove_photo_id_instances
        return if photo_id_removal_params.has_key?(:id) == false

        idParam = photo_id_removal_params[:id]
        q = "'" + idParam.to_s  + "' = ANY (photo_page_ordered_ids)"
        instances = AuxData.where(q)

        instances.each do |i|
            updatedArray = i.photo_page_ordered_ids.select {|p| p != idParam}
            i.update(photo_page_ordered_ids: updatedArray)
        end
    end

    private

    def aux_data_params
        params.require(:aux_data).permit(:photo_page_ordered_ids =>[], :about_page_sections =>[])
    end

    def html_disallowed_response
        # [NOTE] When someone visits one of the request pages that are only meant for API purposes, this is the response. Consider a 403 response
        # [NOTE][DRY] This method is repeated across other API controllers
        redirect_back(fallback_location: root_path)
    end

    def photo_id_removal_params
        params.require(:photo).permit(:id)
    end

    def render_serialized_json (values)
        render json: AuxDataSerializer.new(values).serializable_hash.to_json
    end

    def video_params
        params.require(:options).permit(:max)
    end
end
