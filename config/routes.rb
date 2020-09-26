Rails.application.routes.draw do
  root 'general#index'
  devise_for :admins

  namespace :api do
    namespace :v1 do
      get 'get_current_admin', :to => 'aux#get_current_admin'
      get 'get_youtube_video_data', :to => 'aux#get_youtube_video_data'
      get 'aux/about_page_paragraphs', :to => 'aux#about_page_paragraphs'
      get 'aux/photo_page_ordered_ids', :to => 'aux#photo_page_ordered_ids'
      resources :photos, only: [:index, :show, :create, :update, :destroy]
      resources :recipes, only: [:index, :show, :create, :update, :destroy]
    end
  end
  
  match '*path', to: 'general#index', via: :all
  # [NOTE] Zayne's CRUD tutorial uses 'get', over 'match'
end
