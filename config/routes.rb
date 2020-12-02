Rails.application.routes.draw do
  root 'general#index'
  devise_for :admins

  namespace :api do
    namespace :v1 do
      get 'aux/main', :to => 'aux#show'
      patch 'aux/main', :to => 'aux#update'
      get 'aux/youtube_video_data', :to => 'aux#youtube_video_data'
      get 'photos/multi', :to => 'photos#show_multi'    # this must go before photos#show
      resources :photos, only: [:index, :show, :create, :update, :destroy]
      get 'recipes/featured', :to => 'recipes#show_featured'  # this is also order-dependent
      resources :recipes, only: [:index, :show, :create, :update, :destroy]
    end
  end
  
  get '*path', to: 'general#index', via: :all
end
