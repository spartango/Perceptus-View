require 'rubygems'
require 'httparty'

# HTTParty proxy mapper
class ImageServer
    include HTTParty
    base_uri 'http://localhost:8089'
    format :json
end

class ImageController < ApplicationController
  def view
  	@layers = Hash.new
  	if params[:id]
  		@layers['raw'] = 'https://s3.amazonaws.com/testconvertedimagebucketserve2/' + params[:id] + '/0/{X}/{Y}'
  		# tags = ImageServer.get('/tags')
  		# tags.each do |tag|
  		#	@layers['tag'] = 'https://s3.amazonaws.com/testconvertedimagebucketserve2/' + params[:id] + '/0/{X}/{Y}::' + tag
  		# end
  	end
  end
end
