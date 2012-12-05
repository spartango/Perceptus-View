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
    imageIds = ImageServer.get('/user/' + 'nkivgh' + '/images')
    if params[:id]
      session[:seen_image_ids] = session[:seen_image_ids] ? session[:seen_image_ids] + [ params[:id] ] : [ params[:id] ]
    elsif session[:seen_image_ids]
      idsLeft = imageIds - session[:seen_image_ids]
      params[:id] = idsLeft.sample
      session[:seen_image_ids] = session[:seen_image_ids] + [ params[:id] ]
    else
      params[:id] = imageIds.sample
      session[:seen_image_ids] = [ params[:id] ]
    end
    session[:num_images_seen] = (session[:seen_image_ids].length - 1) % 10 + 1
    idsLeft = imageIds - session[:seen_image_ids]
    @nextId = (idsLeft.empty?) ? false : idsLeft.sample
    tile = { :tilejson => '1.0.0', :scheme => 'xyz', :tiles => ['https://s3.amazonaws.com/testconvertedimagebucketserve2/' + params[:id] + '/0/{x}/{y}'] }
    @imageId = params[:id]
    @tilejson = tile.to_json
  end

  def classify
    imageIds = ImageServer.get('/user/' + 'nkivgh' + '/images')
    if params[:id]
      session[:classified_image_ids] = session[:classified_image_ids] ? session[:classified_image_ids] + [ params[:id] ] : [ params[:id] ]
    elsif session[:classified_image_ids]
      idsLeft = imageIds - session[:classified_image_ids]
      params[:id] = idsLeft.sample
      session[:classified_image_ids] = session[:classified_image_ids] + [ params[:id] ]
    else
      params[:id] = imageIds.sample
      session[:classified_image_ids] = [ params[:id] ]
    end
    session[:num_images_classified] = (session[:classified_image_ids].length - 1) % 10 + 1
    idsLeft = imageIds - session[:classified_image_ids]
    @nextId = (idsLeft.empty?) ? false : idsLeft.sample
    tile = { :tilejson => '1.0.0', :scheme => 'xyz', :tiles => ['https://s3.amazonaws.com/testconvertedimagebucketserve2/' + params[:id] + '/0/{x}/{y}'] }
    @imageId = params[:id]
    @tilejson = tile.to_json
    @rois = ImageServer.get('/image/' + params[:id] + '/rois');
  end

end 
