class HomeController < ApplicationController
  def index
    redirect_to :controller => 'annotation', :action => 'classify'
  end
end
