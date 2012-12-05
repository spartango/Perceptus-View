class HomeController < ApplicationController
  def index
    redirect_to :controller => 'annotation', :action => 'segment'
  end
end
