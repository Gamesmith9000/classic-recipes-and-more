Rails.application.routes.draw do
  root 'general#index'
  devise_for :admins

  namespace :api do
    namespace :v1 do
      # Note that there are several order-dependent items (the ones that go before the resources calls)

      get 'aux/main', :to => 'aux#show'
      patch 'aux/main', :to => 'aux#update'
      patch 'aux/remove_photo_id_instances', :to => 'aux#remove_photo_id_instances'
      get 'aux/youtube_video_data', :to => 'aux#youtube_video_data'

      get 'photos/multi', :to => 'photos#show_multi'
      resources :photos, only: [:index, :show, :create, :update, :destroy]

      get 'recipes/featured', :to => 'recipes#show_featured'
      patch 'recipes/remove_photo_id_instances', :to => 'recipes#remove_photo_id_instances'
      resources :recipes, only: [:index, :show, :create, :update, :destroy]
    end
  end
  
  get '*path', to: 'general#index', via: :all
end
