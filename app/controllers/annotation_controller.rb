require 'rubygems'
require 'httparty'

# HTTParty proxy mapper
class ImageServer
    include HTTParty
    base_uri 'http://meta.percept.us:8089'
    format :json
end

class AnnotationController < ApplicationController
 
  def segment
    session[:seen_image_ids] = session[:seen_image_ids] ? session[:seen_image_ids] + [ params[:id] ] : [ params[:id] ]
    session[:num_images_seen] = session[:num_images_seen] ? session[:num_images_seen] + 1 : 1
    if (session[:num_images_seen] >= 11)
      session[:num_images_seen] = 1
    end
    imageIds = ImageServer.get('/user/' + 'nkivgh' + '/images');
    idsLeft = imageIds - session[:seen_image_ids]
    @nextId = (idsLeft.empty?) ? false : idsLeft[0]
    tile = { :tilejson => '1.0.0', :scheme => 'xyz', :tiles => ['https://s3.amazonaws.com/testconvertedimagebucketserve2/' + params[:id] + '/0/{x}/{y}'] }
    @imageId = params[:id]
    @tilejson = tile.to_json
    render :layout => false
  end

  def classify
    tile = { :tilejson => '1.0.0', :scheme => 'xyz', :tiles => ['https://s3.amazonaws.com/testconvertedimagebucketserve2/' + params[:id] + '/0/{x}/{y}'] }
    @imageId = params[:id]
    @tilejson = tile.to_json
    @rois = ImageServer.get('/image/' + params[:id] + '/rois');
    render :layout => false
  end

end 
