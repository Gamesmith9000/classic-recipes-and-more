Rails.application.routes.draw do
  devise_for :admins
  root 'general#index'
  resources :photos, only: [:create]
  match '*path', to: 'general#index', via: :all
end
