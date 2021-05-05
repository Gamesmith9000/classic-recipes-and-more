class Api::V1::AuxController < ApplicationController
    protect_from_forgery with: :null_session
    before_action :authenticate_admin!, except: [:show, :get_gallery_ordered_photos, :youtube_video_data]
    
    def get_gallery_ordered_photos
        respond_to do |format|
            format.html { html_disallowed_response }
            format.json { render_serialized_json(aux_data_instance.ordered_photos) }
        end
    end

    def get_youtube_video_data
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

    def show
        respond_to do |format|
            format.html { html_disallowed_response }
            format.json { render_serialized_json(aux_data_instance) }
        end
    end

    def update
        aux_data = aux_data_instance

        if aux_data.update(aux_data_params)
            render_serialized_json(aux_data)   
        else
            render_error(aux_data.errors.messages)
        end
    end

    def update_ordered_photos
        # removed?, new, exisiting
        # make sure removal works properly
    end

    private

    def aux_data_instance
        #   [DESIGN] The record with the lowest id is used as the sole instance
        #   [DESIGN] Creation and deletion must be done via console
        return AuxData.first
    end

    def aux_data_params
        params.require(:aux_data).permit(:about_sections, :ordered_photos,
            :photo_page_ordered_ids =>[], :about_page_sections =>[])
    end

    def inclusion_options
        options = {}
        options[:include] = [:about_sections, :ordered_photos]
        return options
    end

    def render_serialized_json (values)
        render json: AuxDataSerializer.new(values, inclusion_options).serializable_hash.to_json
    end

    def video_params
        params.require(:options).permit(:max)
    end
end
