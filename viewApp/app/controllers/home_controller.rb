class HomeController < ApplicationController
  def index
    redirect_to :controller => 'annotation', :action => 'segment', :id => 'nkivgh:aa7de9d0099d8cddb1578f04c3114fc'
  end
end
