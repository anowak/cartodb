# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require File.expand_path('../config/application', __FILE__)
require 'rake'

CartoDB::Application.load_tasks

Rake.application.instance_variable_get('@tasks').delete('default')

namespace :spec do
  desc "Run the code examples in spec/acceptance"
  RSpec::Core::RakeTask.new(:cartodb_acceptance) do |t|
    t.pattern = "spec/acceptance/**/*_spec.rb"
  end
end

task :default => ["db:test:prepare", "spec:models", "spec:cartodb_acceptance"]
