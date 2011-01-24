CartoDB::Application.routes.draw do

  root :to => "home#index"

  get '/login' => 'sessions#new', :as => :login
  get '/logout' => 'sessions#destroy', :as => :logout
  match '/sessions/create' => 'sessions#create', :as => :create_session

  scope :module => "admin" do
    match '/dashboard'        => 'tables#index', :as => :dashboard
    match '/dashboard/public' => 'tables#index', :as => :dashboard_public, :defaults => {:public => true}
    resources :tables, :only => [:show]
  end

  namespace :api do
    namespace :json do
      get 'table/:id' => 'tables#show', :format => :json
      put 'table/:id/toggle_privacy' => 'tables#toggle_privacy', :format => :json
      put 'table/:id/update' => 'tables#update', :format => :json
    end
  end

end