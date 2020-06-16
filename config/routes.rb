Rails.application.routes.draw do
  root 'general#index'
  match '*path', to: 'general#index', via: :all
end
