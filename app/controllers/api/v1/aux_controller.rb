class Api::V1::AuxController < ApplicationController
    protect_from_forgery with: :null_session
    before_action :authenticate_admin!, except: [:show, :show_ordered_photos, :youtube_video_data]
    
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

    def show_ordered_photos
        respond_to do |format|
            format.html { html_disallowed_response }
            format.json { render_ordered_photos }
        end
    end

    def update_ordered_photos
        respond_to do |format|
            format.html { html_disallowed_response }
            format.json { 
                if update_ordered_photos_params.has_key?(:ordered_photos) === false
                    return render_error(['Missing key ordered_photos'])
                end

                aux_data = aux_data_instance
                new_items = []
                prior_item_ids = []
                
                aux_data.ordered_photos.each do |p|
                    prior_item_ids.push p.id
                end

                update_ordered_photos_params[:ordered_photos].each do |item|
                    item_id = item.has_key?(:id) == true ? item[:id] : nil
                    existing_item = item_id.nil? ? nil : aux_data.ordered_photos.find_by_id(item_id)

                    if existing_item.nil? == false
                        # only ordinal can be updated here because of the form's setup
                        existing_item.update(:ordinal => item[:ordinal])
                        prior_item_ids.delete(item_id)
                    else
                        new_items.push(item)
                    end
                end

                while new_items.length > prior_item_ids.length
                    new_item = new_items.pop
                    aux_data.ordered_photos.create!(:ordinal => new_item[:ordinal], :photo_id => new_item[:photo_id])
                end

                while new_items.length < prior_item_ids.length
                    item_id = prior_item_ids.pop
                    aux_data.ordered_photos.destroy(item_id)
                    prior_item_ids.delete(item_id)
                end

                if(new_items.length === prior_item_ids.length)
                    # repurpose all newly unused items
                    while(new_items.length > 0)
                        new_item = new_items.pop
                        id_of_recycled_item = prior_item_ids.pop
                        OrderedPhoto.update(id_of_recycled_item, :ordinal => new_item[:ordinal], :photo_id => new_item[:photo_id])
                    end
                end

                render_ordered_photos
            }
        end
    end

    private

    def aux_data_instance
        #   [DESIGN] The record with the lowest id is used as the sole instance
        #   [DESIGN] Creation and deletion must be done via console
        return AuxData.first
    end

    def aux_data_params
        params.require(:aux_data).permit(:about_sections, :ordered_photos)
    end

    def inclusion_options
        options = {}
        options[:include] = [:about_sections, :ordered_photos]
        return options
    end

    def ordered_photos_inclusion_options
        options = {}
        options[:include] = [:photo]
        return options
    end

    def render_ordered_photos
        ordered_photos = aux_data_instance.ordered_photos.order(:ordinal)
        render json: OrderedPhotoSerializer.new(ordered_photos, ordered_photos_inclusion_options).serializable_hash.to_json
    end

    def render_serialized_json (values)
        render json: AuxDataSerializer.new(values, inclusion_options).serializable_hash.to_json
    end

    def update_ordered_photos_params
        params.require(:aux_data).permit(:ordered_photos => [ :id, :ordinal, :photo_id ])
    end

    def video_params
        params.require(:options).permit(:max)
    end
end
