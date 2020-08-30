Rails.application.routes.draw do
  root 'general#index'
  devise_for :admins
  namespace :api do
    namespace :v1 do
      resources :photos, only: [:create]
    end
  end
  
  match '*path', to: 'general#index', via: :all
  # [NOTE] Zayne's CRUD tutorial uses 'get', over 'match'
end
