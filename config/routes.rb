Rails.application.routes.draw do
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  devise_for :users, controllers: {
    sessions: 'users/sessions'
  }
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'suppliers#index'
  resources :suppliers, except: :show
  get 'suppliers/search', to: 'suppliers#search'
  resources :users
  resources :companies
  resources :stats
  resources :reportings
  resources :logs
end
