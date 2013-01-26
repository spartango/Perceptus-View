require 'rubygems'
require 'httparty'

# HTTParty proxy mapper
class ImageServer
    include HTTParty
    base_uri 'http://localhost:8089'
    format :json
end

class HomeController < ApplicationController
  def index
  	imageIds = ImageServer.get('/user/nkivgh/images')
  	@imageMetadata = Hash.new
  	imageIds.each do |imageId| 
  	  @imageMetadata[imageId] = ImageServer.get('/rawimage/' + imageId)
  	end
  end
end
