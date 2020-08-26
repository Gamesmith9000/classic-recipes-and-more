Rails.application.routes.draw do
  devise_for :admins
  root 'general#index'
  match '*path', to: 'general#index', via: :all
end
