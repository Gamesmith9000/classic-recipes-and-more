Rails.application.routes.draw do
  root 'general#index'
  devise_for :admins

  namespace :api do
    namespace :v1 do
      get 'youtube_video_data', :to => 'aux#youtube_video_data'
      get 'aux/main', :to => 'aux#show'
      patch 'aux/main', :to => 'aux#update'
      resources :photos, only: [:index, :show, :create, :update, :destroy]
      resources :recipes, only: [:index, :show, :create, :update, :destroy]
    end
  end
  
  get '*path', to: 'general#index', via: :all
end
