Rails.application.routes.draw do
  root 'general#index'
  devise_for :admins
  namespace :api do
    namespace :v1 do
      resources :photos, only: [:index, :show, :create, :update, :destroy]
    end
  end
  
  match '*path', to: 'general#index', via: :all
  # [NOTE] Zayne's CRUD tutorial uses 'get', over 'match'
end
