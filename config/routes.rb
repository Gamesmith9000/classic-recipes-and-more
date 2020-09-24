Rails.application.routes.draw do
  root 'general#index'
  devise_for :admins
  get 'get_current_admin', :to => 'general#get_current_admin', :as => 'get_current_admin'
  get 'get_video_data', :to => 'general#get_video_data', :as => 'get_video_data'

  namespace :api do
    namespace :v1 do
      resources :photos, only: [:index, :show, :create, :update, :destroy]
      resources :recipes, only: [:index, :show, :create, :update, :destroy]
    end
  end
  
  match '*path', to: 'general#index', via: :all
  # [NOTE] Zayne's CRUD tutorial uses 'get', over 'match'
end
