require 'rubygems'
require 'httparty'

# HTTParty proxy mapper
class ImageServer
    include HTTParty
    base_uri 'localhost:8089'
    format :json
end

class AnnotationController < ApplicationController
  def segment
    tile = { :tilejson => '1.0.0', :scheme => 'xyz', :tiles => ['https://s3.amazonaws.com/testconvertedimagebucketserve/' + params[:id] + '/0/{x}/{y}'] }
    @tilejson = tile.to_json
    render :layout => false
  end

  def classify
    tile = { :tilejson => '1.0.0', :scheme => 'xyz', :tiles => ['https://s3.amazonaws.com/testconvertedimagebucketserve/' + params[:id] + '/0/{x}/{y}'] }
    @tilejson = tile.to_json
    @rois = ImageServer.get('/image/' + params[:id] + '/rois');
    render :layout => false
  end

end 
