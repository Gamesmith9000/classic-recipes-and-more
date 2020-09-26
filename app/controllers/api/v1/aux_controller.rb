class Api::V1::AuxController < ApplicationController
    def get_current_admin
        respond_to do |format|
          format.html { redirect_back(fallback_location: root_path) }
          format.json { render json: current_admin }
        end
      end
    
      def get_youtube_video_data
        respond_to do |format|
          format.html { redirect_back(fallback_location: root_path) }
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
    
      private
    
      def video_params
        params.require(:options).permit(:max)
      end
end
