class Api::V1::AuxController < ApplicationController
    # General API methods

    def get_current_admin
        respond_to do |format|
            format.html { html_disallowed_response }
            format.json { render json: current_admin }
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

    # AuxData retrieval methods
    #   [DESIGN] The record with the lowest id is used as the sole instance

    def about_page_paragraphs
        respond_to do |format|
            format.html { html_disallowed_response }
            format.json { render json: AuxData.first!.about_page_paragraphs }
        end
    end

    def photo_page_ordered_ids
        respond_to do |format|
            format.html { html_disallowed_response }
            format.json { render json: AuxData.first!.photo_page_ordered_ids }
        end
    end

    private

    def html_disallowed_response
        # [NOTE] When someone visits one of the request pages that are only meant for API purposes, this is the response. Consider a 403 response
        redirect_back(fallback_location: root_path)
    end

    def video_params
        params.require(:options).permit(:max)
    end
end
